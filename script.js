// Обработчик отправки формы
document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    var borrowerNameInput = document.getElementById("borrowerName").value.trim();
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim();

    // Убираем проверку для Дата закрытия крупной просрочки
    if (loanAmountInput === "" || borrowerAgeInput === "" || borrowerNameInput === "" || loanDateInput === "" || pensionContributionsInput === "") {
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

        calculateCreditHistoryRecovery();
    } catch (error) {
        alert("Произошла ошибка при расчете. Пожалуйста, проверьте введенные данные и попробуйте еще раз.");
    }
});

// Обработчик изменения возраста заемщика
document.getElementById("borrowerAge").addEventListener("change", function() {
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    if (borrowerAgeInput === "") return;

    var borrowerAge = parseInt(borrowerAgeInput);
    var maxLoanTerm = Math.min(15, 68 - borrowerAge);
    document.getElementById("loanTerm").value = maxLoanTerm;

    calculateCreditHistoryRecovery();
});

// Обработчик изменения поля с пенсионными отчислениями
document.getElementById("pensionContributions").addEventListener("input", function() {
    calculateApprovalAmount();
});

// Обработчик изменения поля с датой закрытия крупной просрочки
document.getElementById("loanCloseDate").addEventListener("change", function() {
    calculateCreditHistoryRecovery();
});

// Обработчик клика по кнопке "Нет просрочки"
document.getElementById("noOverdueButton").addEventListener("click", function() {
    document.getElementById("creditHistoryRecovery").value = "Нет просрочки";
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
    var loanCloseDateInput = document.getElementById("loanCloseDate").value.trim();

    if (loanDateInput === "" || loanCloseDateInput === "") return;

    var loanDate = new Date(loanDateInput);
    var loanCloseDate = new Date(loanCloseDateInput);
    var monthsDifference = (loanDate.getFullYear() - loanCloseDate.getFullYear()) * 12 + loanDate.getMonth() - loanCloseDate.getMonth();

    var creditHistoryRecovery = 24 - monthsDifference;

    document.getElementById("creditHistoryRecovery").value = Math.max(creditHistoryRecovery, 0);
}
