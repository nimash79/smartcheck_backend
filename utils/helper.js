const moment = require("moment-jalaali")

exports.generateRandomCode = () => {
  var min = 10000;
  var max = 90000;
  var num = Math.floor(Math.random() * min) + max;
  return num;
};

exports.p2e = (str) => {
  return str.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
}

exports.persianDateToUTC = (persianDateStr) => {
  // Convert digits first
  const eng = this.p2e(persianDateStr);

  // Parse Jalali date with English digits
  const m = moment(eng, 'jYYYY/jMM/jDD');

  // Convert to Gregorian UTC Date
  const gregorianStr = m.format('YYYY-MM-DD');
  return moment.utc(gregorianStr, 'YYYY-MM-DD').toDate();
}

exports.toShamsi = (date) => {
  return moment(date).format('jYYYY/jMM/jDD');
}
