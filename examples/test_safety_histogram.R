
config <- list()
config[["description"]] <- "Test page"
config[["data"]] <- "https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv"
config[["settings"]] <- safetyGraphics::generateSettings("sdtm", charts = "safetyhistogram")

data <- read.csv("https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv",
    stringsAsFactors = FALSE, na.strings = c("NA", "")
)
settings <- config[["settings"]]
settings[["unit_col"]] <- "STRESU"
description <- config[["description"]]

source("R/safety_histogram.R")
p <- safety_histogram(data = data, settings = settings, description = config$description)
ggsave("examples/test_safety_histogram.png", plot = p, dpi = 300)
