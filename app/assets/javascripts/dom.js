function ready (fn) {
  document.addEventListener('DOMContentLoaded', fn);
}

function create(addressPassed) {
  const tripid = $('#calendar').data('tripid');
  const myUrl = `http://localhost:3000/trips/${tripid}/routes`;
  const dataToSend = {
    address: addressPassed
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
  const tripid = $('#calendar').data('tripid');
  const myUrl = `http://localhost:3000/trips/${tripid}/routes`;
  return new Promise((resolve, reject) => {
    resolve(fetch(myUrl)
     .then(res => res.json())
    )
  })
}

// all().then(allRoutes => { console.log("allRoute>>>>",allRoutes)
//   allRoutes.map(route =>
//     $('#routes').append(`<div class="single-route"><p>${route.address}</p></div>`)
//   )
// })

ready(() => {
  all().then(allRoutes => { console.log("allRoute>>>>",allRoutes)
    allRoutes.map(route =>
      $('#routes').append(`<div class="single-route"><p>${route.address}</p></div>`)
    )
  })
});


// When + icon clicked, create a route with the address passing to the parameter.
// fullCalendar will refetch and rerender.
$('#map').on('click', '.fa.fa-plus-circle', e => {
  let address = $('#routeInfo .address').html();
  $('#routes').append($(`<div class="single-route"><p>${address}</p></div>`));
  create(address);
  $('#calendar').fullCalendar('refetchEvents');
  let form = $("#hideMe").html();
  $("div.single-route:last-child").append(form);
});
