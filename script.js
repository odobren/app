// Обработчик отправки формы
document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    var borrowerNameInput = document.getElementById("borrowerName").value.trim();
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim();
    var largeDelinquencyClosureDateInput = document.getElementById("largeDelinquencyClosureDate").value.trim();

    if (loanAmountInput === "" || borrowerAgeInput === "" || borrowerNameInput === "" || loanDateInput === "" || pensionContributionsInput === "" || largeDelinquencyClosureDateInput === "") {
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

        var creditHistoryRecoveryTerm = calculateCreditHistoryRecoveryTerm(loanDateInput, largeDelinquencyClosureDateInput);

        document.getElementById("monthlyPayment").innerText = "Ежемесячный платеж: " + monthlyPayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " тенге";
        document.getElementById("approvalAmount").value = approvalAmount;
        document.getElementById("creditHistoryRecoveryTerm").value = creditHistoryRecoveryTerm;
    } catch (error) {
        alert("Произошла ошибка при расчете. Пожалуйста, проверьте введенные данные и попробуйте еще раз.");
    }
});

// Функция для расчета срока восстановления кредитной истории
function calculateCreditHistoryRecoveryTerm(loanDate, closureDate) {
    var loanDateObj = new Date(loanDate);
    var closureDateObj = new Date(closureDate);

    var differenceInMonths = (closureDateObj.getFullYear() - loanDateObj.getFullYear()) * 12 + (closureDateObj.getMonth() - loanDateObj.getMonth());
    
    return differenceInMonths > 24 ? "Восстановление не требуется" : differenceInMonths + " месяцев";
}
