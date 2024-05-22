// Five days before subscription expire date
exports.smsFive = (name, trainingDays, expireDate) => {
  return `Bună ${name}. Îți reamintim că în data de ${expireDate} se termină cele ${trainingDays} ședințe de antrenament prevăzute în abonamentul ales de tine, la studioul de personal training MINFITCHANGE! Pentru a continua te rugăm ca în data de ${expireDate} să-ți reinoiesti abonamentul! Mulțumim!`;
};
// One day before subscription expire date
exports.smsOne = (name, trainingDays, expireDate) => {
  return `Bună ${name}. Îți reamintim că în data de ${expireDate} se termină cele ${trainingDays} ședințe de antrenament prevăzute în abonamentul ales de tine, la studioul de personal training MINFITCHANGE! Pentru a continua te rugăm ca în data de ${expireDate} să-ți reinoiesti abonamentul! Mulțumim!`;
};

// Today subscription expire date
exports.smsToday = (name, trainingDays) => {
  return `Bună ${name}. Îți reamintim că astăzi se termină cele ${trainingDays} ședințe de antrenament prevăzute în abonamentul ales de tine, la studioul de personal training MINFITCHANGE! Pentru a continua te rugăm ca astăzi să-ți reinoiesti abonamentul! Mulțumim!`;
};
