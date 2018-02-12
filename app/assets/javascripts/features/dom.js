
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
  return allRoutes.map(route => {
    return H( 'li',
              {
                'class': 'single-route',
                'id': route.id
              },
              H( 'p', null,
                H( 'i',
                  {'class': 'fa fa-minus-square', 'data-routeid': route.id, 'aria-hidden': true}
                ),
                H( 'strong', {'style': 'font-size:20px;margin-left: 5px;'}, route.address)
              ),
              H( 'p', null, `${route.start_date.slice(0, 10)} ~ ${route.end_date.slice(0, 10)}`),
              H( 'hr', null)
    ) // End Of OuterMost H()
  }) // End Of allRoutes.map
} // End of renderRoutes()

function sortRouteList() {
  let originalIndexAt = null;
  let newPositionIndexAt = null;
  $( "#sortable" ).sortable({
    update: function( event, ui ) {
      let routeId = ui.item.context.id;
      newPositionIndexAt = ui.item.index();
      Route.move(routeId, {new_position: newPositionIndexAt}).then((res) => {
        reloadRouteList()
        // res.json()
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
document.addEventListener('DOMContentLoaded', () => {

  reloadRouteList();

  // Create New Route on click of + icon
  $('#map').on('click', '.fa.fa-plus-circle', e => {
    let address = $('#routeInfo .address').html();
    let lat = parseFloat($('#routeInfo .latitude').html());
    let lng = parseFloat($('#routeInfo .longitude').html());
    Route.create(address, lat, lng)
      .then(() => reloadRouteList())

    // let form = $("#addForm").html();
    // $("li.single-route:last-child").append(form);
  });

  $('#sortable').on('click','.fa.fa-minus-square', e => {
    const routeId = $(e.target).data('routeid');
    console.log("route Id =====> ", routeId)
    const routeIndex = $( "li.single-route" ).index($(`li.single-route#${routeId}`))
    console.log("route Index =====> ", routeIndex)
    Route
      .delete(routeId)
      .then(() => Route.dateUpdater({delete_route_at_index: routeIndex}))
      .then(() => reloadRouteList())
  });


  $('.carousel').carousel({
    interval: false
  })
}) //End of Document.addEventListener
