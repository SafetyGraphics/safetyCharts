# Note: expected to be run from the root package directory
library(tidyverse)
library(usethis)

 # brackets after read_csv to remove spec_tbl_df class per https://www.tidyverse.org/blog/2018/12/readr-1-3-1/

#Copy metadata to /data
#ecg
meta_ecg<-read_csv("data-raw/meta_ecg.csv")[]
usethis::use_data(meta_ecg, overwrite = TRUE)

#labs
meta_labs<-read_csv("data-raw/meta_labs.csv")[]
usethis::use_data(meta_labs, overwrite = TRUE)

#aes
meta_aes<-read_csv("data-raw/meta_aes.csv")[]
usethis::use_data(meta_aes, overwrite = TRUE)

#cm
meta_cm<-read_csv("data-raw/meta_cm.csv")[]
usethis::use_data(meta_cm, overwrite = TRUE)

#dm
meta_dm<-read_csv("data-raw/meta_dm.csv")[]
usethis::use_data(meta_dm, overwrite = TRUE)

#hepExplorer
meta_hepExplorer<-read_csv("data-raw/meta_hepExplorer.csv")[]
usethis::use_data(meta_hepExplorer, overwrite = TRUE)
