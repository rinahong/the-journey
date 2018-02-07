
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

function dragStart(event) {
    event.dataTransfer.setData("Text", event.currentTarget.id);
    console.log(event.currentTarget)
    event.currentTarget.style.color = 'green';
}

function allowDrop(event) {
    event.currentTarget.style.color = 'blue';
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("Text");
    event.target.appendChild(document.getElementById(data));
}

function sortRouteList() {
  $( "#sortable" ).sortable({
    update: function( event, ui ) {
      let routeId = ui.item.context.id;
      // Route.update(routeId, {address: "rinaChanged"});
      console.log(ui)
      console.log()
    }
 });
}


//Jquery Events Handler
document.addEventListener('DOMContentLoaded', () => {

  function reloadRouteList () {
    Route.all()
      .then(allRoutes => {
        $('#sortable').empty();
        $('#sortable').append(...renderRoutes(allRoutes));
        initMap();
        let index = null;
        $('li.single-route').on('mousedown', e => {
          index = $( "li" ).index(e.currentTarget);
          console.log("=====list Index", index);
        })
        sortRouteList();
      })
  }

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
