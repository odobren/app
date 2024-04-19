document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var annualInterestRateInput = document.getElementById("annualInterestRate").value.trim();
    var loanTermInput = document.getElementById("loanTerm").value.trim();

    if (loanAmountInput === "" || annualInterestRateInput === "" || loanTermInput === "") {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    var loanAmount = parseFloat(loanAmountInput.replace(/\D/g, ''));
    var annualInterestRate = parseFloat(annualInterestRateInput.replace(",", "."));
    var loanTermYears = parseInt(loanTermInput);

    if (isNaN(loanAmount) || isNaN(annualInterestRate) || isNaN(loanTermYears) || loanAmount <= 0 || annualInterestRate <= 0 || loanTermYears <= 0) {
        alert("Пожалуйста, введите корректные данные.");
        return;
    }

    if (annualInterestRate > 100) {
        alert("Годовая процентная ставка не может быть больше 100%.");
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
