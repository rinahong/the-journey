
let map;
let geocoder;
let infowindow;

function initMap(latLngCenter={lat: 49.879, lng: 13.624}) {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: latLngCenter // Default Center: Hlohovice, Czechia.
  });

  infowindow = new google.maps.InfoWindow;
  //For Geocode input box and submit event handler
  geocoder = new google.maps.Geocoder();
  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  });

  const clickable = $('#map').data('clickable');
  // Add a listener for the click event for polylines on trip controller edit page
  if(clickable) {
    map.addListener('click', (event) => geocodeLatLng(geocoder, map, infowindow, event));
  }

  Route.all().then( allRoutes => {
    let routePathCoordinatesArray = [];
    allRoutes.map(route => {
      displayMarker(route.latitude, route.longitude)
      routePathCoordinatesArray.push({lat: route.latitude , lng: route.longitude});
    })
    displayRoutePath(routePathCoordinatesArray);
  });
}

//For getting address using latitude and longitude
function geocodeLatLng(geocoder, map, infowindow, event) {
  let latlng = {lat: event.latLng.lat(), lng: event.latLng.lng()};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        let city = "";
        let state = "";
        let country = "";
        let addressArr = [];
        for (let ac = 0; ac < results[0].address_components.length; ac++) {
            let component = results[0].address_components[ac];

            switch(component.types[0]) {
              case 'locality':
                city = component.long_name;
                if(city !== "") {
                  addressArr.push(city);
                }
                break;
              case 'administrative_area_level_1':
                state = component.short_name;
                if(state !== "") {
                  addressArr.push(state);
                }
                break;
              case 'country':
                country = component.long_name;
                if(country !== "") {
                  addressArr.push(country);
                }
                break;
            }
        }
        address = addressArr.join(', ');
        map.setZoom(11);
        let marker = new google.maps.Marker({
          position: latlng,
          map: map
        });
        let contentString = '<div id="content">'+
           '<div id="routeInfo">' +
           '<span class="address">' + address + '</span>' +
           '<i class="fa fa-plus-circle fa-2x" aria-hidden="true"></i>' +
           '<div style="display:none">' +
           '<p class="latitude">' + latlng.lat + '</p>' +
           '<p class="longitude">' + latlng.lng + '</p>' +
           '</div>' +
           '</div>';
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
      } else {
        window.alert('No results found');
       }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}

//For searching by address!!!!!!!
function geocodeAddress(geocoder, resultsMap) {
  let address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
      let marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}


function displayMarker(routeLat, routeLng) {
  let latLng = {lat: routeLat, lng: routeLng};
  if(latLng !== null) {
    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: 'Hello World!'
    });
  }
}

function displayRoutePath(routePathCoordinates) {
   let lineSymbol = {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
        };
   let routePathLines = new google.maps.Polyline({
                  path: routePathCoordinates,
                  icons: [
                    {
                      icon: lineSymbol,
                      repeat: '15%'
                    }
                  ],
                  strokeColor: '#DC143C',
                  strokeOpacity: 1.0,
                  strokeWeight: 2
                });
   routePathLines.setMap(map);
}
