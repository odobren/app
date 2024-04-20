// chart.js

// Функция для отображения графика
function renderChart(monthlyPayments) {
    const ctx = document.getElementById('paymentChart').getContext('2d');

    // Создаем новый график
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyPayments.map((_, index) => `Месяц ${index + 1}`), // Метки оси X
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
