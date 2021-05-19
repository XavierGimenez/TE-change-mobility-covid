library("dplyr")
library("stringr")
library("jsonlite")
library("tidyr")
library("purrr")
library("jsonlite")
library("zoo")

# get data from Our World In Data
owid_covid_data <- read.csv2(
  file = "data/owid-covid-data.csv",
  header = TRUE,
  sep = ",",
  stringsAsFactors = FALSE
)

countries_list <- list(
  c("ES","Spain")
  # c("GB","United Kingdom"),
  # c("IL","Israel"),
  # c("DE","Germany"),
  # c("US","United States")
)

for (country in countries_list) {
  
  country_ISO_code = country[1]
  country_name = country[2]
  
  # get all time span available of mobility data per country
  df <- bind_rows(
    read.csv2(
      file = paste0("data/Region_Mobility_Report_CSVs/2020_", country_ISO_code, "_Region_Mobility_Report.csv"),
      header = TRUE,
      sep = ","
    ),
    read.csv2(
      file = paste0("data/Region_Mobility_Report_CSVs/2021_", country_ISO_code, "_Region_Mobility_Report.csv"),
      header = TRUE,
      sep = ","
    )
  )
  write.csv(
    df,
    file = paste0("data_output/", country_ISO_code, "_Region_Mobility_Report.csv"),
    row.names = FALSE
  )
  
  # just get date, reproduction rate and filter by dates with indicator values
  reproduction_rate <- owid_covid_data %>% 
    filter(location == country_name) %>%
    select(date, reproduction_rate) %>%
    mutate( reproduction_rate = as.numeric(reproduction_rate)) %>%
    filter(!is.na(reproduction_rate))
  
  # get only mobility data at country level
  df.all_regions_agg <- df %>%
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
    reproduction_rate,
    df.all_regions_agg,
    by = "date"
  ) %>%
  # make it tidy
  pivot_longer(
    cols = ends_with("_from_baseline"),
    names_to = "metric",
    values_to = "mobility_change_from_baseline"
  )
  
  # add moving averages
  all_data <- all_data %>%
    mutate(
      reproduction_rate_week_rolling_avg = rollmean(reproduction_rate, k = 7, fill = NA),
      mobility_change_from_baseline_week_rolling_avg = rollmean(mobility_change_from_baseline, k = 7, fill = NA)
    ) %>%
    drop_na()
  
  write_json(
    x = all_data,
    path = paste0("data_output/", country_ISO_code , "_reproductionrate_vs_mobility.json")
  )
}