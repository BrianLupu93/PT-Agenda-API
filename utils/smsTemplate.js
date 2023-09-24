exports.smsOne = (client) => {
  return `Salut ${client.name}, doresc sa te informez ca abonamentul tau expira maine.`;
};
exports.smsThree = (client) => {
  return `Salut ${client.name}, doresc sa te informez ca abonamentul tau expira in 3 zile.`;
};
exports.smsToday = (client) => {
  return `Salut ${client.name}, doresc sa te informez ca abonamentul tau expira astazi.`;
};
