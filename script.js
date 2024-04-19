// Обработчик отправки формы
document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    var borrowerNameInput = document.getElementById("borrowerName").value.trim();
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim(); // Новое поле пенсионных отчислений
    var closingDateInput = document.getElementById("closingDate").value.trim(); // Новое поле Дата закрытия крупной просрочки

    // Проверка заполнены ли все поля
    if (loanAmountInput === "" || borrowerAgeInput === "" || borrowerNameInput === "" || loanDateInput === "" || pensionContributionsInput === "" || closingDateInput === "") {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    var loanAmount = parseFloat(loanAmountInput.replace(/\D/g, ''));
    var borrowerAge = parseInt(borrowerAgeInput);
    var pensionContributions = parseFloat(pensionContributionsInput.replace(/\D/g, '')); // Преобразование в числовой формат

    if (isNaN(loanAmount) || isNaN(borrowerAge) || isNaN(pensionContributions) || loanAmount <= 0 || borrowerAge < 18 || borrowerAge > 68) {
        alert("Пожалуйста, введите корректные данные.");
        return;
    }

    // Определение максимального срока кредита на основе возраста заемщика
    var maxLoanTerm = Math.min(15, 68 - borrowerAge);

    // Установка срока кредита в поле ввода
    document.getElementById("loanTerm").value = maxLoanTerm;

    var annualInterestRate = 18.5; // Процентная ставка 18.5%
    var monthlyInterestRate = annualInterestRate / 100 / 12;
    var loanTermMonths = maxLoanTerm * 12;
    
    try {
        // Рассчитываем ежемесячный платеж
        var monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));

        // Рассчитываем сумму одобрения
        var approvalAmount = ((pensionContributions * 8.1 / 6 / 2) / 0.0165).toFixed(2);

        // Форматируем ежемесячный платеж с разделением пробелом
        var formattedMonthlyPayment = monthlyPayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

        // Выводим результат на страницу
        document.getElementById("monthlyPayment").innerText = "Ежемесячный платеж: " + formattedMonthlyPayment + " тенге";
        document.getElementById("approvalAmount").value = approvalAmount; // Устанавливаем значение в поле суммы одобрения
    } catch (error) {
        alert("Произошла ошибка при расчете. Пожалуйста, проверьте введенные данные и попробуйте еще раз.");
    }
});

// Функция для расчета поля "Срок восстановления кредитной истории"
function calculateCreditHistoryRecovery() {
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var closingDateInput = document.getElementById("closingDate").value.trim();

    // Проверка, что оба поля заполнены
    if (loanDateInput === "" || closingDateInput === "") return;

    var loanDate = new Date(loanDateInput);
    var closingDate = new Date(closingDateInput);

    // Разница в месяцах между Датой и Датой закрытия крупной просрочки
    var monthDifference = (closingDate.getFullYear() - loanDate.getFullYear()) * 12 + closingDate.getMonth() - loanDate.getMonth();

    var creditHistoryRecovery; // Переменная для хранения значения поля "Срок восстановления кредитной истории"

    // Логика определения значения поля "Срок восстановления кредитной истории"
    if (monthDifference === 0) {
        creditHistoryRecovery = 24; // Если Дата: и Дата закрытия крупной просрочки в один месяц
    } else if (monthDifference >= 24) {
        creditHistoryRecovery = 0; // Если разница больше или равна 24 месяцам
    } else {
        creditHistoryRecovery = 24 - monthDifference; // Иначе, вычисляем по формуле
    }

    // Устанавливаем значение в поле "Срок восстановления кредитной истории"
    document.getElementById("creditHistoryRecovery").value = creditHistoryRecovery;
}

// Вызываем функцию для расчета поля "Срок восстановления кредитной истории" сразу после загрузки страницы
calculateCreditHistoryRecovery();

// Обработчик изменения поля "Дата" или "Дата закрытия крупной просрочки" для автоматического обновления поля "Срок восстановления кредитной истории"
document.getElementById("loanDate").addEventListener("change", calculateCreditHistoryRecovery);
document.getElementById("closingDate").addEventListener("change", calculateCreditHistoryRecovery);

// Обработчик изменения возраста заемщика для автоматического обновления срока кредита
document.getElementById("borrowerAge").addEventListener("change", function() {
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    if (borrowerAgeInput === "") return;

    var borrowerAge = parseInt(borrowerAgeInput);
    var maxLoanTerm = Math.min(15, 68 - borrowerAge);
    document.getElementById("loanTerm").value = maxLoanTerm;
});

// Обработчик изменения поля с пенсионными отчислениями для автоматического обновления суммы одобрения
document.getElementById("pensionContributions").addEventListener("input", function() {
    calculateApprovalAmount(); // Вызываем функцию для расчета суммы одобрения
});

// Функция для расчета суммы одобрения
function calculateApprovalAmount() {
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim();

    if (pensionContributionsInput === "") return;

    var pensionContributions = parseFloat(pensionContributionsInput.replace(/\D/g, '')); // Преобразование в числовой формат

    var approvalAmount = ((pensionContributions * 8.1 / 6 / 2) / 0.0165).toFixed(2);

    // Устанавливаем значение в поле суммы одобрения
    document.getElementById("approvalAmount").value = approvalAmount;
}
