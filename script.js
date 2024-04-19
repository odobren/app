// Обработчик отправки формы
document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    var borrowerNameInput = document.getElementById("borrowerName").value.trim();
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var latePaymentClosureDateInput = document.getElementById("latePaymentClosureDate").value.trim(); // Новое поле для даты закрытия крупной просрочки
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim();

    // Проверка на наличие введенной даты закрытия крупной просрочки
    if (loanAmountInput === "" || borrowerAgeInput === "" || borrowerNameInput === "" || loanDateInput === "" || latePaymentClosureDateInput === "" || pensionContributionsInput === "") {
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

    calculateCreditHistoryRecoveryPeriod(); // Вызываем функцию для расчета срока восстановления кредитной истории
});

// Обработчик изменения поля с датой закрытия крупной просрочки для автоматического обновления срока восстановления кредитной истории
document.getElementById("latePaymentClosureDate").addEventListener("change", function() {
    calculateCreditHistoryRecoveryPeriod(); // Вызываем функцию для расчета срока восстановления кредитной истории
});

// Функция для расчета срока восстановления кредитной истории
function calculateCreditHistoryRecoveryPeriod() {
    var loanDateInput = new Date(document.getElementById("loanDate").value.trim());
    var latePaymentClosureDateInput = new Date(document.getElementById("latePaymentClosureDate").value.trim());
    
    // Проверка, была ли введена дата кредита и дата закрытия крупной просрочки
    if (!loanDateInput || !latePaymentClosureDateInput) return;

    var monthsDifference = (latePaymentClosureDateInput.getMonth() - loanDateInput.getMonth()) +
        (12 * (latePaymentClosureDateInput.getFullYear() - loanDateInput.getFullYear()));

    var creditHistoryRecoveryPeriod = 0;

    if (monthsDifference === 0) {
        creditHistoryRecoveryPeriod = 24; // Если даты в одном месяце, то срок восстановления 24 месяца
    } else if (monthsDifference >= 24) {
        creditHistoryRecoveryPeriod = 0; // Если разница в месяцах больше или равна 24, то срок восстановления 0 месяцев
    } else {
        creditHistoryRecoveryPeriod = 24 - monthsDifference; // Иначе считаем разницу между 24 и месяцами
    }

    document.getElementById("creditHistoryRecoveryPeriod").value = creditHistoryRecoveryPeriod; // Устанавливаем значение в поле срока восстановления кредитной истории
}
