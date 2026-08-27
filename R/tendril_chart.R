#' Tendril plot (defunct)
#'
#' @description
#' `tendril_chart()` is defunct as of safetyCharts 0.5.0 and no longer works.
#'
#' It drew a tendril plot using the \pkg{Tendril} package, which was archived
#' from CRAN on 2026-03-25 and has had no release since 2020. Because
#' `safetyCharts` imported \pkg{Tendril}, `safetyCharts` was archived on the same
#' day, and `safetyGraphics` followed for importing `safetyCharts`.
#'
#' The dependency has been dropped so that both packages can return to CRAN. The
#' function is kept, and kept exported, so that existing code calling it fails
#' with an explanation instead of an "object not found" error.
#'
#' The Tendril Plot has also been removed from the chart list used by the
#' `safetyGraphics` Shiny application, so it no longer appears there.
#'
#' @param data Ignored. Formerly a list of data frames including data frames
#'   named `aes` (adverse events) and `dm` (demographics).
#' @param settings Ignored. Formerly a named list of domain-specific settings.
#'
#' @details
#' The last working implementation is preserved in the package's version control
#' history at <https://github.com/SafetyGraphics/safetyCharts>. Users who still
#' need the chart can install the archived \pkg{Tendril} package from the CRAN
#' archive at <https://cran.r-project.org/src/contrib/Archive/Tendril/> and call
#' `Tendril::Tendril()` directly.
#'
#' @return This function does not return a value. It always raises an error of
#'   class `defunctError`.
#'
#' @examples
#' # tendril_chart() is defunct and always raises an error:
#' try(tendril_chart(data = NULL, settings = NULL))
#'
#' @export
#'
tendril_chart <- function(data, settings) {
    .Defunct(
        msg = paste0(
            "'tendril_chart()' is defunct as of safetyCharts 0.5.0.\n",
            "The 'Tendril' package it depended on was archived from CRAN on ",
            "2026-03-25, so 'safetyCharts' dropped the dependency in order to ",
            "return to CRAN.\n",
            "To draw a tendril plot, install 'Tendril' from the CRAN archive ",
            "(https://cran.r-project.org/src/contrib/Archive/Tendril/) and call ",
            "Tendril::Tendril() directly."
        )
    )
}
