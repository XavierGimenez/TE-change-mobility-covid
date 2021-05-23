
export const localYear = function(y) {
    let t0 = new Date;
    t0.setFullYear(y);
    t0.setMonth(0);
    t0.setDate(1);
    t0.setHours(0, 0, 0, 0);
    return t0;
}



export const localWeekNum = function(d) {
    return d3time.timeWeek.count(localYear(d.getFullYear()) - 1, d);
}



export const week = function(d) {
    return localWeekNum(new Date(d));
}