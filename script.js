document.getElementById("loanForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var loanAmountInput = document.getElementById("loanAmount").value.trim();
    var loanTermInput = document.getElementById("loanTerm").value.trim();
    var borrowerAgeInput = document.getElementById("borrowerAge").value.trim();

    if (loanAmountInput === "" || loanTermInput === "" || borrowerAgeInput === "") {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    var loanAmount = parseFloat(loanAmountInput.replace(/\D/g, ''));
    var loanTermYears = parseFloat(loanTermInput);
    var borrowerAge = parseFloat(borrowerAgeInput);

    if (isNaN(loanAmount) || isNaN(loanTermYears) || isNaN(borrowerAge) || loanAmount <= 0 || loanTermYears <= 0 || borrowerAge <= 0) {
        alert("Пожалуйста, введите корректные данные.");
        return;
    }

    if (borrowerAge > 68) {
        alert("Максимальный возраст заемщика 68 лет.");
        return;
    }

    var maxLoanTerm = Math.min(15, 68 - borrowerAge); // Вычисляем максимальный срок кредита, учитывая максимальный возраст заемщика

    if (loanTermYears > maxLoanTerm) {
        alert("Максимальный срок кредита для вашего возраста " + maxLoanTerm + " лет.");
        return;
    }
    
    var annualInterestRate = 18.5; // Процентная ставка 18.5%
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
