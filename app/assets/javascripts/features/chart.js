const ctx = document.getElementById("donutChart").getContext('2d');

function all() {
  const tripid = $('#donutChart').data('tripid');
  const myUrl = `http://localhost:3000/trips/${tripid}/expense_trackers`;
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
    console.log("all_expenses hash", expense_chart_data)
  })
  .then(() => {
    console.log("second then hash", expense_chart_data)
    const data = {
        datasets: [{
            data: Object.values(expense_chart_data)
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: Object.keys(expense_chart_data)
    };

    let myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: data
        // options: 'rotation'
    });
  })


// Object.values(expense_chart_data)
