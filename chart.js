// chart.js

// Функция для создания и обновления графика
function updateChart(loanAmount, loanTerm, monthlyPaymentValues) {
    // Получаем элемент, в который будем встраивать график (допустим, это div с id="chart")
    const chartContainer = document.getElementById("chart");

    // Очищаем контейнер перед созданием нового графика
    chartContainer.innerHTML = "";

    // Создаем новый элемент canvas для графика
    const canvas = document.createElement("canvas");
    chartContainer.appendChild(canvas);

    // Получаем контекст для рисования на canvas
    const ctx = canvas.getContext("2d");

    // Создаем новый график с помощью библиотеки Chart.js
    const chart = new Chart(ctx, {
        type: 'line', // Тип графика (линейный)
        data: {
            labels: Array.from({ length: loanTerm }, (_, i) => i + 1), // Метки по оси X (месяцы)
            datasets: [{
                label: 'Ежемесячный платеж', // Название набора данных
                data: monthlyPaymentValues, // Данные для отображения
                borderColor: 'rgb(255, 99, 132)', // Цвет линии
                borderWidth: 2, // Толщина линии
                fill: false // Не заливать область под линией
            }]
        },
        options: {
            responsive: true, // Адаптивность графика
            scales: {
                y: {
                    beginAtZero: true // Начинать отображение с 0 по оси Y
                }
            }
        }
    });
}
