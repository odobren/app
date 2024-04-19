document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var loanTermInput = document.getElementById("loanTerm").value.trim();

    if (loanAmountInput === "" || loanTermInput === "") {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    var loanAmount = parseFloat(loanAmountInput.replace(/\D/g, ''));
    var annualInterestRate = 18.5; // Установка процентной ставки на 18.5%
    var loanTermYears = parseInt(loanTermInput);

    if (isNaN(loanAmount) || isNaN(loanTermYears) || loanAmount <= 0 || loanTermYears <= 0) {
        alert("Пожалуйста, введите корректные данные.");
        return;
    }

    var monthlyInterestRate = annualInterestRate / 100 / 12;
    var loanTermMonths = loanTermYears * 12;
    
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
