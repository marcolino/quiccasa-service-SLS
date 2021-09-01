module.exports = {
  //service: process.env.service,
  //bucket: process.env.bucket,
  //region: process.env.region,
  //cognitoUserPoolId: "eu-west-1_edKzSSeU9",
  locale: "it-IT",
  currency: "EUR",
  companyTitle: "Sistemi Solari ®",
  emailSenderAddress: "sistemisolari.quiccasa@gmail.com",
  emailRecipientAddresses: [ "marcosolari@gmail.com" ],
  forceANewAd: false, // force one ad to be new, and then force to send an email
  allowedOrigin: "https://quiccasa.sistemisolari.com",
  db: {
    connectionLimit: 10,
    queueLimit: 0,
  },
};
