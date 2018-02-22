
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
    const tripid = $('#map').data('tripid');
    const myUrl = `http://localhost:3000/trips/${tripid}/routes`;
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
    const tripid = $('#map').data('tripid');
    const myUrl = `http://localhost:3000/trips/${tripid}/routes`;
    return fetch(myUrl)
       .then(res => res.json())
  },

  delete(routeId) {
    const myUrl = `http://localhost:3000/routes/${routeId}`;
    return fetch(
      myUrl,
      {
        method: 'DELETE',
      }
    )
    .then(res => res.json())
  },

  get (routeId) {
    const myUrl = `http://localhost:3000/routes/${routeId}`;
    return fetch(myUrl)
      .then(res => res.json());
  },

  dateUpdater(data) {
    const tripid = $('#map').data('tripid');
    const myUrl = `http://localhost:3000//trips/${tripid}/routes/date_updater`;
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
    const myUrl = `http://localhost:3000/routes/${routeId}/move`;
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

function renderRoutes (allRoutes) {
  let duration_array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'other'];
  let option = ``;
  for(let i = 0; i < duration_array.length; i++) {
      option += `<option value=${duration_array[i]}> ${duration_array[i]} </option>`;
  }
  console.log(option);
  console.log(option[0]);
  return allRoutes.map(route => {
    let myRouteUrl = `http://localhost:3000/routes/${route.id}`
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
              ),
              H( 'div', null,
                `${route.start} ~ ${route.end}`,
                H( 'select', {'id': `duration-select-${route.id}`, 'data-routeid': route.id, 'style': 'margin-left:10px;'},
                  H('option', {'value': '1'}, '1 day' ),
                  H('option', {'value': '2'}, '2 days' ),
                  H('option', {'value': '3'}, '3 days' ),
                  H('option', {'value': '4'}, '4 days' ),
                  H('option', {'value': '5'}, '5 days' ),
                  H('option', {'value': '6'}, '6 days' ),
                  H('option', {'value': '7'}, '7 days' ),
                  H('option', {'value': '8'}, '8 days' ),
                  H('option', {'value': '9'}, '9 days' ),
                  H('option', {'value': '10'}, '10 days' ),
                  H('option', {'value': 'other'}, 'other' )
                )
              ),
              H( 'hr', null)
    ) // End Of OuterMost H()
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
      Route.move(routeId, {new_position: newPositionIndexAt}).then((res) => {
        reloadRouteList()
      })
    }
 });
}

// Get all routes and reload with new data. Call initMap to update
function reloadRouteList () {
  Route.all()
    .then(allRoutes => {
      $('#sortable').empty();
      $('#sortable').append(...renderRoutes(allRoutes));
      initMap();
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
    Route
      .delete(routeId)
      .then(() => Route.dateUpdater({delete_route_at_index: routeIndex}))
      .then(() => reloadRouteList())
  });


}) //End of Document.addEventListener
