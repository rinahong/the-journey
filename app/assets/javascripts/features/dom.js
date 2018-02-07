
function createRoute(address, latitude, longitude) {
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
}

function allRoutes() {
  const tripid = $('#map').data('tripid');
  const myUrl = `http://localhost:3000/trips/${tripid}/routes`;
  return new Promise((resolve, reject) => {
    resolve(fetch(myUrl)
     .then(res => res.json())
    )
  })
}

allRoutes().then(allRoutes => {
  allRoutes.map(route =>
    $('#routes').append(`<div class="single-route"><p>${route.address}</p></div>`)
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
  $('#routes').append($(`<div class="single-route"><p>${address}</p></div>`));
  createRoute(address, lat, lng);

  $('#calendar').fullCalendar('refetchEvents');
  let form = $("#addForm").html();
  $("div.single-route:last-child").append(form);
});
