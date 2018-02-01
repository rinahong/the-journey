$('#map').on('click', '.fa.fa-plus-circle', e => {
  let address = $('#routeInfo .address').html();
  $('#routes').append($(`<div class="single-route"><p>${address}</p></div>`));
  console.log(address)
  let form =
  `<%= form_for @route do |f| %>
    <div class="form-group">
      <%= f.label :start_date %>
      <%= f.text_field :start_date, data:{ provide:'datepicker' } %>
    </div>
    <%= f.submit 'Sign In!', class:"btn btn-primary"%>
  <% end %>`
  $("div.single-route:last-child").append(form);


});
