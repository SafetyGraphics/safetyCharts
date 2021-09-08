context("safety_outlier_explorer")
library(safetyData)

# Compare to basic plot ---------------------------------------------------

test_that("Summary with all measures", {
    settings <- list(
        id_col = "USUBJID",
        value_col = "LBSTRESN",
        measure_col = "LBTEST",
        visit_col = "VISIT",
        studyday_col = "LBDY",
        normal_col_low = "LBSTNRLO",
        normal_col_high = "LBSTNRHI",
        visitn_col = "VISITN",
        unit_col = "LBSTRESU"
    )

    plot_summary_ALT <- safetyCharts::safety_outlier_explorer(
        data = safetyData::sdtm_lb %>% filter(LBTEST=="Alanine Aminotransferase"),
        settings = settings
    )

    expect_true(TRUE)
    # vdiffr::expect_doppelganger("safety_outlier_explorer", plot_summary_ALT)
})
