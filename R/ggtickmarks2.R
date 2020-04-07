# Function to overwrite behavior of ggplot minor log ticks
GeomLogticks2 <- ggproto("GeomLogticks2", Geom,
                         extra_params = "",
                         handle_na = function(data, params) {
                           data
                         },

                         draw_panel = function(data, panel_params, coord, base = 10, sides = "bl",
                                               scaled = TRUE, short = unit(0.1, "cm"), mid = unit(0.2, "cm"),
                                               long = unit(0.3, "cm"))
                         {
                           ticks <- list()

                           # Convert these units to numbers so that they can be put in data frames
                           short <- convertUnit(short, "cm", valueOnly = TRUE)
                           mid   <- convertUnit(mid,   "cm", valueOnly = TRUE)
                           long  <- convertUnit(long,  "cm", valueOnly = TRUE)


                           if (grepl("[b|t]", sides)) {

                             # Get positions of x tick marks
                             xticks <- ggplot2:::calc_logticks(
                               base = base,
                               minpow = floor(panel_params$x.range[1]),
                               maxpow = ceiling(panel_params$x.range[2]),
                               start = 0,
                               shortend = short,
                               midend = mid,
                               longend = long
                             )

                             if (scaled)
                               xticks$value <- log(xticks$value, base)

                             names(xticks)[names(xticks) == "value"] <- "x"   # Rename to 'x' for coordinates$transform
                             xticks <- coord$transform(xticks, panel_params)

                             # Make the grobs
                             if (grepl("b", sides)) {
                               ticks$x_b <- with(data, segmentsGrob(
                                 x0 = unit(xticks$x, "native"), x1 = unit(xticks$x, "native"),
                                 y0 = unit(xticks$start, "cm"), y1 = unit(xticks$end, "cm"),
                                 gp = gpar(col = alpha(colour, alpha), lty = linetype, lwd = size * .pt)
                               ))
                             }
                             if (grepl("t", sides)) {
                               ticks$x_t <- with(data, segmentsGrob(
                                 x0 = unit(xticks$x, "native"), x1 = unit(xticks$x, "native"),
                                 y0 = unit(1, "npc") - unit(xticks$start, "cm"), y1 = unit(1, "npc") - unit(xticks$end, "cm"),
                                 gp = gpar(col = alpha(colour, alpha), lty = linetype, lwd = size * .pt)
                               ))
                             }
                           }


                           if (grepl("[l|r]", sides)) {
                             yticks <- ggplot2:::calc_logticks(
                               base = base,
                               minpow = floor(panel_params$y.range[1]),
                               maxpow = ceiling(panel_params$y.range[2]),
                               start = 0,
                               shortend = short,
                               midend = mid,
                               longend = long
                             )


                             # do not extend y ticks beyond axis lim
                             yticks <- with(yticks,yticks[value > base^panel_params$y.range[1]  &
                                                            value< base^panel_params$y.range[2],])


                             if (scaled)
                               yticks$value <- log(yticks$value, base)

                             names(yticks)[names(yticks) == "value"] <- "y"   # Rename to 'y' for coordinates$transform
                             yticks <- coord$transform(yticks, panel_params)

                             #
                             # Make the grobs
                             if (grepl("l", sides)) {
                               ticks$y_l <- with(data, segmentsGrob(
                                 y0 = unit(yticks$y, "native"), y1 = unit(yticks$y, "native"),
                                 x0 = unit(yticks$start, "cm"), x1 = unit(yticks$end, "cm"),
                                 gp = gpar(col = alpha(colour, alpha), lty = linetype, lwd = size * .pt)
                               ))
                             }
                             if (grepl("r", sides)) {
                               ticks$y_r <- with(data, segmentsGrob(
                                 y0 = unit(yticks$y, "native"), y1 = unit(yticks$y, "native"),
                                 x0 = unit(1, "npc") - unit(yticks$start, "cm"), x1 = unit(1, "npc") - unit(yticks$end, "cm"),
                                 gp = gpar(col = alpha(colour, alpha), lty = linetype, lwd = size * .pt)
                               ))
                             }
                           }

                           gTree(children = do.call("gList", ticks))
                         },

                         default_aes = aes(colour = "black", size = 0.5, linetype = 1, alpha = 1)
)



annotation_logticks2 <- function(base = 10, sides = "bl", scaled = TRUE,
                                 short = unit(0.1, "cm"), mid = unit(0.2, "cm"), long = unit(0.3, "cm"),
                                 colour = "black", size = 0.5, linetype = 1, alpha = 1, color = NULL, ...)
{
  if (!is.null(color))
    colour <- color

  layer(
    data = ggplot2:::dummy_data(),
    mapping = NULL,
    stat = StatIdentity,
    geom = GeomLogticks2,
    position = PositionIdentity,
    show.legend = FALSE,
    inherit.aes = FALSE,
    params = list(
      base = base,
      sides = sides,
      scaled = scaled,
      short = short,
      mid = mid,
      long = long,
      colour = colour,
      size = size,
      linetype = linetype,
      alpha = alpha,
      ...
    )
  )
}
