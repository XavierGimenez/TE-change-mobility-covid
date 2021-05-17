library("dplyr")
library("stringr")
library("jsonlite")
library("tidyr")
library("purrr")
library("jsonlite")

# get all time span available for ES
df_ES <- bind_rows(
  read.csv2(
    file = "data/Region_Mobility_Report_CSVs/2020_ES_Region_Mobility_Report.csv",
    header = TRUE,
    sep = ","
  ),
  read.csv2(
    file = "data/Region_Mobility_Report_CSVs/2021_ES_Region_Mobility_Report.csv",
    header = TRUE,
    sep = ","
  )
)

write.csv(
  df_ES,
  file = "data_output/ES_Region_Mobility_Report.csv",
  sep = ",",
  row.names = FALSE
)