% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/tendril_chart.R
\name{tendril_chart}
\alias{tendril_chart}
\title{Tendril plot}
\usage{
tendril_chart(data, settings)
}
\arguments{
\item{data}{list of data frames including dataframes named \code{aes} (adverse events) and \code{dm} (demographics)}

\item{settings}{named list of domain-specific settings with the parameters specified below.}
}
\value{
returns a chart object
}
\description{
Create a plot using the {{Tendril}} package
}
\details{
The settings object provides details regarding the columns in the data sets.

\itemize{
\item{"settings$dm$id_col"}{ID column}
\item{"settings$dm$treatment_col"}{Treatment column}
\item{"settings$dm$treatment_values--group1"}{Name of treatment 1}
\item{"settings$dm$treatment_values--group2"}{Name of treatment 2}
\item{"settings$aes$id_col"}{ID column)}
\item{"settings$aes$bodsys_col"}{Body System}
\item{"settings$aes$stdy_col"}{Study Day}
}
}
\examples{
aes <- read.csv("https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/sdtm/cdisc-pilot-01/ae.csv")
dm <- read.csv("https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/sdtm/cdisc-pilot-01/dm.csv")
settings<-list(
     dm=list(
         id_col="USUBJID",
         treatment_col="ARM",
         treatment_values--group1="",
         treatment_values--group2=""
     ),
     aes=list(
         id_col="USUBJID",
         bodsys_col="",
         stdy_col=""
     )
)
  
tendril_plot(list(aes=aes, dm=dm), settings)

}
