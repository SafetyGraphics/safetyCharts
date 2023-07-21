context("Tests for the outlierExplorer R module")

library(safetyCharts)
library(shiny)
library(dplyr)
library(shinytest)
library(testthat)

if (interactive()) {
    app <- ShinyDriver$new("module_examples/outlierExplorer")
    initial <- app$getAllValues()
}

test_that("Chart has image and has correct mapping", {
    skip_if_not(interactive())
    expect_equal(substring(initial$output$`example1`$src, 1, 14), "data:image/png")
    mapping <- initial$output$`example1`$coordmap$panels[[1]]$mapping
    expect_equal(length(initial$output$`example1`$coordmap$panels), 3)
    expect_equal(mapping$group, "USUBJID")
    expect_equal(mapping$x, "VISITDY")
    expect_equal(mapping$y, "LBORRES")
    expect_equal(mapping$panelvar1, "LBTEST")
})

test_that("Changing the tests updates the chart", {
    skip_if_not(interactive())
    app$setValue("example1-measures", c("Albumin", "Bilirubin"))
    Sys.sleep(3) # TODO inplement app$waitForValue() instead of sleeping
    new <- app$getAllValues()
    expect_equal(length(new$output$`example1`$coordmap$panels), 2)
    expectUpdate(app, `example1-measures` = c("Albumin"), "example1-outlierExplorer")
})

if (interactive()) app$stop()
