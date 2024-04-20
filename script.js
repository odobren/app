window.onload = () => setTimeout(() => {
    document.getElementById("loader").style.display = "none";
}, 3000);

const form = document.getElementById("loanForm");
const monthlyPayment = document.getElementById("monthlyPayment");
const approvalAmount = document.getElementById("approvalAmount");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const { value: loanAmountInput } = document.getElementById("loanAmount");
    const { value: borrowerAgeInput } = document.getElementById("borrowerAge");
    const { value: borrowerNameInput } = document.getElementById("borrowerName");
    const { value: loanDateInput } = document.getElementById("loanDate");
    const { value: pensionContributionsInput } = document.getElementById("pensionContributions");
    const { value: loanCloseDateInput } = document.getElementById("loanCloseDate");

    if ([loanAmountInput, borrowerAgeInput, borrowerNameInput, loanDateInput, pensionContributionsInput, loanCloseDateInput].some(val => val === "")) {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    const loanAmount = parseFloat(loanAmountInput.replace(/\D/g, ''));
    const borrowerAge = parseInt(borrowerAgeInput);
    const pensionContributions = parseFloat(pensionContributionsInput.replace(/\D/g, ''));

    if (isNaN(loanAmount) || isNaN(borrowerAge) || isNaN(pensionContributions) || loanAmount <= 0 || borrowerAge < 18 || borrowerAge > 68) {
        alert("Пожалуйста, введите корректные данные.");
        return;
    }

    const maxLoanTerm = Math.min(15, 68 - borrowerAge);
    document.getElementById("loanTerm").value = maxLoanTerm;

    const annualInterestRate = 18.5;
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const loanTermMonths = maxLoanTerm * 12;

    try {
        const monthlyPaymentValue = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths));
        const formattedMonthlyPayment = monthlyPaymentValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

        monthlyPayment.innerText = `Ежемесячный платеж: ${formattedMonthlyPayment} тенге`;

        const approvalAmountValue = ((pensionContributions * 8.1 / 6 / 2) / 0.0165).toFixed(2);
        approvalAmount.value = approvalAmountValue;

        calculateCreditHistoryRecovery();
    } catch (error) {
        alert("Произошла ошибка при расчете. Пожалуйста, проверьте введенные данные и попробуйте еще раз.");
    }
});

document.getElementById("borrowerAge").addEventListener("change", () => {
    const { value: borrowerAgeInput } = document.getElementById("borrowerAge");
    if (borrowerAgeInput === "") return;

    const borrowerAge = parseInt(borrowerAgeInput);
    const maxLoanTerm = Math.min(15, 68 - borrowerAge);
    document.getElementById("loanTerm").value = maxLoanTerm;

    calculateCreditHistoryRecovery();
});

document.getElementById("pensionContributions").addEventListener("input", calculateApprovalAmount);

document.getElementById("loanCloseDate").addEventListener("change", calculateCreditHistoryRecovery);

function calculateApprovalAmount() {
    const { value: pensionContributionsInput } = document.getElementById("pensionContributions");
    if (pensionContributionsInput === "") return;

    const pensionContributions = parseFloat(pensionContributionsInput.replace(/\D/g, ''));
    const approvalAmountValue = ((pensionContributions * 8.1 / 6 / 2) / 0.0165).toFixed(2);
    approvalAmount.value = approvalAmountValue;
}

function calculateCreditHistoryRecovery() {
    const { value: loanDateInput } = document.getElementById("loanDate");
    const { value: loanCloseDateInput } = document.getElementById("loanCloseDate");
    if (loanDateInput === "" || loanCloseDateInput === "") return;

    const loanDate = new Date(loanDateInput);
    const loanCloseDate = new Date(loanCloseDateInput);
    const monthsDifference = (loanDate.getFullYear() - loanCloseDate.getFullYear()) * 12 + loanDate.getMonth() - loanCloseDate.getMonth();
    const creditHistoryRecovery = 24 - monthsDifference;
    document.getElementById("creditHistoryRecovery").value = Math.max(creditHistoryRecovery, 0);
}
