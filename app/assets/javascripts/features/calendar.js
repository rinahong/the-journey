
const tripid = $('#calendar').data('tripid');
$('#calendar').fullCalendar({
  events: `/trips/${tripid}.json`
});
