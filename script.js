// Обработчик отправки формы
document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    var borrowerNameInput = document.getElementById("borrowerName").value.trim();
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim(); // Новое поле пенсионных отчислений
    var latePaymentClosureDateInput = document.getElementById("latePaymentClosureDate").value.trim(); // Новое поле даты закрытия крупной просрочки

    if (loanAmountInput === "" || borrowerAgeInput === "" || borrowerNameInput === "" || loanDateInput === "" || pensionContributionsInput === "" || latePaymentClosureDateInput === "") {
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

        // Вызываем функцию для расчета срока восстановления кредитной истории
        calculateCreditHistoryRecoveryPeriod();
    } catch (error) {
        alert("Произошла ошибка при расчете. Пожалуйста, проверьте введенные данные и попробуйте еще раз.");
    }
});

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

// Добавляем обработчик изменения даты закрытия крупной просрочки
document.getElementById("latePaymentClosureDate").addEventListener("change", function() {
    calculateCreditHistoryRecoveryPeriod(); // Вызываем функцию для автоматического расчета срока восстановления кредитной истории
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

// Функция для расчета срока восстановления кредитной истории
function calculateCreditHistoryRecoveryPeriod() {
    var loanDateInput = document.getElementById("loanDate").value.trim(); // Дата оформления кредита
    var latePaymentClosureDateInput = document.getElementById("latePaymentClosureDate").value.trim(); // Дата закрытия крупной просрочки

    // Проверяем, чтобы обе даты были введены
    if (loanDateInput === "" || latePaymentClosureDateInput === "") return;

    var loanDate = new Date(loanDateInput);
    var latePaymentClosureDate = new Date(latePaymentClosureDateInput);

    // Вычисляем разницу в месяцах между датой закрытия просрочки и датой оформления кредита
    var monthsDifference = (latePaymentClosureDate.getFullYear() - loanDate.getFullYear()) * 12;
    monthsDifference += latePaymentClosureDate.getMonth() - loanDate.getMonth();

    // Устанавливаем значение в поле срока восстановления кредитной истории
    if (monthsDifference <= 0) {
        document.getElementById("creditHistoryRecoveryPeriod").value = "24"; // Если разница меньше или равна 0, устанавливаем 24 месяца
    } else if (monthsDifference >= 24) {
        document.getElementById("creditHistoryRecoveryPeriod").value = "0"; // Если разница больше или равна 24, устанавливаем 0 месяцев
    } else {
        document.getElementById("creditHistoryRecoveryPeriod").value = (24 - monthsDifference).toString(); // Иначе, устанавливаем разницу
    }
}

// Вызываем функцию для автоматического расчета срока восстановления кредитной истории при загрузке страницы
calculateCreditHistoryRecoveryPeriod();
