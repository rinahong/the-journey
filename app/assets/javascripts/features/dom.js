// import {allRoutes} from './dom';

function ready (fn) {
  document.addEventListener('DOMContentLoaded', fn);
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
    const tripid = $('#map').data('tripid');
    const myUrl = `http://localhost:3000/trips/${tripid}/routes`;
    const dataToSend = {
      address: address,
      latitude: latitude,
      longitude: longitude
    }
    console.log("!!!!!!", dataToSend)

    fetch(
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
    return new Promise((resolve, reject) => {
      resolve(fetch(
         myUrl,
        {
          method: 'DELETE'
        }
      )
       .then(res => res.json())
      )
    })
  },

  // delete(routeId) {
  //   const myUrl = `http://localhost:3000/routes/${routeId}`;
  //   return fetch(
  //        myUrl,
  //       {
  //         method: 'DELETE'
  //       }
  //     )
  //      .then(res => res.json())
  // }
} //End Of Route

function renderRoutes (allRoutes) {
  return allRoutes.map(route => {
    return H( 'li', {'class': 'single-route'},
        H( 'span', null, route.address),
        H( 'i',
           {'class': 'fa fa-minus-square', 'data-routeid': route.id, 'aria-hidden': true}),
    )
  })
}

// Route.all().then(allRoutes => {
//   allRoutes.map(route =>
//     $('#sortable').append(
//       `<li class="single-route"><span>${route.address}</span>` +
//       `<i class="fa fa-minus-square" data-routeid="${route.id}" aria-hidden="true"></i>` +
//       `</li>`
//     )
//   )
// })

document.addEventListener('DOMContentLoaded', () => {

  function reloadRouteList () {
    Route.all()
      .then(allRoutes => {
        $('#sortable').empty();
        $('#sortable').append(...renderRoutes(allRoutes));
      })
  }

  reloadRouteList();

  //Create New Route on click of + icon
  $('#map').on('click', '.fa.fa-plus-circle', e => {
    let address = $('#routeInfo .address').html();
    let lat = parseFloat($('#routeInfo .latitude').html());
    let lng = parseFloat($('#routeInfo .longitude').html());
    console.log("lat========:", lat)
    console.log("lng========:", lng)
    Route.create(address, lat, lng)
      .then(data => console.log(data))
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

// $('#map').on('click', '.fa.fa-plus-circle', e => {
//   let address = $('#routeInfo .address').html();
//   let lat = parseFloat($('#routeInfo .latitude').html());
//   let lng = parseFloat($('#routeInfo .longitude').html());
//   console.log("lat========:", lat)
//   console.log("lng========:", lng)
//   $('#sortable').append($(`<li class="single-route"><p>${address}</p></li>`));
//   Route.create(address, lat, lng);
//
//   let form = $("#addForm").html();
//   $("li.single-route:last-child").append(form);
// });
