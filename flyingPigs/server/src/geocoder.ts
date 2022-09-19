
// //export class Geocoder {
//   var geocoder;
//   function initialize() {
//     geocoder = new google.maps.Geocoder();
//     geocoder.geocode( { 'address': "5900 Messer Airport Hwy, Birmingham, AL 35212"}, function(results, status) {
//       if (status == 'OK') {
//         console.log(results)
//       } else {
//         alert('Geocode was not successful for the following reason: ' + status);
//       }
//     });
//   }
// //}

// initialize();

// import {Client} from "@googlemaps/google-maps-services-js";

// const client = new Client({});

// client
//   .elevation({
//     params: {
//       locations: [{ lat: 45, lng: -110 }],
//       key: "asdf",
//     },
//     timeout: 1000, // milliseconds
//   })
//   .then((r) => {
//     console.log(r.data.results[0].elevation);
//   })
//   .catch((e) => {
//     console.log(e.response.data.error_message);
//   });


const axios = require('axios').default;

  geocode();
// export class Geocoder {
  // geocode(addresses: string[]) {
  function geocode() {
    var addy = "5900 Messer Airport Hwy, Birmingham, AL 35212";
    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params:{
        address: addy,
        key: 'AIzaSyDNunfk3fqSjOs1DerP1HkA_R5jA87N7ZY'
      }
    })
    .then(function(response) {
      console.log(response)
    })
    .catch(function(error) {
      console.log(error)
    });

  }

// }

