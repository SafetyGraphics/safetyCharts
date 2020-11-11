# Test Widget for forestplot at https://github.com/jwildfire/forest-plot

install_github("safetyGraphics/safetyCharts",ref="forestPlot")

library(devtools)
library(safetyCharts)
library(jsonlite)

test.data<- fromJSON("https://raw.githubusercontent.com/jwildfire/forest-plot/master/data/data.json", flatten=TRUE)

x <- list( 
    data=test.data,
    groups=c("pbo","high","low"),
    pairs=list(list("low","pbo"),list("high","pbo"))
)

htmlwidgets::createWidget(
  name = 'forestPlot',
  package = 'safetyCharts',
  x
)