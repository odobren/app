// Обработчик отправки формы
document.getElementById("loanForm").addEventListener("submit", function(event) {
  event.preventDefault();

  var loanAmountInput = document.getElementById("loanAmount").value.trim();
  var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
  var borrowerNameInput = document.getElementById("borrowerName").value.trim();
  var loanDateInput = document.getElementById("loanDate").value.trim();
  var pensionContributionsInput = document.getElementById("pensionContributions").value.trim();
  var debtClosureDateInput = document.getElementById("debtClosureDate").value.trim();

  if (loanAmountInput === "" || borrowerAgeInput === "" || borrowerNameInput === "" || loanDateInput === "" || pensionContributionsInput === "" || debtClosureDateInput === "") {
    alert("Пожалуйста, заполните все поля.");
    return;
  }

  var loanAmount = parseFloat(loanAmountInput.replace(/\D/g, ''));
  var borrowerAge = parseInt(borrowerAgeInput);
  var pensionContributions = parseFloat(pensionContributionsInput.replace(/\D/g, ''));
  var debtClosureDate = new Date(debtClosureDateInput);
  var loanDate = new Date(loanDateInput);

  // Проверка даты закрытия крупной просрочки
  if (debtClosureDate < loanDate) {
    alert("Дата закрытия крупной просрочки не может быть раньше даты кредита.");
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
    // Расчет ежемесячного платежа
    var monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));

    // Расчет срока восстановления кредитной истории в месяцах
    var creditHistoryRecoveryPeriodMonths = Math.floor((debtClosureDate - loanDate) / (1000 * 60 * 60 * 24 * 30.44)) + 1;

    // Ограничение срока от 1 до 24 месяцев
    creditHistoryRecoveryPeriodMonths = Math.min(Math.max(creditHistoryRecoveryPeriodMonths, 1), 24);

    // Форматирование вывода
    var creditHistoryRecoveryPeriodText = creditHistoryRecoveryPeriodMonths === 24 ? "Восстановление не требуется" : creditHistoryRecoveryPeriodMonths + " месяцев";

    // Рассчитываем сумму одобрения (с учетом пенсионных отчислений и срока восстановления кредитной истории)
    var approvalAmount = ((pensionContributions * 8.1 / 6 / 2) / 0.0165) * (1 - (creditHistoryRecoveryPeriodMonths / 24));

    // Форматируем ежемесячный платеж с разделением пробелом
    var formattedMonthlyPayment = monthlyPayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    // Выводим результат на страницу
    document.getElementById("monthlyPayment").innerText = "Ежемесячный платеж: " + formattedMonthlyPayment + " тенге";
    document.getElementById("approvalAmount").value = approvalAmount.toFixed(2); // Устанавливаем значение в поле суммы одобрения
    document.getElementById("creditHistoryRecoveryPeriod").value = creditHistoryRecoveryPeriodText; // Отображение срока восстановления кредитной истории
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

  var pensionContributions = parseFloat(pensionContributionsInput.replace(/\D/g, '')); // Преобразование в числовой формат
  var creditHistoryRecoveryPeriodMonths = parseInt(document.getElementById("creditHistoryRecoveryPeriod").value); // Получаем значение срока восстановления из поля ввода

  // Учитываем срок восстановления кредитной истории при расчете суммы одобрения
  var approvalAmount = ((pensionContributions * 8.1 / 6 / 2) / 0.0165) * (1 - (creditHistoryRecoveryPeriodMonths / 24));

  // Устанавливаем значение в поле суммы одобрения
  document.getElementById("approvalAmount").value = approvalAmount.toFixed(2);
}

