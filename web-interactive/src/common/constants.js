
export const MOBILITY_CATEGORIES = {
    "grocery_and_pharmacy_percent_change_from_baseline":    "Grocery and pharmacy",
    "residential_percent_change_from_baseline":             "Residential",   
    "parks_percent_change_from_baseline":                   "Parks",
    "retail_and_recreation_percent_change_from_baseline":   "Retail and recreation",
    "transit_stations_percent_change_from_baseline":        "Transit stations",
    "workplaces_percent_change_from_baseline":              "Workplaces"
};

// numeric values in files coming from R
export const MOBILITY_CATEGORIES_INDEXES = {
    "1":"transit_stations_percent_change_from_baseline",
    "2":"workplaces_percent_change_from_baseline",
    "3":"residential_percent_change_from_baseline",
    "4":"retail_and_recreation_percent_change_from_baseline",
    "5":"grocery_and_pharmacy_percent_change_from_baseline",
    "6":"parks_percent_change_from_baseline"
};

export const COLORS = {
    BG: '#f8f8ee'
}

/*export const COUNTRIES = {
    DEFAULT: { ISO: 'ES', LABEL: 'Spain' },
    ALL: [
        { ISO: 'ES', LABEL: 'Spain' }
    ]
};*/

export const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
export const DAY_NAMES_LABEL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


export const COUNTRIES = [
    // top better
    "NZ", "SG", "AU", "IL", "KR", "FI",
    // others
    "DK", "GB", "US", "ES", "PT", "FR", "BE", "DE", "IT",
    // top worst 
    "MX", "PE", "IN", "BR", "CO", "AR"
];

export const COUNTRY_LABELS = [
     // top better
    "New Zealand", "Singapore", "Australia", "Israel", "South Korea", "Finland",
    // others
    "Denmark", "United Kingdom", "United States", "Spain", "Portugal", "France", "Belgium", "Germany", "Italy", 
    // top worst
    "Mexico", "Peru", "India", "Brazil", "Colombia", "Argentina"
];