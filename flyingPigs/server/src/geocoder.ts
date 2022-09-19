const {Client} = require("@googlemaps/google-maps-services-js");

const client = new Client({});

client
  .geocode({
    params: {
      address: "Indiana, US",
      key: "AIzaSyDNunfk3fqSjOs1DerP1HkA_R5jA87N7ZY",
    },
    timeout: 1000, // milliseconds
  })
  .then((r: any) => {
    console.log(r.data.results[0]);
  })
  .catch((e: any) => {
    console.log(e.response.data.error_message);
  });