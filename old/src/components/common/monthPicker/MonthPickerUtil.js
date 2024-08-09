export default class JPickerUtil{
    static formatMonth=dateObj => {
        let result=JPickerUtil.monthFullName[dateObj.getMonth()]+" "+dateObj.getFullYear();
        return result.trim();
      }
    static isWithinTheRange = (thisDate, maxDate, minDate) => {
        return thisDate >= minDate && thisDate <= maxDate;
    };
    static monthFullName = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    static monthShortName = [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC'];    
}