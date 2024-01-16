document.addEventListener("DOMContentLoaded", function() {

  // Retrieve customer and product details from session storage
  const customerName = sessionStorage.getItem('customerName');
  const mobileNumber = sessionStorage.getItem('mobileNumber');
  const products = JSON.parse(sessionStorage.getItem('products'));

  // Generate a random 5-digit bill number
  const billNumber = Math.floor(10000 + Math.random() * 90000);

  // Display the bill number on the page
  document.getElementById('billNumber').textContent = billNumber;

  // Display customer details
  document.getElementById('customerName').textContent = customerName;
  document.getElementById('mobileNumber').textContent = mobileNumber;

  let totalPrice = 0; // Initialize the total price to 0

  // Display product details and calculate the total price
  const productDetailsContainer = document.getElementById('product-details');
  products.forEach((product) => {
    const row = document.createElement('tr');
    const finalPrice = (product.unitPrice * product.quantity).toFixed(2); // Calculate final price
    row.innerHTML = `
      <td>${product.productName}</td>
      <td>${product.unitMeasure}</td>
      <td>${product.unitPrice}</td>
      <td>${product.quantity}</td>
      <td>${finalPrice}</td>
    `;
    productDetailsContainer.appendChild(row);
    totalPrice += parseFloat(finalPrice); // Add the final price to the total
  });

  // Update the total price on the page
  document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
});

// Function to download the bill as a PDF
function downloadBillAsPDF() {
  const billDetails = document.getElementById('bill-details');
  const billNumber = document.getElementById('billNumber').textContent;

  const pdfOptions = {
    margin: 10,
    filename: `Bill-${billNumber}.pdf`,
    image: { type: 'jpeg', quality: 0.7 },
    html2canvas: {
      scale: 2,
      y: 0,
      scrollY: 0,
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  // Check if html2pdf is available before using it
  if (typeof html2pdf !== 'undefined') {
    html2pdf().from(billDetails).set(pdfOptions).save();
  } else {
    console.error('html2pdf library is not loaded.');
  }
}

// Event listener for the Download Bill button
window.addEventListener("DOMContentLoaded", function () {
  var downloadButton = document.getElementById("downloadBill");
  downloadButton.addEventListener("click", function () {
    downloadBillAsPDF();
  });
});

// Function to update the formatted date and time in 12-hour format
function updateDateTime() {
  const dateTimeElement = document.getElementById('date-time');
  const currentDate = new Date();

  // Format the date as "dd/mm/yyyy"
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so add 1
  const year = currentDate.getFullYear();

  // Format the time in 12-hour format with AM/PM
  let hours = currentDate.getHours();
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const amPm = hours >= 12 ? 'PM' : 'AM';

  if (hours > 12) {
    hours -= 12;
  }

  dateTimeElement.textContent = `Date: ${day}/${month}/${year} | Time: ${hours}:${minutes} ${amPm}`;
}

// Call the function when the page loads
updateDateTime();
