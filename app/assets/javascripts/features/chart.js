const ctx = document.getElementById("donutChart").getContext('2d');

function all() {
  const baseUrl = env === 'development' ? 'http://localhost:3000/trips/' : 'https://awesome-journey.herokuapp.com/trips/'
  const tripIdChart = $('#donutChart').data('tripid');
  const myUrl = `${baseUrl}${tripIdChart}/expense_trackers`;
  return new Promise((resolve, reject) => {
    resolve(fetch(myUrl)
     .then(res => res.json())
    )
  })
}

const expense_chart_data = {};
all()
  .then( all_expenses => {
    all_expenses.map( expense => {
      let expenseCategory = expense.category.toLowerCase();
      if (expense_chart_data.hasOwnProperty(expenseCategory)) {
        expense_chart_data[expenseCategory] += expense.price;
      } else {
        expense_chart_data[expenseCategory] = expense.price;
      }
    })
  })
  .then(() => {
    let counter = 0;
    const colorArray = [];
    do {
      colorArray.push("#"+((1<<24)*Math.random()|0).toString(16));
      counter++;
    } while (Object.keys(expense_chart_data).length > counter );
    const data = {
        datasets: [{
            data: Object.values(expense_chart_data),
            backgroundColor: colorArray
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: Object.keys(expense_chart_data)
    };

    let myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            layout: {
                padding: {
                    left: 50,
                    right: 0,
                    top: 20,
                    bottom: 0
                }
            },
            legend: {
              position: 'bottom'
          }
        }
        // options: 'rotation'
    });
  })
