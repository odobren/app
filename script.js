document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    var borrowerNameInput = document.getElementById("borrowerName").value.trim();
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim();
    var latePaymentClosureDateInput = document.getElementById("latePaymentClosureDate").value.trim(); // Добавленное поле

    if (loanAmountInput === "" || borrowerAgeInput === "" || borrowerNameInput === "" || loanDateInput === "" || pensionContributionsInput === "") {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    if (latePaymentClosureDateInput === "") {
        alert("Пожалуйста, укажите дату закрытия крупной просрочки.");
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

        document.getElementById("monthlyPayment").innerText = "Ежемесячный платеж: " + monthlyPayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " тенге";
        document.getElementById("approvalAmount").value = approvalAmount;

        var creditHistoryRecoveryPeriod = calculateCreditHistoryRecoveryPeriod(loanDateInput, latePaymentClosureDateInput);
        document.getElementById("creditHistoryRecoveryPeriod").value = creditHistoryRecoveryPeriod;
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
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var latePaymentClosureDateInput = document.getElementById("latePaymentClosureDate").value.trim();

    if (loanDateInput === "" || latePaymentClosureDateInput === "") return;

    var creditHistoryRecoveryPeriod = calculateCreditHistoryRecoveryPeriod(loanDateInput, latePaymentClosureDateInput);
    document.getElementById("creditHistoryRecoveryPeriod").value = creditHistoryRecoveryPeriod;
});

function calculateApprovalAmount() {
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim();

    if (pensionContributionsInput === "") return;

    var pensionContributions = parseFloat(pensionContributionsInput.replace(/\D/g, ''));

    var approvalAmount = ((pensionContributions * 8.1 / 6 / 2) / 0.0165).toFixed(2);

    document.getElementById("approvalAmount").value = approvalAmount;
}

function calculateCreditHistoryRecoveryPeriod(loanDate, latePaymentClosureDate) {
    var loanDateObj = new Date(loanDate);
    var closureDateObj = new Date(latePaymentClosureDate);

    var monthsDifference = (closureDateObj.getFullYear() - loanDateObj.getFullYear()) * 12 + closureDateObj.getMonth() - loanDateObj.getMonth();
    
    if (monthsDifference < 1) {
        return "Восстановление не требуется";
    }

    return monthsDifference + " месяцев";
}
