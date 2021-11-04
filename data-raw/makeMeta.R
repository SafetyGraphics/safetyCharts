# Note: expected to be run from the root package directory
library(tidyverse)
library(usethis)

#Copy metadata to /data
#ecg
meta_ecg<-read_csv("data-raw/meta_ecg.csv")
usethis::use_data(meta_ecg, overwrite = TRUE)

#labs
meta_labs<-read_csv("data-raw/meta_labs.csv")
usethis::use_data(meta_labs, overwrite = TRUE)

#aes
meta_aes<-read_csv("data-raw/meta_aes.csv")
usethis::use_data(meta_aes, overwrite = TRUE)

#dm
meta_dm<-read_csv("data-raw/meta_dm.csv")
usethis::use_data(meta_dm, overwrite = TRUE)
