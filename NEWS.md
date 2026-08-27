# safetyCharts v0.5.0 (Upcoming)

This is the first release since v0.3.0 and is the release that returns safetyCharts to CRAN.

## Removed: the Tendril Plot

- The `Tendril` package was archived from CRAN on 2026-03-25 ("issues were not corrected despite reminders") and has had no release since 2020. Because safetyCharts imported it, safetyCharts was archived the same day, and safetyGraphics was archived for importing safetyCharts.
- `Tendril` has been dropped from `Imports`. That is the whole reason both packages could not stay on CRAN, and dropping it is what lets them return.
- The Tendril Plot has been removed from the chart list (`inst/config/tendril.yaml` deleted), so it no longer appears in the safetyGraphics Shiny application.
- `tendril_chart()` is still exported and still documented, but it is now defunct: calling it raises an error explaining what happened and how to draw the chart directly with the archived `Tendril` package. Existing code gets an explanation rather than an "object not found" error.
- The last working implementation remains in version control at the `v0.4.0` tag.

## Packaging changes for the CRAN resubmission

- `safetyGraphics` has been dropped from `Suggests`. It was never used by any code, test or vignette in this package, and because safetyGraphics imports safetyCharts the declaration was circular: with both packages archived, neither could be checked until one of them stopped requiring the other.
- The pkgdown output directory `docs/` is now listed in `.Rbuildignore`, so it is no longer shipped inside the source tarball.
- `aeExplorer()`, `hepExplorer()`, `paneledOutlierExplorer()` and `render_widget()` now document their return values. CRAN asks for a return value on every exported function, and these four had none.
- The examples for `aeExplorer()`, `hepExplorer()` and `paneledOutlierExplorer()` now run. They were wrapped in `\dontrun{}`, which was not warranted — each renders in well under a second. They are guarded with `@examplesIf requireNamespace("safetyData")` instead, because `safetyData` is a Suggests.

## New since the v0.3.0 CRAN release

These changes were made after v0.3.0 and released on GitHub as v0.4.0 (2024-09-20). They reach CRAN for the first time in this release.

- New charts and modules: `aeExplorer()`, `paneledOutlierExplorer()`, `init_cmExplorer()`, `init_mhExplorer()`.
- New event-stacking utilities: `stack_events()` and `standardize_events()`, for combining event domains into a single timeline-ready data frame.
- New chart configurations: concomitant medications (`cmExplorer`), medical history (`mhExplorer`) and vitals over time (`safetyVitalsOverTime`).
- New chart metadata data sets: `meta_cm`, `meta_ex`, `meta_mh`, `meta_vitals`.
- The `%>%` pipe is now re-exported.
- `aeExplorer()` renders without a treatment column, and treatment-column handling accepts both `NULL` and `""`.
- Chart configuration YAML cleaned up, `NAMESPACE` warnings fixed, and `htmltools`, `magrittr`, `tibble` and `tidyr` added to `Imports` to declare dependencies that were already in use.

# safetyCharts v0.3

This release adds several new features and bug fixes. New features include: 
- Chart metadata has been migrated from `safetygraphics` to `safetycharts` to support the new metadata framework being introduced in the upcoming safetyGraphics v2.1 release.
- A new `hepExplorer()`  function has been added to allow for a simple workflow to render the hepatic explorer with customizations. `hepExplorer()` calls a new `renderWidget()` function has been added for a more generalized widget rendering workflow. More updates may be added in this area in future releases. 

# safetyCharts v0.2

Initial CRAN release for safetyCharts. 

See the [GitHub release tracker](https://github.com/safetyGraphics/safetyCharts/releases) for additional release documentation and links to issues. 