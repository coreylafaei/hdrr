
document.addEventListener("DOMContentLoaded", function () {
    const calcBtn = document.getElementById("calcBtn");
    const exportBtn = document.getElementById("exportBtn");

    if (calcBtn) {
        calcBtn.addEventListener("click", function () {
            const deposit = parseFloat(document.getElementById("depositPaid").value);
            const hire = parseFloat(document.getElementById("hireCost").value);

            if (isNaN(deposit) || isNaN(hire)) {
                alert("Please enter both values.");
                return;
            }

            const refund = (deposit - hire).toFixed(2);
            const result = document.getElementById("result");
            result.innerHTML = `Refund Due: <strong>£${refund}</strong>`;

            exportBtn.style.display = "inline-block";
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener("click", function () {
            const form = document.getElementById("refundForm").cloneNode(true);
            const resultText = document.getElementById("result").innerHTML;

            const result = document.createElement("div");
            result.innerHTML = resultText;
            form.appendChild(result);

            html2pdf().from(form).set({
                filename: 'hire-refund-summary.pdf',
                margin: 10,
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }).save();
        });
    }
});
