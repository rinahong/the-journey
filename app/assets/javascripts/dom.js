

$('#map').on('click', '.fa.fa-plus-circle', e => {
  let address = $('#routeInfo p').html();
  $('#routes').append($(`<div class="single-route"><p>${address}</p></div>`));

  let form =
  `<form
    action="/routes"
    method='POST'
  >
    <div class="form-group">
      <input
        class="form-control"
        type="text"
        name="startDate"
        value=""
      >
    </div>

    <div class="form-group">
      <input
        class="form-control"
        type="text"
        name="endDate"
        value=""
      >
    </div>

    <input
      class="btn btn-outline-primary"
      type='submit'
      value='Submit'
    />
  </form>`
  $("div.single-route:last-child").append(form);
});
