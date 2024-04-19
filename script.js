document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var loanAmount = parseFloat(document.getElementById("loanAmount").value.replace(/\D/g, ''));
    var annualInterestRate = parseFloat(document.getElementById("annualInterestRate").value.replace(",", ".")); // Заменяем запятую на точку для точности вычислений
    var loanTermYears = parseInt(document.getElementById("loanTerm").value);

    if (isNaN(loanAmount) || isNaN(annualInterestRate) || isNaN(loanTermYears) || loanAmount <= 0 || annualInterestRate <= 0 || loanTermYears <= 0) {
        alert("Пожалуйста, введите корректные данные.");
        return;
    }

    var monthlyInterestRate = annualInterestRate / 100 / 12;
    var loanTermMonths = loanTermYears * 12;
    
    // Рассчитываем ежемесячный платеж
    var monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));

    // Форматируем ежемесячный платеж с разделением пробелом
    var formattedMonthlyPayment = monthlyPayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    // Выводим результат на страницу
    document.getElementById("monthlyPayment").innerText = "Ежемесячный платеж: " + formattedMonthlyPayment + " тенге";
});
