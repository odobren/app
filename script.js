// Обработчик отправки формы
document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    var borrowerNameInput = document.getElementById("borrowerName").value.trim();
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim();
    var largeOverdueDateInput = document.getElementById("largeOverdueDate").value.trim(); // Новое поле даты крупной просрочки

    // Проверка на заполнение всех полей
    if (loanAmountInput === "" || borrowerAgeInput === "" || borrowerNameInput === "" || loanDateInput === "" || pensionContributionsInput === "" || largeOverdueDateInput === "") {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    var loanAmount = parseFloat(loanAmountInput.replace(/\D/g, ''));
    var borrowerAge = parseInt(borrowerAgeInput);
    var pensionContributions = parseFloat(pensionContributionsInput.replace(/\D/g, ''));
    var largeOverdueDate = new Date(largeOverdueDateInput); // Преобразование в объект даты

    if (isNaN(loanAmount) || isNaN(borrowerAge) || isNaN(pensionContributions) || loanAmount <= 0 || borrowerAge < 18 || borrowerAge > 68) {
        alert("Пожалуйста, введите корректные данные.");
        return;
    }

    // Определение максимального срока кредита на основе возраста заемщика
    var maxLoanTerm = Math.min(15, 68 - borrowerAge);

    // Установка срока кредита в поле ввода
    document.getElementById("loanTerm").value = maxLoanTerm;

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

        // Рассчитываем и устанавливаем срок восстановления кредитной истории
        var creditHistoryRecoveryMonths = calculateCreditHistoryRecovery(loanDateInput, largeOverdueDateInput);
        document.getElementById("creditHistoryRecovery").value = creditHistoryRecoveryMonths + " месяцев";
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

// Функция для расчета срока восстановления кредитной истории в месяцах
function calculateCreditHistoryRecovery(loanDate, largeOverdueDate) {
    var loanDateObj = new Date(loanDate);
    var largeOverdueDateObj = new Date(largeOverdueDate);

    // Рассчитываем разницу в месяцах между датами
    var diffMonths = (largeOverdueDateObj.getFullYear() - loanDateObj.getFullYear()) * 12 + (largeOverdueDateObj.getMonth() - loanDateObj.getMonth());

    // Проверяем условие для вывода результата
    if (diffMonths < 1) {
        return "Восстановление не требуется";
    } else {
        return diffMonths;
    }
}

// Обработчик изменения поля с пенсионными отчислениями для автоматического обновления суммы одобрения
document.getElementById("pensionContributions").addEventListener("input", function() {
    calculateApprovalAmount(); // Вызываем функцию для расчета суммы одобрения
});

// Функция для расчета суммы одобрения
function calculateApprovalAmount() {
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim();

    if (pensionContributionsInput === "") return;

    var pensionContributions = parseFloat(pensionContributionsInput.replace(/\D/g, '')); // Преобразование в числовой формат

    var approvalAmount = ((pensionContributions * 8.1 / 6 / 2) / 0.0165).toFixed(2);

    // Устанавливаем значение в поле суммы одобрения
    document.getElementById("approvalAmount").value = approvalAmount;
}

// Функция для автоматического обновления срока восстановления кредитной истории при изменении даты закрытия крупной просрочки
document.getElementById("largeOverdueDate").addEventListener("change", function() {
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var largeOverdueDateInput = document.getElementById("largeOverdueDate").value.trim();

    // Проверяем, были ли введены обе даты
    if (loanDateInput !== "" && largeOverdueDateInput !== "") {
        var creditHistoryRecoveryMonths = calculateCreditHistoryRecovery(loanDateInput, largeOverdueDateInput);
        document.getElementById("creditHistoryRecovery").value = creditHistoryRecoveryMonths + " месяцев";
    }
});
