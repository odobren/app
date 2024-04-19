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
    // Рассчет суммы одобрения
    try {
        var approvalAmount = ((pensionContributions * 8.1 / 6 / 2) / 0.0165).toFixed(2);

        // Устанавливаем значение в поле суммы одобрения
        document.getElementById("approvalAmount").value = approvalAmount;

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

document.getElementById("borrowerAge").addEventListener("change", function() {
    // Оставляем этот обработчик без изменений
});

document.getElementById("pensionContributions").addEventListener("input", function() {
    // Оставляем этот обработчик без изменений
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
