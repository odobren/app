// Получаем данные из URL
const urlParams = new URLSearchParams(window.location.search);

// Получаем данные из URL, которые передали через параметры
const borrowerName = urlParams.get('borrowerName');
const borrowerAge = urlParams.get('borrowerAge');
const loanAmount = urlParams.get('loanAmount');
const loanTerm = urlParams.get('loanTerm');
const pensionContributions = urlParams.get('pensionContributions');
const approvalAmount = urlParams.get('approvalAmount');
const loanCloseDate = urlParams.get('loanCloseDate');
const creditHistoryRecovery = urlParams.get('creditHistoryRecovery');

// Формируем HTML для отображения результатов
const resultsHTML = `
    <p>ФИО заемщика: ${borrowerName}</p>
    <p>Возраст заемщика: ${borrowerAge}</p>
    <p>Сумма кредита: ${loanAmount}</p>
    <p>Срок кредита: ${loanTerm}</p>
    <p>Пенсионные отчисления: ${pensionContributions}</p>
    <p>Сумма одобрения: ${approvalAmount}</p>
    <p>Дата закрытия крупной просрочки: ${loanCloseDate}</p>
    <p>Срок восстановления КИ: ${creditHistoryRecovery}</p>
`;

// Выводим результаты на страницу
document.getElementById("results").innerHTML = resultsHTML;

// Генерируем PDF
generatePDF();

// Функция для генерации PDF
function generatePDF() {
    // Здесь ваш код для генерации PDF
    // Например, вы можете использовать библиотеку jsPDF
}
