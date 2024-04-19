// Обработчик отправки формы
document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    var borrowerNameInput = document.getElementById("borrowerName").value.trim();
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim();
    var latePaymentDateInput = document.getElementById("latePaymentDate").value.trim();

    if (loanAmountInput === "" || borrowerAgeInput === "" || borrowerNameInput === "" || loanDateInput === "" || pensionContributionsInput === "" || latePaymentDateInput === "") {
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

        var latePaymentDate = new Date(latePaymentDateInput);
        var loanDate = new Date(loanDateInput);

        var monthsDifference = (latePaymentDate.getFullYear() - loanDate.getFullYear()) * 12;
        monthsDifference -= loanDate.getMonth() + 1;
        monthsDifference += latePaymentDate.getMonth() + 1;

        var creditHistoryRecovery = monthsDifference;

        if (creditHistoryRecovery > 24) {
            document.getElementById("creditHistoryRecovery").value = "Восстановление не требуется";
        } else {
            document.getElementById("creditHistoryRecovery").value = creditHistoryRecovery;
        }
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
    calculateApprovalAmount();
});

// Функция для расчета суммы одобрения
function calculateApprovalAmount() {
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim();

    if (pensionContributionsInput === "") return;

    var pensionContributions = parseFloat(pensionContributionsInput.replace(/\D/g, ''));

    var approvalAmount = ((pensionContributions * 8.1 / 6 / 2) / 0.0165).toFixed(2);

    document.getElementById("approvalAmount").value = approvalAmount;
}

// Обработчик изменения поля Дата закрытия крупной просрочки для автоматического обновления поля Срок восстановления кредитной истории
document.getElementById("latePaymentDate").addEventListener("change", function() {
    var latePaymentDateInput = document.getElementById("latePaymentDate").value.trim();
    var loanDateInput = document.getElementById("loanDate").value.trim();

    if (latePaymentDateInput === "" || loanDateInput === "") return;

    var latePaymentDate = new Date(latePaymentDateInput);
    var loanDate = new Date(loanDateInput);

    var monthsDifference = (latePaymentDate.getFullYear() - loanDate.getFullYear()) * 12;
    monthsDifference -= loanDate.getMonth() + 1;
    monthsDifference += latePaymentDate.getMonth() + 1;

    var creditHistoryRecovery = monthsDifference;

    if (creditHistoryRecovery > 24) {
        document.getElementById("creditHistoryRecovery").value = "Восстановление не требуется";
    } else {
        document.getElementById("creditHistoryRecovery").value = creditHistoryRecovery;
    }
});
