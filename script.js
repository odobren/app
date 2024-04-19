// Обработчик отправки формы
document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    var borrowerNameInput = document.getElementById("borrowerName").value.trim();
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim(); // Новое поле пенсионных отчислений

    if (loanAmountInput === "" || borrowerAgeInput === "" || borrowerNameInput === "" || loanDateInput === "" || pensionContributionsInput === "") {
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

// Обработчик изменения даты закрытия крупной просрочки для автоматического обновления срока восстановления кредитной истории
document.getElementById("latePaymentClosureDate").addEventListener("change", function() {
    calculateCreditHistoryRecoveryTerm(); // Вызываем функцию для расчета срока восстановления кредитной истории
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
function calculateCreditHistoryRecoveryTerm() {
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var latePaymentClosureDateInput = document.getElementById("latePaymentClosureDate").value.trim();

    // Проверяем, установлена ли дата кредита и дата закрытия крупной просрочки
    if (loanDateInput === "" || latePaymentClosureDateInput === "") return;

    var loanDate = new Date(loanDateInput);
    var latePaymentClosureDate = new Date(latePaymentClosureDateInput);

    // Вычисляем разницу в месяцах между датами
    var monthsDifference = (latePaymentClosureDate.getFullYear() - loanDate.getFullYear()) * 12 + latePaymentClosureDate.getMonth() - loanDate.getMonth();

    // Проверяем условие для определения срока восстановления кредитной истории
    if (monthsDifference >= 24) {
        document.getElementById("creditHistoryRecoveryTerm").value = "Восстановление не требуется";
    } else if (monthsDifference < 1) {
        document.getElementById("creditHistoryRecoveryTerm").value = "Меньше месяца";
    } else {
        document.getElementById("creditHistoryRecoveryTerm").value = monthsDifference + " месяцев";
    }
}

// Вызываем функцию для автоматического расчета срока восстановления кредитной истории при загрузке страницы
calculateCreditHistoryRecoveryTerm();
