# safetyCharts

<!-- badges: start -->
[![R build status](https://github.com/SafetyGraphics/safetyCharts/workflows/R-CMD-check/badge.svg)](https://github.com/SafetyGraphics/safetyCharts/actions)
<!-- badges: end -->

The **safetyCharts** R package contains a set of charts used in clinical trial research. These charts are optimized for usage with the [**safetyGraphics** package](https://safetygraphics.github.io/safetyGraphics/) and shiny application, but can also easily be used as standalone displays. 

# Chart Types

There are several types of charts included in this package: 

- Static Displays - These are written as R functions that output static statistical displays. See the help files for each chart for more details. Saved in `\R`.
- [htmlwidgets]() - Interactive graphics written in javascript and configured for R using the [htmlwidgets](https://www.htmlwidgets.org/) pacakge. Saved in `\inst/htmlwidgets`.
- Chart configuration Files - YAML files specifying chart details needed for safetyGraphics. Saved in `\inst\config`.
- Chart workflow functions - R functions used to prepare data and settings in safetyGraphics. Saved in `\inst\config\workflow` - or maybe in `\R` ....
