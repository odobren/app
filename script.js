// Обработчик отправки формы
document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var loanDateInput = document.getElementById("loanDate").value.trim();
    var latePaymentDateInput = document.getElementById("latePaymentDate").value.trim();
    var borrowerNameInput = document.getElementById("borrowerName").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim();

    if (loanDateInput === "" || latePaymentDateInput === "" || borrowerNameInput === "" || borrowerAgeInput === "" || loanAmountInput === "" || pensionContributionsInput === "") {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    var loanDate = new Date(loanDateInput);
    var latePaymentDate = new Date(latePaymentDateInput);
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

        var monthsDifference = (loanDate.getMonth() - latePaymentDate.getMonth()) + (12 * (loanDate.getFullYear() - latePaymentDate.getFullYear()));
        document.getElementById("creditHistoryRecovery").value = Math.abs(monthsDifference);
    } catch (error) {
        alert("Произошла ошибка при расчете. Пожалуйста, проверьте введенные данные и попробуйте еще раз.");
    }
});

// Обработчик изменения поля с датой закрытия крупной просрочки для расчета срока восстановления кредитной истории
document.getElementById("latePaymentDate").addEventListener("change", function() {
    calculateCreditHistoryRecovery();
});

// Обработчик изменения поля с датой начала кредита для автоматического обновления срока восстановления кредитной истории
document.getElementById("loanDate").addEventListener("change", function() {
    calculateCreditHistoryRecovery();
});

// Функция для расчета срока восстановления кредитной истории
function calculateCreditHistoryRecovery() {
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var latePaymentDateInput = document.getElementById("latePaymentDate").value.trim();

    if (loanDateInput === "" || latePaymentDateInput === "") return;

    var loanDate = new Date(loanDateInput);
    var latePaymentDate = new Date(latePaymentDateInput);

    var monthsDifference = (loanDate.getMonth() - latePaymentDate.getMonth()) + (12 * (loanDate.getFullYear() - latePaymentDate.getFullYear()));
    document.getElementById("creditHistoryRecovery").value = Math.abs(monthsDifference);
}
