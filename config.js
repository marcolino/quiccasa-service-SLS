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
  //endpoint: "https://gfhwsqbvf1.execute-api.eu-west-1.amazonaws.com/dev/",
  // endpoints: {
  //   crawl: "https://gfhwsqbvf1.execute-api.eu-west-1.amazonaws.com/dev/crawl", // TODO: to be read automatically from aws...
  //   subscribe: "https://gfhwsqbvf1.execute-api.eu-west-1.amazonaws.com/dev/subscribe", // TODO: to be read automatically from aws...
  //   unsubscribe: "https://gfhwsqbvf1.execute-api.eu-west-1.amazonaws.com/dev/unsubscribe", // TODO: to be read automatically from aws...
  //   reset: "https://gfhwsqbvf1.execute-api.eu-west-1.amazonaws.com/dev/reset", // TODO: to be read automatically from aws...
  // }
  forceANewAd: false, // force one ad to be new, and then force to send an email
  // AccessControlAllowOrigin: {
  //   //dev: "http://localhost:3000,
  //   dev: "https://apidev.sistemisolari.com",
  //   prod: "https://api.sistemisolari.com",
  // },
  AllowedOrigin: "https://quiccasa.sistemisolari.com",
};