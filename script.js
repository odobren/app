document.getElementById("borrowerAge").addEventListener("input", function() {
    var borrowerAge = parseInt(this.value);
    var loanTermInput = document.getElementById("loanTerm");
    
    // Максимальный срок кредита устанавливается как разница между максимальным возрастом и возрастом заемщика, но не более 15 лет
    var maxLoanTerm = Math.min(68 - borrowerAge, 15);
    
    // Ограничиваем текущее значение срока кредита новым максимальным значением
    loanTermInput.max = maxLoanTerm;
    
    // Если текущее значение срока кредита превышает новый максимальный срок, обновляем его
    if (parseFloat(loanTermInput.value) > maxLoanTerm) {
        loanTermInput.value = maxLoanTerm;
    }
});

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
    var borrowerAge = parseInt(borrowerAgeInput);

    if (isNaN(loanAmount) || isNaN(loanTermYears) || isNaN(borrowerAge) || loanAmount <= 0 || loanTermYears <= 0 || borrowerAge < 18 || borrowerAge > 68) {
        alert("Пожалуйста, введите корректные данные.");
        return;
    }

    // Определение максимального срока кредита на основе возраста заемщика
    var maxLoanTerm = Math.min(loanTermYears, 68 - borrowerAge, 15);

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
