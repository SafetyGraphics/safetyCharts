configurations <- system.file('config', package = 'safetyCharts') %>%
    list.files(full.names = TRUE) %>%
    purrr::map(~yaml::read_yaml(.x))

test_that('Chart configurations include all required properties.', {
    expected_properties <- c(
        'dataSpec',
        'domain',
        'env',
        'export',
        'label',
        'links',
        #'order',
        'package',
        'type',
        'workflow'
    )

    for (i in seq_along(configurations)) {
        configuration <- configurations[[ i ]]
        actual_properties <- names(configuration) %>% sort()
        missing_properties <- setdiff(expected_properties, actual_properties)

        expect_true(
            length(missing_properties) == 0
        )
    }
})

test_that('Chart configuration domains match domains in data specification.', {
    for (i in seq_along(configurations)) {
        configuration <- configurations[[ i ]]

        expect_equal(
            configuration$domain %>% sort(),
            names(configuration$dataSpec) %>% sort()
        )
    }
})
