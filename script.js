// Обработчик отправки формы
document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Проверяем, установлена ли дата кредита и дата закрытия крупной просрочки
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var majorDefaultClosureDateInput = document.getElementById("majorDefaultClosureDate").value.trim();

    if (loanDateInput === "" || majorDefaultClosureDateInput === "") {
        alert("Пожалуйста, укажите дату кредита и дату закрытия крупной просрочки.");
        return;
    }

    // Остальной код остается без изменений
    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    var borrowerNameInput = document.getElementById("borrowerName").value.trim();
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim(); // Новое поле пенсионных отчислений

    if (loanAmountInput === "" || borrowerAgeInput === "" || borrowerNameInput === "" || pensionContributionsInput === "") {
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

        // Рассчет срока восстановления кредитной истории
        var loanDate = new Date(loanDateInput);
        var majorDefaultClosureDate = new Date(majorDefaultClosureDateInput);
        var monthsDifference = (majorDefaultClosureDate.getFullYear() - loanDate.getFullYear()) * 12 + (majorDefaultClosureDate.getMonth() - loanDate.getMonth());

        if (monthsDifference <= 24) {
            document.getElementById("creditHistoryRecoveryTerm").value = monthsDifference + " месяца";
        } else {
            document.getElementById("creditHistoryRecoveryTerm").value = "Восстановление не требуется";
        }
    } catch (error) {
        alert("Произошла ошибка при расчете. Пожалуйста, проверьте введенные данные и попробуйте еще раз.");
    }
});

// Функция для автоматического обновления срока кредита
document.getElementById("borrowerAge").addEventListener("change", function() {
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    if (borrowerAgeInput === "") return;

    var borrowerAge = parseInt(borrowerAgeInput);
    var maxLoanTerm = Math.min(15, 68 - borrowerAge);
    document.getElementById("loanTerm").value = maxLoanTerm;
});

// Функция для автоматического обновления суммы одобрения
document.getElementById("pensionContributions").addEventListener("input", function() {
    calculateApprovalAmount();
});

// Функция для автоматического обновления срока восстановления кредитной истории
document.getElementById("majorDefaultClosureDate").addEventListener("input", function() {
    calculateCreditHistoryRecoveryTerm();
});

function calculateApprovalAmount() {
    var pensionContributionsInput = document.getElementById("pensionContributions").value.trim();

    if (pensionContributionsInput === "") return;

    var pensionContributions = parseFloat(pensionContributionsInput.replace(/\D/g, '')); // Преобразование в числовой формат

    var approvalAmount = ((pensionContributions * 8.1 / 6 / 2) / 0.0165).toFixed(2);

    // Устанавливаем значение в поле суммы одобрения
    document.getElementById("approvalAmount").value = approvalAmount;
}

function calculateCreditHistoryRecoveryTerm() {
    var loanDateInput = document.getElementById("loanDate").value.trim();
    var majorDefaultClosureDateInput = document.getElementById("majorDefaultClosureDate").value.trim();

    if (loanDateInput === "" || majorDefaultClosureDateInput === "") return;

    var loanDate = new Date(loanDateInput);
    var majorDefaultClosureDate = new Date(majorDefaultClosureDateInput);
    var monthsDifference = (majorDefaultClosureDate.getFullYear() - loanDate.getFullYear()) * 12 + (majorDefaultClosureDate.getMonth() - loanDate.getMonth());

    if (monthsDifference <= 24) {
        document.getElementById("creditHistoryRecoveryTerm").value = monthsDifference + " месяца";
    } else {
        document.getElementById("creditHistoryRecoveryTerm").value = "Восстановление не требуется";
    }
}
