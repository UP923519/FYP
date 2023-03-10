import React, { Component } from "react";
import Geocode from "react-geocode";
import "../App/App.css"

export let address;

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyCtaTMVWfuUgPQSa2qsFmJyC8F__eKcqKA");

// set response language. Defaults to english.
Geocode.setLanguage("en");

// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
Geocode.setRegion("es");

// set location_type filter . Its optional.
// google geocoder returns more that one address for given lat/lng.
// In some case we need one address as response for which google itself provides a location_type filter.
// So we can easily parse the result for fetching address components
// ROOFTOP, RANGE_INTERPOLATED, GEOMETRIC_CENTER, APPROXIMATE are the accepted values.
// And according to the below google docs in description, ROOFTOP param returns the most accurate result.
Geocode.setLocationType("ROOFTOP");

// Enable or disable logs. Its optional.
Geocode.enableDebug();


// Get address from latitude & longitude.
/*
Geocode.fromLatLng(sessionStorage.getItem("Lat"), sessionStorage.getItem("Lng")).then(
  (response) => {
    const address = response.results[0].formatted_address;
    //console.log(address);
  },
  (error) => {
    //console.error(error);
  }
);
*/

// Get formatted address, city, state, country from latitude & longitude when
// Geocode.setLocationType("ROOFTOP") enabled
// the below parser will work for most of the countries

export function convertLocation(){
  navigator.geolocation.getCurrentPosition(function(position) {
    //console.log("Latitude is :", position.coords.latitude);
    //console.log("Longitude is :", position.coords.longitude);
    Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
      (response) => {
        address = response.results[0].formatted_address;
        let city, state, country;
        for (let i = 0; i < response.results[0].address_components.length; i++) {
          for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
            switch (response.results[0].address_components[i].types[j]) {
              case "locality":
                city = response.results[0].address_components[i].long_name;
                break;
              case "administrative_area_level_1":
                state = response.results[0].address_components[i].long_name;
                break;
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;
            }
          }
        }

        console.log(city, state, country);
        console.log("address is" + address);
      },
      (error) => {
        console.error(error);
      }
    );
  })
  return(
    <div className="locationAddress">
      <h3  >Location: {address}</h3>
    </div>
  )
}

/*
// Get latitude & longitude from address.
Geocode.fromAddress("Eiffel Tower").then(
  (response) => {
    const { lat, lng } = response.results[0].geometry.location;
    //console.log(lat, lng);
  },
  (error) => {
    //console.error(error);
  }
);

*/
