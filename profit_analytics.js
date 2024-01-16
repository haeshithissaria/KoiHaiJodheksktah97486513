// Initialize Firebase (config remains the same)
const firebaseConfig = {
  apiKey: "AIzaSyC1AvTGg1pveLIEIyqy430mlmdK3ybLvAs",
  authDomain: "shop-9d9d9.firebaseapp.com",
  databaseURL: "https://shop-9d9d9-default-rtdb.firebaseio.com",
  projectId: "shop-9d9d9",
  storageBucket: "shop-9d9d9.appspot.com",
  messagingSenderId: "626252694764",
  appId: "1:626252694764:web:99029455bdeca7f2c911c9"
};

firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase database
const database = firebase.database();

// Reference to the 'sales' node in the Firebase database
const salesRef = firebase.database().ref('saleHistory');

$(document).ready(function () {
  $("#fetchDataButton").click(function () {
    const selectedDate = $("#datepicker").val();

    if (selectedDate) {
      calculateProfitsForDate(selectedDate);
    } else {
      alert("Please select a date");
    }
  });

  // Initialize the jQuery UI datepicker
  $("#datepicker").datepicker({
    dateFormat: "yy-mm-dd",
    onSelect: function (dateText) {
      // Trigger the Fetch Data button click when a date is selected
      $("#fetchDataButton").click();
    }
  });
});

function calculateProfitsForDate(selectedDate) {
  const profitTableBody = $("#profitTableBody");
  let totalProfit = 0;
  let totalSale = 0;
  let serialNumber = 1;

  profitTableBody.empty(); // Clear existing table rows

  const dateRef = database.ref('saleHistory/' + selectedDate);

  // Object to store cumulative quantity sold for each product
  const cumulativeQuantity = {};

  // Set to track unique product names
  const uniqueProductNames = new Set();

  dateRef.once('value', (dateSnapshot) => {
    dateSnapshot.forEach((saleSnapshot) => {
      const saleId = saleSnapshot.key;  // Assuming saleId is the key of the sale node
      const sale = saleSnapshot.val();
      const products = sale.products || [];

      products.forEach((product, index) => {
        const productName = product.productName;
        const quantitySold = parseFloat(product.quantity || 0);

        // Check if the product has already been added to the table
        if (!uniqueProductNames.has(productName)) {
          // Add product name to the set to track unique products
          uniqueProductNames.add(productName);

          // Accumulate quantity sold for each product
          cumulativeQuantity[productName] = (cumulativeQuantity[productName] || 0) + quantitySold;

          // Fetch purchasePrice from the database
          const purchasePriceRef = database.ref('saleHistory/' + selectedDate + '/' + saleId + '/products/' + index + '/purchasePrice');
          purchasePriceRef.once('value', (purchaseSnapshot) => {
            const purchasePrice = parseFloat(purchaseSnapshot.val() || 0);

            if (isNaN(purchasePrice)) {
              console.error("Invalid purchasePrice:", purchaseSnapshot.val());
            }

            // Fetch salePrice from the product object
            const salePrice = parseFloat(product.unitPrice || 0);

            const totalPurchasePrice = purchasePrice * cumulativeQuantity[productName];
            const totalSalePrice = salePrice * cumulativeQuantity[productName];
            const profit = totalSalePrice - totalPurchasePrice;

            // Create a new row in the table
            const row = `
              <tr>
                <td>${serialNumber}</td>
                <td>${productName}</td>
                <td>${purchasePrice ? `₹${purchasePrice.toFixed(2)}` : 'N/A'}</td>
                <td>${salePrice ? `₹${salePrice.toFixed(2)}` : 'N/A'}</td>
                <td>${cumulativeQuantity[productName]}</td>
                <td>${purchasePrice ? `₹${totalPurchasePrice.toFixed(2)}` : 'N/A'}</td>
                <td>${salePrice ? `₹${totalSalePrice.toFixed(2)}` : 'N/A'}</td>
                <td>${purchasePrice && salePrice ? `₹${profit.toFixed(2)}` : 'N/A'}</td>
              </tr>
            `;

            profitTableBody.append(row);

            // Increment the serial number for the next row
            serialNumber++;

            // Update total profit after processing each product
            totalProfit += profit;
            totalSale += totalSalePrice;

            if (index === products.length - 1) {
              const totalSaleElement = $("#totalSale");
              totalSaleElement.text(`Total Sale: ₹${totalSale.toFixed(2)}`);
            }
            // Display the total profit after processing all products
            if (index === products.length - 1) {
              const totalProfitElement = $("#totalProfit");
              totalProfitElement.text(`Total Profit: ₹${totalProfit.toFixed(2)}`);
            }
          });
        } else {
          // Update cumulative quantity for an existing product
          cumulativeQuantity[productName] += quantitySold;
        }
      });
    });
  });
}
