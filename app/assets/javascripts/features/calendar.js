
const tripIdCalendar = $('#calendar').data('tripid');
$('#calendar').fullCalendar({
  events: `/trips/${tripIdCalendar}/routes.json`,
  defaultDate: $('#calendar').data('startdate')
});
