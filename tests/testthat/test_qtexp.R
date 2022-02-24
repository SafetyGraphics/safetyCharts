



#remotes::install_github("SafetyGraphics/safetyGraphics@dev")
#remotes::install_github("SafetyGraphics/safetyCharts@dev")
#remotes::install_github("rstudio/bslib")

library(tidyverse)
library(safetyGraphics)
library(safetyCharts)


adeg <- readr::read_csv("https://physionet.org/files/ecgcipa/1.0.0/adeg.csv?download") %>%
  mutate(ATPTFCT = forcats::fct_reorder(ATPT, .x = ATPTN, .fun = min)) %>%
  mutate(ANRHI=0, ANRLO=0)

mappingsQT <- list(
  ecg=list(
    'visit_col'='ATPT',
    'visitn_col'='ATPTN'
  )
)

allQTCharts<-makeChartConfig(dirs="/home/xni/R/x86_64-pc-linux-gnu-library/4.0/safetyCharts/config", 
                             packages = NULL,
                             packageLocation = NULL)  %>% 
  purrr::map(function(chart){
    chart$order <- 1
    return(chart)
  }) %>% 
  purrr::keep(~ grepl(pattern = "qt", .x$name, ignore.case = TRUE ))


safetyGraphicsApp(
  charts = allQTCharts,
  domainData = list(ecg=adeg), 
  meta = safetyCharts::meta_ecg, 
  mapping = mappingsQT
)

# jerry's data
tb.p2<- read.csv("./tmp/data/tb/Phase2ExampleData.csv") %>% 
  mutate(ANRHI=0, ANRLO=0)
tb.p2 %>% glimpse

#tb.p1<- read.csv("./tmp/data/tb/SASMADExampleData.csv")

#qt <- readr::read_csv("https://physionet.org/files/ecgcipa/1.0.0/adeg.csv?download") %>%
  #mutate(ATPTFCT = forcats::fct_reorder(ATPT, .x = ATPTN, .fun = min)) %>%



mapping_p2 <- yaml::read_yaml(text = 
"
ecg:
  id_col: ID
  value_col: VALUE
  measure_col: PARAM
  measure_values:
    QT: ''
    QTcF: QTCF
    QTcB: ''
    RR: HR
    QRS: ''
  normal_col_low: ANRLO
  normal_col_high: ANRHI
  studyday_col: DAY
  visit_col: VISIT
  visitn_col: DAY
  tpt_col: TIME
  tptn_col: TIME
  period_col: ''
  unit_col: ''
  baseline_flag_col: ''
  baseline_flag_values: ''
  treatment_col: TREAT
  analysis_flag_col: ''
  analysis_flag_values: ''
")


safetyGraphicsApp(
  charts = allQTCharts,
  domainData = list(ecg=tb.p2), 
  meta = safetyCharts::meta_ecg, 
  mapping = mapping_p2
)

