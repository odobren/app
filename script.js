// Обработчик отправки формы
document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();
    calculateLoan();
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

// Обработчик изменения поля с датой закрытия крупной просрочки для автоматического обновления срока восстановления кредитной истории
document.getElementById("overdueDate").addEventListener("change", function() {
    calculateCreditHistoryRecovery(); // Вызываем функцию для расчета срока восстановления кредитной истории
});

// Функция для рассчета кредита
function calculateLoan() {
    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim();
    var overdueDateInput = document.getElementById("overdueDate").value.trim();

    if (loanAmountInput === "" || borrowerAgeInput === "" || loanDateInput === "" || pensionContributionsInput === "") {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    var loanAmount = parseFloat(loanAmountInput.replace(/\D/g, ''));
    var borrowerAge = parseInt(borrowerAgeInput);
    var pensionContributions = parseFloat(pensionContributionsInput.replace(/\D/g, ''));

    if (isNaN(loanAmount) || isNaN(borrowerAge) || isNaN(pensionContributions) || loanAmount <= 0 || borrowerAge < 18 || borrowerAge > 68) {
        alert("Пожалуйста, введите корректные данные.");
        return;
    }

    var maxLoanTerm = Math.min(15, 68 - borrowerAge);
    document.getElementById("loanTerm").value = maxLoanTerm;

    var annualInterestRate = 18.5;
    var monthlyInterestRate = annualInterestRate / 100 / 12;
    var loanTermMonths = maxLoanTerm * 12;

    try {
        var monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));
        var approvalAmount = ((pensionContributions * 8.1 / 6 / 2) / 0.0165).toFixed(2);
        var formattedMonthlyPayment = monthlyPayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        document.getElementById("monthlyPayment").innerText = "Ежемесячный платеж: " + formattedMonthlyPayment + " тенге";
        document.getElementById("approvalAmount").value = approvalAmount;

        if (overdueDateInput !== "") {
            calculateCreditHistoryRecovery();
        }
    } catch (error) {
        alert("Произошла ошибка при расчете. Пожалуйста, проверьте введенные данные и попробуйте еще раз.");
    }
}

// Функция для расчета суммы одобрения
function calculateApprovalAmount() {
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim();

    if (pensionContributionsInput === "") return;

    var pensionContributions = parseFloat(pensionContributionsInput.replace(/\D/g, ''));
    var approvalAmount = ((pensionContributions * 8.1 / 6 / 2) / 0.0165).toFixed(2);

    document.getElementById("approvalAmount").value = approvalAmount;
}

// Функция для расчета срока восстановления кредитной истории
function calculateCreditHistoryRecovery() {
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var overdueDateInput = document.getElementById("overdueDate").value.trim();

    if (loanDateInput === "" || overdueDateInput === "") return;

    var loanDate = new Date(loanDateInput);
    var overdueDate = new Date(overdueDateInput);

    var monthsDifference = (overdueDate.getFullYear() - loanDate.getFullYear()) * 12 + (overdueDate.getMonth() - loanDate.getMonth());
    var creditHistoryRecovery = Math.min(24, monthsDifference);

    document.getElementById("creditHistoryRecovery").value = creditHistoryRecovery + " месяцев";
}

// Вызываем функцию для расчета срока восстановления кредитной истории при загрузке страницы
document.addEventListener("DOMContentLoaded", function() {
    calculateCreditHistoryRecovery();
});
