context("safety histogram")

# Compare to basic plot ---------------------------------------------------

test_that("Summary with all measures", {
  
})


# test --------------------------------------------------------------------


# config <- list()
# config[["description"]] <- "Test page"
# config[["data"]] <- "https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv"
# config[["settings"]] <- safetyGraphics::generateSettings("sdtm", charts="safetyhistogram")
# 
# data <- read.csv('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv',
#                  stringsAsFactors = FALSE, na.strings = c("NA",""))
# settings <- config[["settings"]]
# settings[["unit_col"]] <- "STRESU"
# description <- config[["description"]]
# 
# source("R/safety_histogram.R")
# p <- safety_histogram(data=data, settings=settings, description=config$description)
# ggsave("examples/test_safety_histogram.png", plot=p, dpi=300)


# testing code ------------------------------------------------------------

# testing
#highlight, cmd + shift + c to uncomment chunk below
# config <- list()
# config[["description"]] <- "Test page"
# config[["data"]] <- "https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv"
# config[["settings"]] <- safetyGraphics::generateSettings("sdtm", charts=NULL)
# 
# data <- read.csv(config[["data"]], stringsAsFactors = FALSE, na.strings = c("NA",""))
# settings <- config[["settings"]]
# settings[["unit_col"]] <- "STRESU"
# # selections within the graphic
# settings[["measure_values"]] = c("Bicarbonate","Chloride")  # if no  parameter selected, defaults to first (albumin)
# settings[["low_lim"]] = c(20,90)
# settings[["up_lim"]] = c(35,120)
# description <- config$description
