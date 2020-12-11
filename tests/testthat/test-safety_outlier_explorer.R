context("safety_outlier_explorer")

# Compare to basic plot ---------------------------------------------------

test_that("Summary with all measures", {
  
  settings <- list(
    id_col="USUBJID",
    value_col="STRESN",
    measure_col="TEST",
    visit_col="VISIT",
    studyday_col="DY",
    normal_col_low="STNRLO",
    normal_col_high="STNRHI",
    visitn_col="VISITN",
    unit_col="STRESU"
  )
  
  # There's a warning generated here 
  # Removed 34 row(s) containing missing values (geom_path).
  plot_summary_all_measures <- safetyCharts::safety_outlier_explorer(
    data=clinical_trial_dataframe, 
    settings=settings
  )
  
  vdiffr::expect_doppelganger("safety_outlier_explorer", plot_summary_all_measures)
  
})
