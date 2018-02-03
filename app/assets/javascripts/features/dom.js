
function create(address, latitude, longitude) {
  const tripid = $('#map').data('tripid');
  const myUrl = `http://localhost:3000/trips/${tripid}/routes`;
  const dataToSend = {
    address: address,
    latitude: latitude,
    longitude: longitude
  }

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

function all() {
  const tripid = $('#map').data('tripid');
  const myUrl = `http://localhost:3000/trips/${tripid}/routes`;
  return new Promise((resolve, reject) => {
    resolve(fetch(myUrl)
     .then(res => res.json())
    )
  })
}

all().then(allRoutes => { console.log("allRoute>>>>",allRoutes)
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
  $('#routes').append($(`<div class="single-route"><p>${address}</p></div>`));
  create(address, lat, lng);

  $('#calendar').fullCalendar('refetchEvents');
  let form = $("#addForm").html();
  $("div.single-route:last-child").append(form);
});

//
// var myDoughnutChart = new Chart(ctx, {
//     type: 'doughnut',
//     data: data,
//     options: options
// });
//
// data = {
//     datasets: [{
//         data: [10, 20, 30]
//     }],
//
//     // These labels appear in the legend and in the tooltips when hovering different arcs
//     labels: [
//         'Red',
//         'Yellow',
//         'Blue'
//     ]
// };
