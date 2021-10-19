# Note: expected to be run from the root package directory
library(tidyverse)
library(usethis)

#Copy metadata to /data
meta_ecg<-read_csv("data-raw/meta_ecg.csv")
usethis::use_data(meta_ecg, overwrite = TRUE)
