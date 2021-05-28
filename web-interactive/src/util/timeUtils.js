import * as d3 from 'd3';

export const localYear = function(y) {
    let t0 = new Date();
    t0.setFullYear(y);
    t0.setMonth(0);
    t0.setDate(1);
    t0.setHours(0, 0, 0, 0);
    return t0;
}



export const localWeekNum = d => d3.timeWeek.count(localYear(d.getFullYear()) - 1, d);

export const week = (d) => localWeekNum(new Date(d));

export const getNumOfWeeks = (year) => {
    // Set to the start date of this year
    let startDateOfYear = new Date(year, 0, 1);
    // Calculate how many days in this year
    let daysOfYear = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
    //366(365)/7=52.2(52.1), so generally there are 52 days and 1 day or 2 days in a year. When there are 366 days in this year and the first day is Sunday, then his last day is On Monday, there are 54 weeks in this year.
    let weekNum = 53;
    //When the year is a leap year and the first day is Sunday, there are 54 weeks.
    if (startDateOfYear.getDay() === 0 && daysOfYear === 366)
        weekNum = 54;

    return weekNum;
}

export const formatDate = (date) => {
    return date.toLocaleString("en", {
        month: "short",
        year: "numeric",
        timeZone: "UTC"
      });
};

export const formatDate2 = (date) => {
    return date.toLocaleString("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC"
      });
};