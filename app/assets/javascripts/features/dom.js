
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
        method: 'DELETE'
      }
    )
    .then(res => res.json())
  },

  get (routeId) {
    const myUrl = `http://localhost:3000/routes/${routeId}`;
    return fetch(myUrl)
      .then(res => res.json());
  },

  update(routeId, data) {
    const myUrl = `http://localhost:3000/routes/${routeId}`;
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
              H( 'span', null, route.address),
              H( 'i',
                {'class': 'fa fa-minus-square', 'data-routeid': route.id, 'aria-hidden': true}
              )
    ) // End Of OuterMost H()
  }) // End Of allRoutes.map
} // End of renderRoutes()

function sortRouteList() {
  let originalIndexAt = null;
  let newPositionIndexAt = null;
  $( "#sortable" ).sortable({
    start: function (event, ui) {
       // console.log("on start>>>", ui.item.index())
       originalIndexAt = ui.item.index()
    },
    update: function( event, ui ) {
      let routeId = ui.item.context.id;
      newPositionIndexAt = ui.item.index();
      // Route.update(routeId, {address: "rinaChanged"});
      // console.log("after update>>>",ui.item.index())
      // console.log("update ui>>>>>>",ui)
      // updateRouteStartDate(originalIndexAt, newPositionIndexAt)
      Route.move(routeId, {new_position: newPositionIndexAt}).then((res) => {
        reloadRouteList()
        // res.json()
      })
    }
 });
}

function updateRouteStartDate(originalAt, newPositionAt) {
  const tripStartDate = $('#routes').data('tripstartdate')
  if (originalAt > newPositionAt) { //List MoveUp
    if(newPositionAt === 0) {
      let routeIDFromList = null;
      let currentRoute = null;
      let previousRoute  = null;
      for (let i = 0; i < $('.single-route').length; i++ ) {
        routeIDFromList = $('.single-route').eq(i).attr('id');
        currentRoute = Route.get(routeIDFromList);
        if (i === 0) { //If first route
          previousRoute = currentRoute;
          Route.update(routeIDFromList, {start_date: tripStartDate, end_date: tripStartDate + currentRoute.duration });
          continue;
        }

        Route.update(routeIDFromList, {start_date: previousRoute.end_date, end_date: previousRoute.end_date + currentRoute.duration});
        previousRoute = currentRoute;
      }
    } else {
      console.log("Dont do anything...")
    }
  } else { //List MoveDown
    console.log("Dont do anything...")
  }

  // console.log("originalAt: ",originalAt, " newPositionAt: ", newPositionAt,
  // " sortable: ", $('.single-route').eq(newPositionAt).attr('id'))
}

function reloadRouteList () {
  Route.all()
    .then(allRoutes => {
      $('#sortable').empty();
      $('#sortable').append(...renderRoutes(allRoutes));
      initMap();

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
    Route
      .delete(routeId)
      .then(() => reloadRouteList())
  });

}) //End of Document.addEventListener
