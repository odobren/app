// Обработчик отправки формы
document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    var borrowerNameInput = document.getElementById("borrowerName").value.trim();
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim(); // Новое поле пенсионных отчислений
    var overdueDateInput = document.getElementById("overdueDate").value.trim(); // Новое поле даты закрытия просрочки

    if (loanAmountInput === "" || borrowerAgeInput === "" || borrowerNameInput === "" || loanDateInput === "" || pensionContributionsInput === "" || overdueDateInput === "") {
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

    var maxLoanTerm = Math.min(15, 68 - borrowerAge);
    document.getElementById("loanTerm").value = maxLoanTerm;

    var annualInterestRate = 18.5; // Процентная ставка 18.5%
    var monthlyInterestRate = annualInterestRate / 100 / 12;
    var loanTermMonths = maxLoanTerm * 12;
    
    try {
        var monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));
        var approvalAmount = ((pensionContributions * 8.1 / 6 / 2) / 0.0165).toFixed(2);
        var formattedMonthlyPayment = monthlyPayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

        document.getElementById("monthlyPayment").innerText = "Ежемесячный платеж: " + formattedMonthlyPayment + " тенге";
        document.getElementById("approvalAmount").value = approvalAmount;

        var recoveryPeriod = calculateRecoveryPeriod(loanDateInput, overdueDateInput);
        document.getElementById("recoveryPeriod").value = recoveryPeriod;
    } catch (error) {
        alert("Произошла ошибка при расчете. Пожалуйста, проверьте введенные данные и попробуйте еще раз.");
    }
});

// Функция для вычисления срока восстановления кредитной истории
function calculateRecoveryPeriod(loanDate, overdueDate) {
    var loanDateObj = new Date(loanDate);
    var overdueDateObj = new Date(overdueDate);
    var differenceInMonths = (overdueDateObj.getFullYear() - loanDateObj.getFullYear()) * 12 + (overdueDateObj.getMonth() - loanDateObj.getMonth()) + 1;
    if (differenceInMonths <= 24) {
        return differenceInMonths + " месяца";
    } else {
        return "Восстановление не требуется";
    }
}
