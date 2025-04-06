
document.addEventListener('DOMContentLoaded', function () {
  const depositRows = document.getElementById('depositRows');
  const paymentDetailsContainer = document.getElementById('paymentDetailsContainer');
  const additionalPaymentInfo = document.getElementById('additionalPaymentInfo');
  const exportBtn = document.getElementById('exportBtn');
  const calculateBtn = document.querySelector('button[onclick="calculateRefund()"]');
  const addRowBtn = document.querySelector('button[onclick="addDepositRow()"]');

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

  function bindRowEvents(row, index) {
    row.querySelector('.removeBtn').addEventListener('click', function () {
      row.remove();
      updateTotals();
    });

    row.querySelector('.paymentType').addEventListener('change', function () {
      updatePaymentDetails(this, index);
    });
  }

  function updatePaymentDetails(selectElem, rowIndex) {
    const type = selectElem.value;
    const id = `details-${rowIndex}`;
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const section = document.createElement('div');
    section.id = id;

    let html = `<h4>Payment Type: ${type}</h4>`;

    if (type === 'BACS') {
      html += `
        <label>Customer Name:</label><input type="text" class="bacsName"><br>
        <label>Phone:</label><input type="text" class="bacsPhone"><br>
        <label>Email:</label><input type="email" class="bacsEmail"><br><br>
      `;
    } else if (type === 'Payment Link') {
      html += `
        <label>Customer Name:</label><input type="text" class="plinkName"><br>
        <label>Email:</label><input type="email" class="plinkEmail"><br><br>
      `;
    } else if (type === 'AMEX or Visa Terminal') {
      html += `
        <label>Auth Number:</label><input type="text" class="pdqAuth"><br>
        <label>Date Obtained:</label><input type="date" class="pdqDate"><br>
        <label><input type="checkbox" class="pdqRefunded"> Refunded on Terminal</label><br><br>
      `;
    } else {
      html += `<em>No extra details required.</em>`;
    }

    section.innerHTML = html;
    paymentDetailsContainer.appendChild(section);
  }

  function calculateRefund() {
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

      depositSummary.push(`<tr>
        <td>£${amount.toFixed(2)}</td>
        <td>${date}</td>
        <td>${type}</td>
        <td>${ref}</td>
      </tr>`);
    });

    document.getElementById('depositSummaryTable').innerHTML = `
      <table border="1" cellpadding="5" cellspacing="0">
        <thead><tr><th>Amount</th><th>Date</th><th>Type</th><th>Reference</th></tr></thead>
        <tbody>${depositSummary.join('')}</tbody>
      </table>
    `;

    const refundDue = depositTotal - totalWithVat;

    document.getElementById('depositTotal').textContent = `£${depositTotal.toFixed(2)}`;
    document.getElementById('refundAmount').textContent = `£${refundDue.toFixed(2)}`;

    exportBtn.style.display = 'inline-block';
  }

  if (addRowBtn) addRowBtn.addEventListener('click', addDepositRow);
  if (calculateBtn) calculateBtn.addEventListener('click', calculateRefund);
});
