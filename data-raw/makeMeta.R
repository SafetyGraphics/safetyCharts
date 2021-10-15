library(readr)
library(dplyr)
library(usethis)

meta_list <- list()

for (file in list.files('data-raw', '\\.csv$')) {
    name <- sub('\\.csv$', '', file)
    assign(
        name,
        read_csv(paste0('data-raw/', file))
    )
    meta_list[[name]] <- get(name)
}

meta <- do.call(rbind.data.frame, meta_list) %>%
    group_by(text_key) %>%
    filter(row_number() == 1) %>% # TODO: deal with duplicate metadata more thoughtfully
    ungroup

use_data(meta, overwrite = TRUE)
