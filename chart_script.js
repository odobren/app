// Получаем элемент, в который мы будем встраивать график
const chartContainer = document.getElementById('chartContainer');

// Создаем новый график
const chart = new Chart(chartContainer, {
    type: 'line', // Указываем тип графика (линейный)
    data: {
        labels: [], // Здесь будут храниться метки по оси X (например, месяцы)
        datasets: [{ // Набор данных для графика
            label: 'Ежемесячный платеж',
            data: [], // Динамические данные для графика (например, ежемесячные платежи)
            borderColor: 'rgb(255, 99, 132)', // Цвет линии графика
            borderWidth: 2, // Толщина линии графика
            fill: false // Заполнять область под графиком или нет
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Месяц' // Название оси X
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Сумма' // Название оси Y
                }
            }]
        }
    }
});

// Функция для обновления данных графика
function updateChart(labels, data) {
    chart.data.labels = labels; // Устанавливаем метки по оси X
    chart.data.datasets[0].data = data; // Устанавливаем данные для графика
    chart.update(); // Обновляем график
}

// Пример вызова функции обновления графика (вызывать в соответствующих местах вашего кода)
// const labels = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май']; // Пример массива меток
// const data = [100, 200, 150, 300, 250]; // Пример массива данных для графика
// updateChart(labels, data); // Обновляем график
