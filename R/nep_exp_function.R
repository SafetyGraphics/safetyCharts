####################################################
# program name : nep_exp_function
# programmer : Pavan Vemuri
# creation date: 4/20/2020
# purpose : Generate baseline,chg and pchg values
# input files : LB,DM
# output  files : 
######################################################


library(shiny)
library(dplyr)
library(DT)
library(tibble)
library(sqldf)
library(reshape2)
library(zoo)
library(stringr)
library(haven)
library(lubridate)

lb1= nep_explorer_data %>% filter(TEST %in% c("Creatinine", "Cystatin C", "eGFR", "eGFRcys")) %>% 
  mutate(PARCAT=CAT, PARAM=TEST, AVAL = STRESN, AVALU= STRESU,ADT=DT, LBDT=DT, LBDTC = as.character(DT))

### if lab parameters have a date and partial time. LBDTTM will hold the final date time

lb1b = lb1 %>% mutate(LBDTC_ = LBDTC) %>%
  mutate(LBDTC1 = ifelse(nchar(LBDTC_)==16, paste(LBDTC_, ":00", sep = ""), LBDTC_)) %>%
  mutate(LBDTC2 = ifelse(nchar(LBDTC1)==13, paste(LBDTC1, ":00:00", sep = ""), LBDTC1)) %>%
  mutate(LBDTC3 = ifelse(nchar(LBDTC2)==10, paste(LBDTC2, " 00:00:00", sep = ""), LBDTC2) , TRTSDTC = paste(RFSTDTC, "00:00:00", sep=""), TRTSDT = as.Date(RFSTDTC))
  
lb2 = lb1b %>%  mutate(LBDTTM = ymd_hms(as.POSIXct(strftime(LBDTC3 , "%F %X")) ), LBDT = as.Date(LBDTC))
#lb2 = lb1b %>%  mutate(LBDTTM = ymd_hms(as.POSIXct(strptime(LBDTC3 , "%F %X")) ), LBDT = as.Date(LBDTC))

lb2 = lb1b

#########Create baseline flags

#in our example all dates dont have time. So safe to use just LBDT
sub_dat_dt =lb2 %>%  filter(LBDT<=TRTSDT & !is.na(TRTSDT) & !is.na(LBDT)  & !is.na(AVAL))
#sub_dat_dttm =lb2 %>%  filter(LBDT<=TRTSDT & !is.na(TRTSDT) & !is.na(LBDT) & !is.na(LBDTTM)  & !is.na(AVAL) )

##select last observation on or before TRTSDT
q2a = "select a.*, case a.PARAM when 'Creatinine' then 'creat' when 'Cystatin C' then 'cystac' when 'eGFR' then 'eGFR_creat' when 'eGFRcys' then 'eGFR_cystac' 
end as PARAMCD,  b.BASE,  b.BASEDT from lb2 as a left join (select USUBJID,  max(LBDT) as BASEDT ,
AVAL as BASE, VISITNUM, PARAM,PARCAT from sub_dat_dt  group by USUBJID,PARCAT,PARAM having MAX(LBDT) = LBDT) as b
on a.USUBJID = b.USUBJID and a.PARAM= b.PARAM and a.PARCAT=b.PARCAT"


lb3 = sqldf(q2a)
##create flags
lb3= lb3 %>% mutate(ABLFL = ifelse(BASEDT==LBDT & BASE == AVAL , "Y", NA )) 

###derive CHG,PCHG and FCHG values
lb4 = lb3 %>% 
  mutate(CHG = ifelse(!is.na(TRTSDT) & !is.na(ADT) & ADT >= TRTSDT & is.na(ABLFL) & !is.na(AVAL) & !is.na(BASE), AVAL-BASE, NA), 
         PCHG = ifelse( !is.na(CHG) &CHG != 0 & !is.na(BASE) &BASE !=0, (CHG/BASE)*100, ifelse( !is.na(CHG) &CHG == 0 & !is.na(BASE), 0, NA)),
         ADY = ifelse(!is.na(TRTSDT) & !is.na(ADT) &ADT>=TRTSDT , ADT-TRTSDT +1, ifelse(!is.na(TRTSDT) & !is.na(ADT) &ADT<TRTSDT , TRTSDT-ADT,NA) ),
         FCHG = ifelse(!is.na(CHG) & AVAL>=BASE & BASE != 0, (AVAL/BASE), ifelse(!is.na(CHG) & AVAL<BASE & AVAL!=0 ,-1*(BASE/AVAL), NA))) %>%

   arrange(USUBJID,PARCAT,PARAM,VISITNUM) %>% select(-c(BASE,LBDTC_,LBDTC1,LBDTC2,LBDTC3, BASEDT,TRTSDTC))



