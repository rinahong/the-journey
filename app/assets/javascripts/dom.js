function create(valuePassed) {
  const tripid = $('#calendar').data('tripid');
  const dataToSend = {
    address: valuePassed
  }
  const myUrl = `http://localhost:3000/trips/${tripid}/routes`
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
  .then(res => {
    return res.json()
  })
  .then(data => {
    console.log("res >>> ", data, " of type >>>>", typeof(data))
  })
}

$('#map').on('click', '.fa.fa-plus-circle', e => {
  let address = $('#routeInfo .address').html();
  $('#routes').append($(`<div class="single-route"><p>${address}</p></div>`));
  console.log(address)
  create(address);
  let form = $("#hideMe").html();

  $("div.single-route:last-child").append(form);




});
