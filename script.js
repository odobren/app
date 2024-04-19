// Обработчик отправки формы
document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    var borrowerNameInput = document.getElementById("borrowerName").value.trim();
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim();
    var creditDefaultDateInput = document.getElementById("creditDefaultDate").value.trim(); // Дата закрытия крупной просрочки

    if (loanAmountInput === "" || borrowerAgeInput === "" || borrowerNameInput === "" || loanDateInput === "" || pensionContributionsInput === "" || creditDefaultDateInput === "") {
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

        // Вызываем функцию для автоматического обновления срока восстановления кредитной истории
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

// Обработчик изменения даты закрытия крупной просрочки для автоматического обновления срока восстановления кредитной истории
document.getElementById("creditDefaultDate").addEventListener("change", function() {
    calculateCreditHistoryRecovery(); // Вызываем функцию для расчета срока восстановления кредитной истории
});

// Функция для автоматического обновления срока восстановления кредитной истории
function calculateCreditHistoryRecovery() {
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    var creditDefaultDateInput = document.getElementById("creditDefaultDate").value.trim();

    // Проверяем, были ли введены все необходимые данные
    if (loanDateInput === "" || borrowerAgeInput === "" || creditDefaultDateInput === "") return;

    var loanDate = new Date(loanDateInput);
    var borrowerAge = parseInt(borrowerAgeInput);
    var creditDefaultDate = new Date(creditDefaultDateInput);

    // Рассчитываем возраст заемщика на момент закрытия крупной просрочки
    var borrowerAgeAtDefault = borrowerAge + Math.floor((creditDefaultDate - loanDate) / (1000 * 60 * 60 * 24 * 365.25));

    // Вычисляем разницу в месяцах между возрастом заемщика на момент закрытия просрочки и возрастом, необходимым для получения кредита
    var monthsDifference = (borrowerAgeAtDefault - 18) * 12; // Переводим возраст в месяцы

    // Устанавливаем значение в поле срока восстановления кредитной истории
    if (monthsDifference <= -24) {
        document.getElementById("creditHistoryRecovery").value = "Восстановление не требуется";
    } else {
        document.getElementById("creditHistoryRecovery").value = Math.abs(monthsDifference) + " месяцев";
    }
}
