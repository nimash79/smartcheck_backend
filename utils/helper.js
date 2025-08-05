exports.generateRandomCode = () => {
  var min = 10000;
  var max = 90000;
  var num = Math.floor(Math.random() * min) + max;
  return num;
};
