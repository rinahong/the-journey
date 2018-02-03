
var data = {
    datasets: [{
        data: [25, 25, 25, 25]
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
        'Accomodation',
        'Food',
        'Shopping',
        'Travel'
    ]
};

var ctx = document.getElementById("donutChart").getContext('2d');
var myDoughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: data
    // options: 'rotation'
});
