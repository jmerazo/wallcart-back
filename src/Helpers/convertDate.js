function dateSerielToFormat(serial) {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000),
    month = '' + (date_info.getMonth() + 1),
    day = '' + date_info.getDate(),
    year = date_info.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
 }

 module.exports = {
    dateSerielToFormat
 }