###################create variables for each test for CHG,PCHG and FCHG##
lb5_creat = lb4 %>% filter(PARAMCD=='creat')%>% mutate( CREAT_CHG = CHG, CREAT_PCHG = PCHG,  CREAT_FCHG = FCHG  )%>%
  select(USUBJID,VISITNUM,PARCAT,ADT,CREAT_CHG,CREAT_PCHG,CREAT_FCHG) 

lb5_cystac = lb4 %>% filter(PARAMCD=='cystac')%>% mutate( CYSTAC_CHG = CHG, CYSTAC_PCHG = PCHG,  CYSTAC_FCHG = FCHG  )%>%
  select(USUBJID,VISITNUM,PARCAT,ADT,CYSTAC_CHG,CYSTAC_PCHG,CYSTAC_FCHG)
lb5_egfr_creat = lb4 %>% filter(PARAMCD=='eGFR_creat')%>% mutate( eGFR_CREAT_CHG = CHG, eGFR_CREAT_PCHG = PCHG,  eGFR_CREAT_FCHG = FCHG  )%>%
  select(USUBJID,VISITNUM,PARCAT,ADT,eGFR_CREAT_CHG,eGFR_CREAT_PCHG,eGFR_CREAT_FCHG)
lb5_egfr_cystac = lb4 %>% filter(PARAMCD=='eGFR_cystac')%>% mutate( eGFR_CYSTAC_CHG = CHG, eGFR_CYSTAC_PCHG = PCHG,  eGFR_CYSTAC_FCHG = FCHG  )%>%
  select(USUBJID,VISITNUM,PARCAT,ADT,eGFR_CYSTAC_CHG,eGFR_CYSTAC_PCHG,eGFR_CYSTAC_FCHG)

###MERGE back to lab data. remove the test variable and keep unique rows
lb4a = lb4%>% select(-c(TEST)) %>% distinct(USUBJID,VISITNUM,PARCAT,ADT,.keep_all = TRUE)
lb5_1 = left_join(lb4a,lb5_creat, by = c("USUBJID","VISITNUM","PARCAT","ADT"))
lb5_12 = left_join(lb5_1,lb5_cystac, by = c("USUBJID","VISITNUM","PARCAT","ADT"))
lb5_123 = left_join(lb5_12,lb5_egfr_creat, by = c("USUBJID","VISITNUM","PARCAT","ADT"))
lb5_1234 = left_join(lb5_123,lb5_egfr_cystac, by = c("USUBJID","VISITNUM","PARCAT","ADT"))
###Keep  needed variables for graph

lb6 = lb5_1234 %>% select(USUBJID,VISITNUM,PARCAT,ADT,AGE,SEX,RACE,ARM,ABLFL, starts_with (c("CREAT", "eGFR" ,"CYSTAC")))

################################################################
###create maximal change parameter within a specified window
#####below code is ongoing Please do not review
###################################################################
lb7 = lb4 %>% filter(PARAMCD %in% c('creat', 'cystac', 'eGFR_creat' ,'eGFR_cystac')) 


#q3 = "select USUBJID,PARAMCD, count( *) as nrows from lb7 as a group by USUBJID,PARAMCD "

#lb8_ = sqldf(q3)

#q3 = "select a.* , nrows from lb7 as a left join lb8_ as b on a.USUBJID=b.USUBJID and a.PARAMCD=b.PARAMCD" 

#lb8_a = sqldf(q3)  

#lb8_b = lb8_a %>% mutate(seq = seq(1,nrows,by=5))
library(runner)

lb8 = lb7 %>% group_by(USUBJID, PARAMCD)%>%  mutate(MINAVAL= rollapplyr(AVAL, 5, min, na.rm = TRUE, fill = NA, align = 'right', partial = TRUE)) %>%
            mutate(MAXAVAL= rollapplyr(AVAL, 5, max, na.rm = TRUE, fill = NA, align = 'right', partial = TRUE))  %>% mutate(MAXCHG_ = MAXAVAL-MINAVAL)



lb9  = lb8 %>%group_by(USUBJID, PARAMCD)%>% slice(which(row_number() %% 5 == 1))
lb9 = lb8 %>% group_by(USUBJID, PARAMCD) %>% sample_n(5,replace=T)

slice(by_cyl, 1:2)

