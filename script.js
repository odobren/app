// Обработчик отправки формы
document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    var borrowerNameInput = document.getElementById("borrowerName").value.trim();
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim(); // Новое поле пенсионных отчислений
    var largeOverdueDateInput = document.getElementById("largeOverdueDate").value.trim(); // Новое поле даты закрытия крупной просрочки

    // Проверяем, заполнены ли все обязательные поля
    if (loanAmountInput === "" || borrowerAgeInput === "" || borrowerNameInput === "" || loanDateInput === "" || pensionContributionsInput === "" || largeOverdueDateInput === "") {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    var loanAmount = parseFloat(loanAmountInput.replace(/\D/g, ''));
    var borrowerAge = parseInt(borrowerAgeInput);
    var pensionContributions = parseFloat(pensionContributionsInput.replace(/\D/g, '')); // Преобразование в числовой формат

    // Проверяем корректность введенных данных
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
    } catch (error) {
        alert("Произошла ошибка при расчете. Пожалуйста, проверьте введенные данные и попробуйте еще раз.");
    }

    // Рассчитываем срок восстановления кредитной истории
    calculateCreditHistoryRecovery();
});

// Функция для автоматического расчета срока восстановления кредитной истории
function calculateCreditHistoryRecovery() {
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var largeOverdueDateInput = document.getElementById("largeOverdueDate").value.trim();

    // Проверяем, заполнены ли оба поля с датами
    if (loanDateInput === "" || largeOverdueDateInput === "") return;

    var loanDate = new Date(loanDateInput);
    var largeOverdueDate = new Date(largeOverdueDateInput);

    // Рассчитываем разницу в месяцах между датами
    var monthsDifference = (largeOverdueDate.getFullYear() - loanDate.getFullYear()) * 12 + (largeOverdueDate.getMonth() - loanDate.getMonth());

    if (monthsDifference <= 24) {
        // Если разница до 24 месяцев, выводим результат в месяцах
        document.getElementById("creditHistoryRecovery").value = monthsDifference + " месяцев";
    } else {
        // Если разница больше 24 месяцев, выводим сообщение о необходимости восстановления
        document.getElementById("creditHistoryRecovery").value = "Восстановление не требуется";
    }
}

// Вызываем функцию для автоматического расчета срока восстановления кредитной истории
calculateCreditHistoryRecovery();

// Обработчик изменения поля с датой закрытия крупной просрочки для автоматического обновления срока восстановления
document.getElementById("largeOverdueDate").addEventListener("input", function() {
    calculateCreditHistoryRecovery();
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
