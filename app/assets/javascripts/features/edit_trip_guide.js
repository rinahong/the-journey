
var tour = {
     id: "hello-hopscotch",
     steps: [
       {
         target: "trip-edit-title",
         title: "Welcome to Trip's edit page!",
         content: "Hey there! You can add, delete, update itineraries on this page!",
         placement: "bottom",
         xOffset: 'center',
         arrowOffset: 'center'
       },
       {
         target: "map",
         placement: "top",
         xOffset: 'center',
         title: "Add a new itinerary",
         content: "Click on the map!"
       },
       {
         target: "routes",
         placement: "top",
         title: "Your Route",
         content: "Try update duration, delete route, or re-order them by drag and drop!",
       },
       {
         target: "routes",
         placement: "left",
         title: "Show itinerary detail",
         content: "Click the itinerary address in blue"
       }
     ],
     showPrevButton: true,
     scrollTopMargin: 100
   }

// Start the tour!
$(document).ready(() => {
  $('#startTourBtn').on('click', () => {
    console.log("helloooo")
    hopscotch.startTour(tour);
  })
})
