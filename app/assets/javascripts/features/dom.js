// import {allRoutes} from './dom';

function H (tagName, htmlAttrs = {}, ...elements) {
  const newElement = document.createElement(tagName);
  for (let attribute in htmlAttrs) {
    newElement.setAttribute(attribute, htmlAttrs[attribute])
  }
  newElement.append(...elements);

  return newElement;
}

const Route = {
  create(address, latitude, longitude) {
    const tripid = $('#map').data('tripid');
    const myUrl = `http://localhost:3000/trips/${tripid}/routes`;
    // console.log("lat in create========:", latitude)
    // console.log("lng in create========:", longitude)
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
    .then(res => {
      return res.json()
    })
    .then(data => {
      console.log("res >>> ", data)
    })
  },

  all() {
    const tripid = $('#map').data('tripid');
    const myUrl = `http://localhost:3000/trips/${tripid}/routes`;
    return new Promise((resolve, reject) => {
      resolve(fetch(myUrl)
       .then(res => res.json())
      )
    })
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
  }
}

Route.all().then(allRoutes => {
  allRoutes.map(route =>
    $('#sortable').append(
      `<li class="single-route"><span>${route.address}</span>` +
      `<i class="fa fa-minus-square" data-routeid="${route.id}" aria-hidden="true"></i>` +
      `</li>`
    )
  )
})

// When + icon clicked, create a route with the address passing to the parameter.
// fullCalendar will refetch and rerender.
$('#map').on('click', '.fa.fa-plus-circle', e => {
  let address = $('#routeInfo .address').html();
  let lat = parseFloat($('#routeInfo .latitude').html());
  let lng = parseFloat($('#routeInfo .longitude').html());
  console.log("lat========:", lat)
  console.log("lng========:", lng)
  $('#sortable').append($(`<li class="single-route"><p>${address}</p></li>`));
  Route.create(address, lat, lng);

  let form = $("#addForm").html();
  $("li.single-route:last-child").append(form);
});


$('#sortable').on('click','.fa.fa-minus-square', e => {
  console.log("Its clicked!")
  const routeId = $(e.target).data('routeid');
  //!!!!!!!!Map also needs to be reload to update the data.
  // !!!!!!!!!I don't like to do this below line... I think using ajax is fancy
  // $(e.target).parent().remove();
  // Route.delete(routeId)

  //Below is alt way but still not working.....
  Route.delete(routeId)
  .then($('#sortable').empty())
  .then(Route.all().then( allRoutes => {
    allRoutes.map(route =>
      $('#sortable').append(
        `<li class="single-route"><span>${route.address}</span>` +
        `<i class="fa fa-minus-square" data-routeid="${route.id}" aria-hidden="true"></i>` +
        `</li>`
      )
    )
  }))

});
