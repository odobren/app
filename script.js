// Обработчик отправки формы
document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    var borrowerNameInput = document.getElementById("borrowerName").value.trim();
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim();
    var majorDelayClosureDateInput = document.getElementById("majorDelayClosureDate").value.trim();

    if (loanAmountInput === "" || borrowerAgeInput === "" || borrowerNameInput === "" || loanDateInput === "" || pensionContributionsInput === "" || majorDelayClosureDateInput === "") {
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

        // Вызываем функцию для расчета срока восстановления кредитной истории
        calculateCreditHistoryRecovery();
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
    var majorDelayClosureDateInput = document.getElementById("majorDelayClosureDate").value.trim();

    if (loanDateInput === "" || majorDelayClosureDateInput === "") return;

    var loanDate = new Date(loanDateInput);
    var majorDelayClosureDate = new Date(majorDelayClosureDateInput);

    var monthsDifference = (majorDelayClosureDate.getFullYear() - loanDate.getFullYear()) * 12 + majorDelayClosureDate.getMonth() - loanDate.getMonth();

    if (monthsDifference <= 0) {
        document.getElementById("creditHistoryRecovery").value = "Восстановление не требуется";
    } else if (monthsDifference >= 24) {
        document.getElementById("creditHistoryRecovery").value = "24 месяца";
    } else {
        document.getElementById("creditHistoryRecovery").value = monthsDifference + " месяцев";
    }
}

// Обработчик изменения поля с датой закрытия крупной просрочки
document.getElementById("majorDelayClosureDate").addEventListener("change", function() {
    calculateCreditHistoryRecovery(); // Вызываем функцию для расчета срока восстановления кредитной истории
});
