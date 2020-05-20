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
library(zoo)
library(stringr)
library(haven)
library(lubridate)

lb1= nep_explorer_data %>% mutate(PARCAT=CAT, PARAM=TEST, AVAL = STRESN, AVALU= STRESU,ADT=DT, LBDT=DT, LBDTC = as.character(DT))
#lb1b = lb1 %>%  mutate(LBDTC_ = (str_replace(LBDTC, "[T]", " "))) %>% 
 # mutate(LBDTC1 = ifelse(nchar(LBDTC_)==16, paste(LBDTC_, ":00", sep = ""), LBDTC_)) %>%
  #mutate(LBDTC2 = ifelse(nchar(LBDTC1)==13, paste(LBDTC1, ":00:00", sep = ""), LBDTC1)) %>%
  #mutate(LBDTC3 = ifelse(nchar(LBDTC2)==10, paste(LBDTC2, "00:00:00", sep = ""), LBDTC2) , TRTSDTC = paste(RFSTDTC, "00:00:00", sep=""), TRTSDT = as.Date(RFSTDTC))


lb1b = lb1 %>% mutate(LBDTC_ = LBDTC) %>%
  mutate(LBDTC1 = ifelse(nchar(LBDTC_)==16, paste(LBDTC_, ":00", sep = ""), LBDTC_)) %>%
  mutate(LBDTC2 = ifelse(nchar(LBDTC1)==13, paste(LBDTC1, ":00:00", sep = ""), LBDTC1)) %>%
  mutate(LBDTC3 = ifelse(nchar(LBDTC2)==10, paste(LBDTC2, " 00:00:00", sep = ""), LBDTC2) , TRTSDTC = paste(RFSTDTC, "00:00:00", sep=""), TRTSDT = as.Date(RFSTDTC))
  
#lb2 = lb1b %>%  mutate(LBDTTM = ymd_hms(as.POSIXct(strptime(LBDTC3 , "%Y-%m-%d %H:%M")) ), LBDT = as.Date(LBDTC))

lb2 = lb1b


sub_dat_dt =lb2 %>%  filter(LBDT<=TRTSDT & !is.na(TRTSDT) & !is.na(LBDT)  & !is.na(AVAL))
#sub_dat_dttm =lb2 %>%  filter(LBDT<=TRTSDT & !is.na(TRTSDT) & !is.na(LBDT) & !is.na(LBDTTM)  & !is.na(AVAL) )

subq2 = "Select distinct a.* ,min(LBDT) as MINDT from sub_dat_dt as a 
 group by USUBJID, VISITNUM, PARCAT, PARAM, LBDT having LBDT = min(LBDT) "
sub_datf = sqldf(subq2)

q2a = "select a.*,b.BASE,  b.BASEDT from lb2 as a left join (select USUBJID,  max(LBDT) as BASEDT ,
AVAL as BASE, VISITNUM, PARAM,PARCAT from sub_datf  group by USUBJID,PARCAT,PARAM having MAX(LBDT) = LBDT) as b
on a.USUBJID = b.USUBJID and a.PARAM= b.PARAM and a.PARCAT=b.PARCAT"


lb3 = sqldf(q2a)

lb3= lb3 %>% mutate(ABLFL = ifelse(BASEDT==LBDT & BASE == AVAL , "Y", NA )) 


lb4 = lb3 %>% 
  mutate(CHG = ifelse(!is.na(TRTSDT) & !is.na(ADT) & ADT >= TRTSDT & is.na(ABLFL) & !is.na(AVAL) & !is.na(BASE), AVAL-BASE, NA), 
         PCHG = ifelse( !is.na(CHG) &CHG != 0 & !is.na(BASE) &BASE !=0, (CHG/BASE)*100, ifelse( !is.na(CHG) &CHG == 0 & !is.na(BASE), 0, NA)),
         ADY = ifelse(!is.na(TRTSDT) & !is.na(ADT) &ADT>=TRTSDT , ADT-TRTSDT +1, ifelse(!is.na(TRTSDT) & !is.na(ADT) &ADT<TRTSDT , TRTSDT-ADT,NA) ),
         FCHG = ifelse(!is.na(CHG) & AVAL>=BASE & BASE != 0, (AVAL/BASE), ifelse(!is.na(CHG) & AVAL<BASE & AVAL!=0 ,-1*(BASE/AVAL), NA))) %>%

   arrange(USUBJID,PARCAT,PARAM,VISITNUM) %>% select(-c(BASE,LBDTC_,LBDTC1,LBDTC2,LBDTC3, BASEDT,TRTSDTC))



