document.addEventListener('DOMContentLoaded', function () {
  const depositRows = document.getElementById('depositRows');
  const paymentDetailsContainer = document.getElementById('paymentDetailsContainer');
  const exportBtn = document.getElementById('exportBtn');
  const calculateBtn = document.getElementById('calculateBtn');
  const addRowBtn = document.getElementById('addRowBtn');

  function addDepositRow() {
    const rowIndex = depositRows.children.length;
    const row = document.createElement('tr');

    row.innerHTML = `
      <td><input type="number" step="0.01" class="depositAmount"></td>
      <td><input type="date" class="paymentDate"></td>
      <td>
        <select class="paymentType">
          <option value="">-- Select --</option>
          <option value="CASH">Cash</option>
          <option value="BACS">BACS</option>
          <option value="Payment Link">Payment Link</option>
          <option value="AMEX or Visa Terminal">AMEX or Visa Terminal</option>
        </select>
      </td>
      <td><input type="text" class="paymentReference"></td>
      <td><button type="button" class="removeBtn">Remove</button></td>
    `;

    depositRows.appendChild(row);
    bindRowEvents(row, rowIndex);
    updateTotals();
  }

  function bindRowEvents(row, rowIndex) {
    row.querySelector('.removeBtn').addEventListener('click', function () {
      row.remove();
      updateTotals();
    });

    row.querySelector('.paymentType').addEventListener('change', function () {
      updatePaymentDetails(this.value, rowIndex);
    });
  }

  function updatePaymentDetails(type, rowIndex) {
    const id = `details-${rowIndex}`;
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const section = document.createElement('div');
    section.id = id;
    let html = `<h4>Payment Type: ${type}</h4>`;

    if (type === 'BACS') {
      html += `
        <label>Customer Name:</label><input type="text"><br>
        <label>Phone:</label><input type="text"><br>
        <label>Email:</label><input type="email"><br>
      `;
    } else if (type === 'Payment Link') {
      html += `
        <label>Customer Name:</label><input type="text"><br>
        <label>Email:</label><input type="email"><br>
      `;
    } else if (type === 'AMEX or Visa Terminal') {
      html += `
        <label>Auth Number:</label><input type="text"><br>
        <label>Date Obtained:</label><input type="date"><br>
        <label><input type="checkbox"> Refunded on Terminal</label><br>
      `;
    } else {
      html += `<em>No additional details required.</em>`;
    }

    section.innerHTML = html;
    paymentDetailsContainer.appendChild(section);
  }

  function updateTotals() {
    const projected = parseFloat(document.getElementById('projectedAmount').value) || 0;
    const invoiced = parseFloat(document.getElementById('invoicedAmount').value) || 0;
    const netTotal = projected + invoiced;
    const vat = netTotal * 0.2;
    const totalWithVat = netTotal + vat;

    document.getElementById('totalNet').textContent = `£${netTotal.toFixed(2)}`;
    document.getElementById('vatAmount').textContent = `£${vat.toFixed(2)}`;
    document.getElementById('totalInclVAT').textContent = `£${totalWithVat.toFixed(2)}`;

    let depositTotal = 0;
    const depositSummary = [];

    depositRows.querySelectorAll('tr').forEach(row => {
      const amount = parseFloat(row.querySelector('.depositAmount').value) || 0;
      const date = row.querySelector('.paymentDate').value || '';
      const type = row.querySelector('.paymentType').value || '';
      const ref = row.querySelector('.paymentReference').value || '';

      depositTotal += amount;

      depositSummary.push(`
        <tr>
          <td>£${amount.toFixed(2)}</td>
          <td>${date}</td>
          <td>${type}</td>
          <td>${ref}</td>
        </tr>
      `);
    });

    document.getElementById('depositSummaryTable').innerHTML = `
      <table>
        <thead><tr><th>Amount</th><th>Date</th><th>Type</th><th>Reference</th></tr></thead>
        <tbody>${depositSummary.join('')}</tbody>
      </table>
    `;

    document.getElementById('depositTotal').textContent = `£${depositTotal.toFixed(2)}`;
    document.getElementById('refundAmount').textContent = `£${(depositTotal - totalWithVat).toFixed(2)}`;

    exportBtn.style.display = 'inline-block';
  }

  function exportToPDF() {
    const element = document.getElementById('refundFormWrapper');
    html2pdf().set({
      margin: 10,
      filename: 'hire-refund-summary.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
  }

  addRowBtn.addEventListener('click', addDepositRow);
  calculateBtn.addEventListener('click', updateTotals);
  exportBtn.addEventListener('click', exportToPDF);
});
