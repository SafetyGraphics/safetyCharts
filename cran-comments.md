## Resubmission of an archived package

safetyCharts was archived on CRAN on 2026-03-25 because it required the archived package 'Tendril'.

This release removes that dependency. 'Tendril' is gone from Imports, the tendril chart configuration has been removed so the chart no longer appears in the 'safetyGraphics' application, and `tendril_chart()` is retained as a documented defunct function so that existing code gets an explanation rather than an "object not found" error.

Every remaining dependency is available from CRAN.

The version is 0.5.0. The last version on CRAN was 0.3.0; 0.4.0 was released on GitHub only and is not free to reuse.

`R CMD check --as-cran` reports "New submission" and "Package was archived on CRAN" in the incoming feasibility check. Both are expected for the resubmission of an archived package, and the reason for the archival is resolved as described above.

## Test environments

* local macOS 14.6.1 (aarch64), R 4.3.3

## R CMD check results

<!-- Replace this block with the result of the final pre-submission check, run on
     the exact tarball being uploaded, using the current R-devel. -->

## Downstream dependencies

safetyGraphics imports safetyCharts. It was archived on the same day and for the same reason, and will be resubmitted once this package is accepted.
