let baseUrl = "";
let tripid = "";
if (!baseUrl) {
  baseUrl = env === 'development' ? 'http://localhost:3000/' : 'https://awesome-journey.herokuapp.com/'
}
if (!tripid) {
  tripid = $('#map').data('tripid');
}

// Helper method to create new node.
function H (tagName, htmlAttrs = {}, ...elements) {
  const newElement = document.createElement(tagName);
  for (let attribute in htmlAttrs) {
    newElement.setAttribute(attribute, htmlAttrs[attribute])
  }
  newElement.append(...elements);

  return newElement;
}

// Ajax for Route Object: create, all, delete
const Route = {
  create(address, latitude, longitude) {
    const myUrl = `${baseUrl}trips/${tripid}/routes`;
    const dataToSend = {
      address: address,
      latitude: latitude,
      longitude: longitude
    }

    return fetch(
      myUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      }
    )
    .then(res => res.json())
  },

  all() {
    const myUrl = `${baseUrl}trips/${tripid}/routes`;
    return fetch(myUrl)
       .then(res => res.json())
  },

  delete(routeId) {
    const myUrl = `${baseUrl}routes/${routeId}`;
    return fetch(
      myUrl,
      {
        method: 'DELETE',
      }
    )
    .then(res => res.json())
  },

  get (routeId) {
    const myUrl = `${baseUrl}routes/${routeId}`;
    return fetch(myUrl)
      .then(res => res.json());
  },

  dateUpdater(data) {
    const myUrl = `${baseUrl}trips/${tripid}/routes/date_updater`;
    return fetch (
      myUrl,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    )
    .then(res => res.json())
  },

  move(routeId, data) {
    const myUrl = `${baseUrl}routes/${routeId}/move`;
    return fetch (
      myUrl,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    )
  },

  duration_update(routeId, data) {
    const myUrl = `${baseUrl}routes/${routeId}/duration_update`;
    return fetch (
      myUrl,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    )
  }

} //End Of Route

function generateOption (num, selected) {
  let days = ' days';
  if (num === 1) {
    days = ' day';
  }

  if(selected) {
    return H('option', {'value': num,'selected':'selected'}, num + days )
  }
  return H('option', {'value': num}, num )
}

function genMulOptions(count, duration) {
  result = [];
  for(let i = 1; i <= count; i++) {
    if(i === duration) {
      result.push(generateOption(i, true));
    } else {
      result.push(generateOption(i, false));
    }
  }
  return result;
}


function renderRoutes (allRoutes) {
  const baseUrl = env === 'development' ? 'http://localhost:3000/' : 'https://awesome-journey.herokuapp.com/'
  return allRoutes.map(route => {
    let myRouteUrl = `${baseUrl}routes/${route.id}`;
    let i = 1;
    return H( 'li',
              {
                'class': 'single-route',
                'id': route.id
              },
              H( 'p', null,
                H( 'i',
                  {'class': 'fa fa-minus-square', 'data-routeid': route.id, 'aria-hidden': true}
                ),
                H( 'a', {'style': 'font-size:20px;margin-left: 5px;', 'href':myRouteUrl}, route.title)
              ),// End Of H('p')
              H( 'div', null,
                `${route.start} ~ ${route.end}`,
                H( 'select', {'id': `duration-select-${route.id}`, 'data-routeid': route.id, 'style': 'margin-left:10px;'},
                  ...genMulOptions(30, route.duration)
                )
              ), // End Of H('div')
              H( 'hr', null)
    ) // End Of OuterMost H('li')
  }) // End Of allRoutes.map
} // End of renderRoutes()


// Re-order routes and update start and end dates
function sortRouteList() {
  let originalIndexAt = null;
  let newPositionIndexAt = null;
  $( "#sortable" ).sortable({
    update: function( event, ui ) {
      let routeId = ui.item.context.id;
      newPositionIndexAt = ui.item.index();
      Route.move(routeId, {new_position: newPositionIndexAt})
      .then((res) => reloadRouteList())
    }
 });
}

// Get all routes and reload with new data. Call initMap to update
function reloadRouteList () {
  Route.all()
    .then(allRoutes => {
      $('#sortable').empty();
      $('#sortable').append(...renderRoutes(allRoutes));

      // initialize map with the center of last trip's route location
      let latitude = allRoutes[allRoutes.length-1].latitude;
      let longitude = allRoutes[allRoutes.length-1].longitude;
      initMap({lat: latitude, lng: longitude});

      // Sort routes and update new data into db
      sortRouteList();
    })
}

//Jquery Events Handler
$(document).ready(() => {

  reloadRouteList();

  // Create New Route on click of + icon
  $('#map').on('click', '.fa.fa-plus-circle', e => {
    let address = $('#routeInfo .address').html();
    let lat = parseFloat($('#routeInfo .latitude').html());
    let lng = parseFloat($('#routeInfo .longitude').html());
    Route.create(address, lat, lng)
      .then(() => reloadRouteList())
  });

  $('#sortable').on('click','.fa.fa-minus-square', e => {
    const routeId = $(e.target).data('routeid');
    const routeIndex = $( "li.single-route" ).index($(`li.single-route#${routeId}`))
    Route.delete(routeId)
      .then(() => Route.dateUpdater({delete_route_at_index: routeIndex}))
      .then(() => reloadRouteList())
  });


  $('#sortable').on('change', e => {
    const tripid = $('#map').data('tripid');
    const routeId = $(e.target).data('routeid');
    const indexAt = $('#sortable li').index($(`#${routeId}`));
    const duration = $(e.target).val();
    if(duration === 'other') {
      //Change dropdown list to a form.
      // When submit, add the new value to dropdown list and make it as default
    }
    Route.duration_update(routeId, {new_position: indexAt, new_duration: duration, trip_id: tripid})
      .then((res) => reloadRouteList())
  });


}) //End of Document.addEventListener
