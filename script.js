document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var fullNameInput = document.getElementById("fullName").value.trim();
    var birthDateInput = document.getElementById("birthDate").value.trim();
    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();
    var loanTermInput = document.getElementById("loanTerm").value.trim();

    if (fullNameInput === "" || birthDateInput === "" || loanAmountInput === "" || borrowerAgeInput === "" || loanTermInput === "") {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    var loanAmount = parseFloat(loanAmountInput.replace(/\D/g, ''));
    var borrowerAge = parseInt(borrowerAgeInput);
    var loanTermYears = parseFloat(loanTermInput);

    if (isNaN(loanAmount) || isNaN(borrowerAge) || isNaN(loanTermYears) || loanAmount <= 0 || borrowerAge < 18 || borrowerAge > 68 || loanTermYears <= 0 || loanTermYears > 15) {
        alert("Пожалуйста, введите корректные данные.");
        return;
    }

    // Определение максимального срока кредита на основе возраста заемщика
    var maxLoanTerm = Math.min(15, 68 - borrowerAge);

    var annualInterestRate = 18.5; // Процентная ставка 18.5%
    var monthlyInterestRate = annualInterestRate / 100 / 12;
    var loanTermMonths = maxLoanTerm * 12;
    
    try {
        // Рассчитываем ежемесячный платеж
        var monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));

        // Форматируем ежемесячный платеж с разделением пробелом
        var formattedMonthlyPayment = monthlyPayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

        // Выводим результат на страницу
        document.getElementById("monthlyPayment").innerText = "Ежемесячный платеж: " + formattedMonthlyPayment + " тенге";
    } catch (error) {
        alert("Произошла ошибка при расчете. Пожалуйста, проверьте введенные данные и попробуйте еще раз.");
    }
});
