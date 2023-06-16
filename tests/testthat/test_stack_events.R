# Test data

settings <- list(
    aes = list(
        id_col = "USUBJID",
        bodsys_col = "AEBODSYS",
        term_col = "AEDECOD",
        term_col = "AETERM",
        severity_col = "AESEV",
        stdy_col = "AESTDY",
        endy_col = "AEENDY"
    ),
    cm = list(
        id_col = "USUBJID",
        cmtrt_col = "CMTRT",
        stdy_col = "CMSTDY",
        endy_col = "CMENDY",
        class_col = "CMCLAS",
        desc_col = "CMINDC"
    )
)
data <- list(aes=safetyData::sdtm_ae, cm=safetyData::sdtm_cm)


# standardize_events tests

test_that('stops if id_col is missing in settings', {
    settings2 <- settings$aes
    settings2$id_col <- NULL
    expect_error(standardize_events(data$aes, settings2))
})

test_that('stops if id_col in settings is not found in the data', {
    settings2$id_col <- "Notanidcol"
    expect_error(standardize_events(data$aes, settings2))
})

test_that('stops if stdy_col in settings is not found in the data', {
    settings3 <- settings$aes
    settings3$stdy_col <- "notacol"
    expect_error(standardize_events(data$aes, settings3))
})

test_that('adds col of NA if stdy_col is missing in settings', {
    settings3$stdy_col <- NULL
    df<-standardize_events(data$aes, settings3)
    expect_true(all(is.na(df$stdy)))
})

test_that('stops if endy_col in settings is not found in the data', {
    settings4 <- settings$aes
    settings4$endy_col <- "notacol"
    expect_error(standardize_events(data$aes, settings4))
})

test_that('adds col of NA if stdy_col is missing in settings', {
    settings4$endy_col <- NULL
    df<-standardize_events(data$aes, settings4)
    expect_true(all(is.na(df$endy)))
})

aedf<-standardize_events(data$aes, settings$aes,domain="aes")
test_that('returns a data.frame with the expected names', {
    expect_true(is.data.frame(aedf))
    expect_setequal(names(aedf), c("id","domain","stdy","endy","details"))
})

test_that('ae output matches raw data', {
    expect_equal(aedf$id, data$aes$USUBJID)
    expect_equal(aedf$stdy, data$aes$AESTDY)
    expect_equal(aedf$endy, data$aes$AEENDY)
})

test_that('ae domain is set correctly',{
    expect_true(all(aedf$domain=="aes"))
})


cmdf<-standardize_events(data$cm, settings$cm, domain="cm")
test_that('cm returns a data.frame with the expected names', {
    expect_true(is.data.frame(cmdf))
    expect_setequal(names(cmdf), c("id","domain","stdy","endy","details"))
})

#stack events tests

all<-stack_events(data,settings,domains=c("aes","cm"))
test_that('returns a dataframe with the right rows/cols', {
    expect_true(is.data.frame(all))
    expect_setequal(names(all), c("id","domain","stdy","endy","details"))
    expect_equal(nrow(all), nrow(data$aes)+nrow(data$cm))
})

all2<-stack_events(data,settings,domains=c("aes","cm","some","other","domains"))
test_that('ignores invalid domains', {
    expect_message(stack_events(data,settings,domains=c("aes","cm","some","other","domains")))
    expect_true(is.data.frame(all2))
    expect_setequal(names(all2), c("id","domain","stdy","endy","details"))
    expect_equal(nrow(all2), nrow(data$aes)+nrow(data$cm))
})