% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/init_aeExplorer.R
\name{init_aeExplorer}
\alias{init_aeExplorer}
\title{Initialize Settings for Adverse Event Explorer widget}
\usage{
init_aeExplorer(data, settings)
}
\arguments{
\item{data}{labs data structured as one record per person per visit per measurement. See details for column requirements.}

\item{settings}{named list of settings}
}
\value{
returns list with data and settings
}
\description{
Initialize Settings for Adverse Event Explorer widget
}
\examples{

init_aeExplorer(safetyData::aes, safetyGraphics::meta)

}
