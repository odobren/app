// charts.js

// Функция для отображения графика
function displayChart(monthlyPayments) {
    var ctx = document.getElementById('paymentChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: monthlyPayments.length }, (_, i) => `Месяц ${i + 1}`),
            datasets: [{
                label: 'Ежемесячный платеж',
                data: monthlyPayments,
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
