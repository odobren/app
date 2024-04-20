window.onload=()=>setTimeout(()=>{loader.style.display="none"},3e3);

const form=document.getElementById("loanForm"),monthlyPayment=document.getElementById("monthlyPayment"),approvalAmount=document.getElementById("approvalAmount");

form.addEventListener("submit",e=>{
    e.preventDefault();
    const[v,borrowerAgeInput,borrowerNameInput,loanDateInput,pensionContributionsInput,loanCloseDateInput]=["loanAmount","borrowerAge","borrowerName","loanDate","pensionContributions","loanCloseDate"].map(id=>document.getElementById(id).value.trim());

    if([v,borrowerAgeInput,borrowerNameInput,loanDateInput,pensionContributionsInput,loanCloseDateInput].some(val=>"")) {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    const loanAmount=parseFloat(v.replace(/\D/g,"")),borrowerAge=parseInt(borrowerAgeInput),pensionContributions=parseFloat(pensionContributionsInput.replace(/\D/g,""));

    if(isNaN(loanAmount)||isNaN(borrowerAge)||isNaN(pensionContributions)||loanAmount<=0||borrowerAge<18||borrowerAge>68) {
        alert("Пожалуйста, введите корректные данные.");
        return;
    }

    const maxLoanTerm=Math.min(15,68-borrowerAge);
    document.getElementById("loanTerm").value=maxLoanTerm;

    const annualInterestRate=18.5,monthlyInterestRate=annualInterestRate/100/12,loanTermMonths=maxLoanTerm*12;

    try {
        const monthlyPaymentValue=(loanAmount*monthlyInterestRate)/(1-Math.pow(1+monthlyInterestRate,-loanTermMonths));
        monthlyPayment.innerText=`Ежемесячный платеж: ${monthlyPaymentValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g," ")} тенге`;

        const approvalAmountValue=((pensionContributions*8.1/6/2)/0.0165).toFixed(2);
        approvalAmount.value=approvalAmountValue;

        calculateCreditHistoryRecovery();
    } catch (error) {
        alert("Произошла ошибка при расчете. Пожалуйста, проверьте введенные данные и попробуйте еще раз.");
    }
});

document.getElementById("borrowerAge").addEventListener("change",()=>{
    const borrowerAgeInput=document.getElementById("borrowerAge").value.trim();
    if(borrowerAgeInput==="") return;

    const borrowerAge=parseInt(borrowerAgeInput),maxLoanTerm=Math.min(15,68-borrowerAge);
    document.getElementById("loanTerm").value=maxLoanTerm;

    calculateCreditHistoryRecovery();
});

document.getElementById("pensionContributions").addEventListener("input",calculateApprovalAmount);

document.getElementById("loanCloseDate").addEventListener("change",calculateCreditHistoryRecovery);

function calculateApprovalAmount() {
    const pensionContributionsInput=document.getElementById("pensionContributions").value.trim();
    if(pensionContributionsInput==="") return;

    const pensionContributions=parseFloat(pensionContributionsInput.replace(/\D/g,""));
    const approvalAmountValue=((pensionContributions*8.1/6/2)/0.0165).toFixed(2);
    approvalAmount.value=approvalAmountValue;
}

function calculateCreditHistoryRecovery() {
    const loanDateInput=document.getElementById("loanDate").value.trim(),loanCloseDateInput=document.getElementById("loanCloseDate").value.trim();
    if(loanDateInput===""||loanCloseDateInput==="") return;

    const loanDate=new Date(loanDateInput),loanCloseDate=new Date(loanCloseDateInput);
    const monthsDifference=(loanDate.getFullYear()-loanCloseDate.getFullYear())*12+loanDate.getMonth()-loanCloseDate.getMonth();
    const creditHistoryRecovery=Math.max(24-monthsDifference,0);
    document.getElementById("creditHistoryRecovery").value=creditHistoryRecovery;
}
