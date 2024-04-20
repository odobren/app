window.addEventListener("load", () => setTimeout(() => document.getElementById("loader").style.display = "none", 3000));

document.getElementById("loanForm").addEventListener("submit", event => {
    event.preventDefault();
    const getInputValue = id => document.getElementById(id).value.trim();
    const showAlert = message => alert(message);

    const loanAmount = parseFloat(getInputValue("loanAmount").replace(/\D/g, ''));
    const borrowerAge = parseInt(getInputValue("borrowerAge"));
    const pensionContributions = parseFloat(getInputValue("pensionContributions").replace(/\D/g, ''));
    const maxLoanTerm = Math.min(15, 68 - borrowerAge);

    if ([loanAmount, borrowerAge, pensionContributions].some(isNaN) || loanAmount <= 0 || borrowerAge < 18 || borrowerAge > 68) {
        showAlert("Пожалуйста, введите корректные данные.");
        return;
    }

    document.getElementById("loanTerm").value = maxLoanTerm;

    const annualInterestRate = 18.5;
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const loanTermMonths = maxLoanTerm * 12;

    try {
        const monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));
        const approvalAmount = ((pensionContributions * 8.1 / 6 / 2) / 0.0165).toFixed(2);

        document.getElementById("monthlyPayment").innerText = `Ежемесячный платеж: ${monthlyPayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} тенге`;
        document.getElementById("approvalAmount").value = approvalAmount;

        calculateCreditHistoryRecovery();
    } catch (error) {
        showAlert("Произошла ошибка при расчете. Пожалуйста, проверьте введенные данные и попробуйте еще раз.");
    }
});

document.getElementById("borrowerAge").addEventListener("change", () => {
    const borrowerAge = parseInt(document.getElementById("borrowerAge").value.trim());
    if (borrowerAge) {
        document.getElementById("loanTerm").value = Math.min(15, 68 - borrowerAge);
        calculateCreditHistoryRecovery();
    }
});

document.getElementById("pensionContributions").addEventListener("input", calculateApprovalAmount);
document.getElementById("loanCloseDate").addEventListener("change", calculateCreditHistoryRecovery);

const calculateApprovalAmount = () => {
    const pensionContributions = parseFloat(document.getElementById("pensionContributions").value.trim().replace(/\D/g, ''));
    if (!isNaN(pensionContributions)) {
        document.getElementById("approvalAmount").value = ((pensionContributions * 8.1 / 6 / 2) / 0.0165).toFixed(2);
    }
}

const calculateCreditHistoryRecovery = () => {
    const loanDate = new Date(document.getElementById("loanDate").value.trim());
    const loanCloseDate = new Date(document.getElementById("loanCloseDate").value.trim());
    const monthsDifference = (loanDate.getFullYear() - loanCloseDate.getFullYear()) * 12 + loanDate.getMonth() - loanCloseDate.getMonth();
    document.getElementById("creditHistoryRecovery").value = Math.max(24 - monthsDifference, 0);
}
