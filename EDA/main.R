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

# https://www.bloomberg.com/graphics/covid-resilience-ranking/
countries_list <- list(
  c("NZ","New Zealand"), # top 5 best countries
  c("SG","Singapore"),
  c("AU","Australia"),
  c("IL","Israel"),
  c("KR","South Korea"),
  c("FI","Finland"),
  c("DE","Germany"), # USA and some Europe
  c("ES","Spain"),
  c("BE","Belgium"),
  c("FR","France"),
  c("GB","United Kingdom"),
  c("IT","Italy"),
  c("PT","Portugal"),
  c("US","United States"),
  c("DK","Denmark"),
  c("PE","Peru"), # top 5 worst countries
  c("IN","India"),
  c("BR","Brazil"),
  c("CO","Colombia"),
  c("AR","Argentina"),
  c("MX", "Mexico")
)

for (country in countries_list) {
  
  country_ISO_code = country[1]
  country_name = country[2]
  
  # get all time span available of mobility data per country
  df <- bind_rows(
    read.csv2(
      file = paste0("data/Region_Mobility_Report_CSVs/2020_", country_ISO_code, "_Region_Mobility_Report.csv"),
      header = TRUE,
      sep = ",",
      stringsAsFactors = FALSE
    ),
    read.csv2(
      file = paste0("data/Region_Mobility_Report_CSVs/2021_", country_ISO_code, "_Region_Mobility_Report.csv"),
      header = TRUE,
      sep = ","
    )
  )
  
  # write.csv(
  #   df,
  #   file = paste0("data_output/", country_ISO_code, "_Region_Mobility_Report.csv"),
  #   row.names = FALSE
  # )
  
  # just get date, reproduction rate and filter by dates with indicator values
  reproduction_rate <- owid_covid_data %>% 
    filter(location == country_name) %>%
    select(date, reproduction_rate) %>%
    mutate( reproduction_rate = as.numeric(reproduction_rate)) %>%
    filter(!is.na(reproduction_rate))
  
  # get only mobility data at country level
  df.all_regions_agg <- df %>%
    filter(sub_region_1 == "" | (is.logical(sub_region_1) & is.na(sub_region_1)) )%>%
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
      # rolling average
      reproduction_rate_week_rolling_avg = rollmean(reproduction_rate, k = 7, fill = NA),
      mobility_change_from_baseline_week_rolling_avg = rollmean(mobility_change_from_baseline, k = 7, fill = NA),
      # trying with the z-score
      # mobility_change_from_baseline_mean = mean(mobility_change_from_baseline),
      # mobility_change_from_baseline_standard_deviation = sd(mobility_change_from_baseline)
    # ) %>%
    # mutate(
      # mobility_change_from_baseline_zscore = (mobility_change_from_baseline - mobility_change_from_baseline_mean) / mobility_change_from_baseline_standard_deviation
    ) %>%
    drop_na()
  
  # add week days so we can find patterns in week days and weekend days
  # all_data <- all_data %>%
  #   mutate(
  #     week_day = as.numeric(format(as.Date(date), format = "%u"))
  #   )
  
  # files for web (TODO: convert mobility categories to integers)
  
  # get only reproduction rate and change in mobility
  all_data <- all_data %>% select(!c(reproduction_rate_week_rolling_avg,mobility_change_from_baseline_week_rolling_avg))
  # make it light
  all_data$metric[which(all_data$metric == "transit_stations_percent_change_from_baseline")] <- 1
  all_data$metric[which(all_data$metric == "workplaces_percent_change_from_baseline")] <- 2
  all_data$metric[which(all_data$metric == "residential_percent_change_from_baseline")] <- 3
  all_data$metric[which(all_data$metric == "retail_and_recreation_percent_change_from_baseline")] <- 4
  all_data$metric[which(all_data$metric == "grocery_and_pharmacy_percent_change_from_baseline")] <- 5
  all_data$metric[which(all_data$metric == "parks_percent_change_from_baseline")] <- 6
  write.csv(
    x = all_data,
    row.names = FALSE,
    file = paste0("data_output/", country_ISO_code , "_reproductionrate_vs_mobility.csv")
  )
}