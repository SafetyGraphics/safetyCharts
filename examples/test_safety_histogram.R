# test create safety histogram  ---------------------------------------------------------------


test_that("Histogram is created properly", {
  
  
  histogram_settings <- list(
    id_col="USUBJID", # DONE
    value_col="LBORRES", # DONE
    measure_col="LBTEST", # DONE
    visit_col="VISIT", # DONE
    studyday_col="LBDY", # DONE
    normal_col_low="LBORNRLO", # DONE
    normal_col_high="LBORNRHI", # DONE
    visitn_col="VISITNUM", # DONE
    unit_col="LBORRESU", # DONE,
    measure_values = "Phosphate"
    # measure_values = "Albumin" 
  )
  
  output_histogram <- safety_histogram(data = safetyData::sdtm_lb, settings = histogram_settings)
  
  expect_is(output_histogram, "ggplot")
  
})




