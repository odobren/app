document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    var borrowerNameInput = document.getElementById("borrowerName").value.trim();
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim();
    var latePaymentClosureDateInput = document.getElementById("latePaymentClosureDate").value.trim(); // Новое поле для даты закрытия крупной просрочки

    if (loanAmountInput === "" || borrowerAgeInput === "" || borrowerNameInput === "" || loanDateInput === "" || pensionContributionsInput === "" || latePaymentClosureDateInput === "") {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    var loanAmount = parseFloat(loanAmountInput.replace(/\D/g, ''));
    var borrowerAge = parseInt(borrowerAgeInput);
    var pensionContributions = parseFloat(pensionContributionsInput.replace(/\D/g, '));
    var latePaymentClosureDate = new Date(latePaymentClosureDateInput); // Преобразование в объект даты

    if (isNaN(loanAmount) || isNaN(borrowerAge) || isNaN(pensionContributions) || loanAmount <= 0 || borrowerAge < 18 || borrowerAge > 68 || latePaymentClosureDate == "Invalid Date") {
        alert("Пожалуйста, введите корректные данные.");
        return;
    }

    // Определение максимального срока кредита на основе возраста заемщика
    var maxLoanTerm = Math.min(15, 68 - borrowerAge);

    // Установка срока кредита в поле ввода
    document.getElementById("loanTerm").value = maxLoanTerm;

    // Рассчитываем разницу между Дата закрытия крупной просрочки и введенной датой
    var today = new Date();
    var creditHistoryRecoveryTerm = Math.max(1, Math.min(24, Math.ceil((today - latePaymentClosureDate) / (30 * 24 * 60 * 60 * 1000)))) + " месяцев"; // В месяцах

    // Проверка на возможность восстановления кредитной истории
    var recoveryText = creditHistoryRecoveryTerm;

    // Установка значения в поле Срок восстановления кредитной истории
    document.getElementById("creditHistoryRecoveryTerm").value = recoveryText;

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

document.getElementById("borrowerAge").addEventListener("change", function() {
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    if (borrowerAgeInput === "") return;

    var borrowerAge = parseInt(borrowerAgeInput);
    var maxLoanTerm = Math.min(15, 68 - borrowerAge);
    document.getElementById("loanTerm").value = maxLoanTerm;
});

document.getElementById("pensionContributions").addEventListener("input", function() {
    calculateApprovalAmount();
});

document.getElementById("latePaymentClosureDate").addEventListener("change", function() {
    calculateCreditHistoryRecoveryTerm();
});

function calculateApprovalAmount() {
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim();

    if (pensionContributionsInput === "") return;

    var pensionContributions = parseFloat(pensionContributionsInput.replace(/\D/g, ''));

    var approvalAmount = ((pensionContributions * 8.1 / 6 / 2) / 0.0165).toFixed(2);

    document.getElementById("approvalAmount").value = approvalAmount;
}

function calculateCreditHistoryRecoveryTerm() {
    var latePaymentClosureDateInput = document.getElementById("latePaymentClosureDate").value.trim();

    if (latePaymentClosureDateInput === "") return;

    var latePaymentClosureDate = new Date(latePaymentClosureDateInput);
    var today = new Date();
    var creditHistoryRecoveryTerm = Math.max(1, Math.min(24, Math.ceil((today - latePaymentClosureDate) / (30 * 24 * 60 * 60 * 1000))));

    var recoveryText = creditHistoryRecoveryTerm <= 24 ? creditHistoryRecoveryTerm + " месяцев" : "не требуется";

    document.getElementById("creditHistoryRecoveryTerm").value = recoveryText;
}
