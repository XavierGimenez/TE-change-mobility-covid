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


# get data from Our World In Data
owid_covid_data <- read.csv2(
  file = "data/owid-covid-data.csv",
  header = TRUE,
  sep = ",",
  stringsAsFactors = FALSE
)

# just get date, reproduction rate and filter by dates with indicator values
reproduction_rate_ES <- owid_covid_data %>% 
  filter(location == "Spain") %>%
  select(date, reproduction_rate) %>%
  mutate( reproduction_rate = as.numeric(reproduction_rate)) %>%
  filter(!is.na(reproduction_rate))

# get only mobility data at country level
df_ES.all_regions_agg <- df_ES %>%
  filter(sub_region_1 == "") %>%
  select(
    date, 
    retail_and_recreation_percent_change_from_baseline,
    grocery_and_pharmacy_percent_change_from_baseline,
    parks_percent_change_from_baseline,
    transit_stations_percent_change_from_baseline,
    workplaces_percent_change_from_baseline,
    residential_percent_change_from_baseline
  )


all_data <- inner_join(
    reproduction_rate_ES,
    df_ES.all_regions_agg,
    by = "date"
  ) %>%
  # make it tidy
  pivot_longer(
    cols = ends_with("_from_baseline"),
    names_to = "metric",
    values_to = "mobility_change_from_baseline"
  )

write_json(
  x = all_data,
  path = "data_output/ES_reproductionrate_vs_mobility.json"
)