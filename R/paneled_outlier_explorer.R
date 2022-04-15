#' Paneled Outlier Explorer
#'
#' @import htmlwidgets
#'
#' @export
#' @example paneledOutlierExplorer(init_paneledOutlierExplorer(adbds, settings))
paneledOutlierExplorer <- function(data, width = NULL, height = NULL, elementId = NULL) {
  
  # forward options using x
  x = list(
    data = data$data, 
    settings = data$settings
  )
  
  # create widget
  htmlwidgets::createWidget(
    name = 'paneledOutlierExplorer',
    x,
    width = width,
    height = height,
    package = 'paneledOutlierExplorer',
    elementId = elementId
  )
}

#' Shiny bindings for paneledOutlierExplorer
#'
#' Output and render functions for using paneledOutlierExplorer within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a paneledOutlierExplorer
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name paneledOutlierExplorer-shiny
#'
#' @export
paneledOutlierExplorerOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'paneledOutlierExplorer', width, height, package = 'paneledOutlierExplorer')
}

#' @rdname paneledOutlierExplorer-shiny
#' @export
renderPaneledOutlierExplorer <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, paneledOutlierExplorerOutput, env, quoted = TRUE)
}
