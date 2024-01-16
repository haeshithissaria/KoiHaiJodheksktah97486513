// Initialize Firebase
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

// Reference to the 'products' node in the Firebase database
const productsRef = database.ref('products');

// Variables to store bill data
const productList = document.getElementById('product-list');
const totalPriceElement = document.getElementById('totalPrice');

// Array to store selected products
const selectedProducts = [];

// Function to calculate and update the final price for a product
function calculateFinalPrice(product) {
  if (product.quantity && product.salePrice) {
    return product.quantity * product.salePrice;
  }
  return 0; // Set to 0 if quantity or salePrice is missing or invalid
}
// Initialize a counter for serial numbers
let serialNumberCounter = 1;
// Function to add a product to the bill
function addProductToBill(product) {
  // Create a new table row for the product
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${product.productName}</td>
    <td>${product.unitMeasure}</td>
    <td>${product.salePrice}</td>
    <td>${product.purchasePrice}
    <td class="quantity-in-stock">Loading...</td> <!-- Placeholder for Quantity in Stock -->
    <td><input type="number" class="quantity-input" data-id="${product.id}" value=""></td>
    <td class="final-price">${calculateFinalPrice(product)}</td>
  `;

  productList.appendChild(row);

  // Add the product to the selectedProducts array
  selectedProducts.push(product);

   // Fetch and display the "Quantity in Stock"
const quantityInStockElement = row.querySelector('.quantity-in-stock');
const productRef = database.ref('products/' + product.id);
productRef.once('value', (snapshot) => {
  const productData = snapshot.val();
  if (productData && 'quantityInStock' in productData) {
    quantityInStockElement.textContent = productData.quantityInStock;
  }
});

  // Update the total price
  updateTotalPrice();
}

// Event listener for the product search button
const searchProductButton = document.getElementById('searchProduct');
searchProductButton.addEventListener('click', () => {
  const productNameInput = document.getElementById('productName');
  const productName = productNameInput.value;

  // Search for the product in Firebase database
  productsRef.once('value', (snapshot) => {

    snapshot.forEach((childSnapshot) => {
      const product = childSnapshot.val();
      if (product.productName.toLowerCase().includes(productName.toLowerCase())) {
        // Add the product to the selected products list
        product.id = childSnapshot.key; // Store the product's Firebase key
        addProductToBill(product);
      }
    });
  });
});

// Event listener for the quantity input fields
productList.addEventListener('input', (e) => {
  if (e.target.classList.contains('quantity-input')) {
    const productId = e.target.getAttribute('data-id');
    const quantity = parseFloat(e.target.value);
    

    const product = selectedProducts.find((p) => p.id === productId);
    if (product) {
      product.quantity = quantity;
    
      // Update the final price for the product
      const finalPriceElement = e.target.parentNode.nextElementSibling;
      finalPriceElement.textContent = calculateFinalPrice(product);

      // Update the total price
      updateTotalPrice();
    }
  }
});

// Function to update the total price based on the selected products
function updateTotalPrice() {
  let totalPrice = 0;
  selectedProducts.forEach((product) => {
    totalPrice += calculateFinalPrice(product);
  });
  totalPriceElement.textContent = totalPrice;
}

// ... (The rest of the code remains the same)

// Add this function to your billwindow.js file
function generateBillAndRedirect() {
  // Generate the bill data and store it in a variable, e.g., billData

  // Redirect to the "Bill" page with the bill data
  window.location.href = 'bill.html' ;
}


function generateBillAndRedirect() {

// Redirect to "bill.html"
window.location.href = 'bill.html';

  // Fetch customer details
  const customerName = document.getElementById('customerName').value;
  const mobileNumber = document.getElementById('mobileNumber').value;
  const productRows = document.querySelectorAll('#product-list tr');
  const products = [];



// Fetch product details
  productRows.forEach((row) => {
    const productName = row.cells[0].textContent;
    const unitMeasure = row.cells[1].textContent;
    const unitPrice = row.cells[2].textContent;
    const quantity = row.querySelector('.quantity-input').value;
    const finalPrice = row.querySelector('.final-price').textContent;

    products.push({ productName, unitMeasure, unitPrice, quantity, finalPrice });
  });

  // Store customer and product details in session storage
  sessionStorage.setItem('customerName', customerName);
  sessionStorage.setItem('mobileNumber', mobileNumber);
  sessionStorage.setItem('products', JSON.stringify(products));

  // Generate a random 5-digit bill number
const billNumber = Math.floor(10000 + Math.random() * 90000);

// Display the bill number in billwindow.html
document.getElementById('billNumber').textContent = billNumber;

// Store the bill number in local storage
localStorage.setItem('billNumber', billNumber);

// Redirect to "bill.html"
window.location.href = 'bill.html';

}

// Fetch and display the "Quantity in Stock"
const quantityInStockElement = row.querySelector('.quantity-in-stock');
const productRef = database.ref('products/' + product.id);
productRef.once('value', (snapshot) => {
  const productData = snapshot.val();
  if (productData && 'quantityInStock' in productData) {
    quantityInStockElement.textContent = productData.quantityInStock;
  }
});

// Event listener for the quantity input fields
productList.addEventListener('input', (e) => {
  if (e.target.classList.contains('quantity-input')) {
    const productId = e.target.getAttribute('data-id');
    const quantityInput = e.target;
    const quantity = parseFloat(quantityInput.value);

    const product = selectedProducts.find((p) => p.id === productId);
    if (product) {
      // Check if the entered quantity is greater than the quantity in stock
      if (quantity > product.quantityInStock) {
        // Prevent entering a greater quantity
        quantityInput.value = product.quantityInStock;
      }

      // Update the final price for the product
      const finalPriceElement = e.target.parentNode.nextElementSibling;
      finalPriceElement.textContent = calculateFinalPrice(product);
    }
    updateTotalPrice();
  }
});
function generateBillAndRedirect() {
  // Fetch customer details
  const customerName = document.getElementById('customerName').value;
  const mobileNumber = document.getElementById('mobileNumber').value;
  const productRows = document.querySelectorAll('#product-list tr');
  const products = [];
  

  // Initialize a flag to check if there's an issue with quantity exceeding stock
  let quantityExceedsStock = false;

  // Fetch product details and update quantity in stock
  productRows.forEach((row) => {
    const productName = row.cells[0].textContent;
    const unitMeasure = row.cells[1].textContent;
    const unitPrice = parseFloat(row.cells[2].textContent); // Parse unitPrice as a number
    const purchasePrice = parseFloat(row.cells[3].textContent);
    const quantityInput = row.querySelector('.quantity-input');
    const finalPrice = row.querySelector('.final-price');

    const quantity = parseFloat(quantityInput.value);
    const productId = quantityInput.getAttribute('data-id');
    
    // Fetch quantity in stock from the displayed table
    const quantityInStockElement = row.querySelector('.quantity-in-stock');
    const quantityInStock = parseFloat(quantityInStockElement.textContent);

    if (quantity <= quantityInStock) {
      // Subtract the quantity from quantity in stock
      const updatedQuantityInStock = quantityInStock - quantity;

      // Update the Firebase database with the new quantity in stock
      const productRef = database.ref('products/' + productId);
      productRef.update({ quantityInStock: updatedQuantityInStock });

      // Update the displayed quantity in stock in the bill table
      quantityInStockElement.textContent = updatedQuantityInStock;

      // Calculate and update the final price in the bill table
      finalPrice.textContent = (quantity * unitPrice).toFixed(2); // Update the final price with 2 decimal places

      // Add the product to the products array
      products.push({ productName, unitMeasure, unitPrice, purchasePrice, quantity, finalPrice });
    } else {
      // Handle an error or notify the user that the quantity exceeds the available stock.
      // For example, you can set a flag to indicate the issue:
      quantityExceedsStock = true;
    }
  });

   if(quantityExceedsStock) {
    alert("The quantity for one or more products exceeds the available stock. Please adjust the quantities.");
  } else {
    // Proceed to store customer and product details in session storage and redirect
    sessionStorage.setItem('customerName', customerName);
    sessionStorage.setItem('mobileNumber', mobileNumber);
    sessionStorage.setItem('products', JSON.stringify(products));

    // Redirect to "bill.html"
    window.location.href = 'bill.html';
  }
}
function generateBillAndRedirect() {
  // Fetch customer details
  const customerName = document.getElementById('customerName').value;
  const mobileNumber = document.getElementById('mobileNumber').value;
  const productRows = document.querySelectorAll('#product-list tr');
  const products = [];

  // Initialize a flag to check if there's an issue with quantity exceeding stock
  let quantityExceedsStock = false;

  // Fetch product details and update quantity in stock
  productRows.forEach((row) => {
    const productName = row.cells[0].textContent;
    const unitMeasure = row.cells[1].textContent;
    const unitPrice = parseFloat(row.cells[2].textContent); // Parse unitPrice as a number
    const purchasePrice = parseFloat(row.cells[3].textContent);
    const quantityInput = row.querySelector('.quantity-input');
    const finalPrice = row.querySelector('.final-price');

    const quantity = parseFloat(quantityInput.value);
    const productId = quantityInput.getAttribute('data-id');

    // Fetch quantity in stock from the displayed table
    const quantityInStockElement = row.querySelector('.quantity-in-stock');
    const quantityInStock = parseFloat(quantityInStockElement.textContent);

    if (quantity <= quantityInStock) {
      // Subtract the quantity from quantity in stock
      const updatedQuantityInStock = quantityInStock - quantity;

      // Update the Firebase database with the new quantity in stock
      const productRef = database.ref('products/' + productId);
      productRef.update({ quantityInStock: updatedQuantityInStock });

      // Update the displayed quantity in stock in the bill table
      quantityInStockElement.textContent = updatedQuantityInStock;

      // Calculate and update the final price in the bill table
      finalPrice.textContent = (quantity * unitPrice).toFixed(2); // Update the final price with 2 decimal places

      // Add the product to the products array
      products.push({ productName, unitMeasure, unitPrice, purchasePrice, quantity, finalPrice });
    } else {
      // Handle an error or notify the user that the quantity exceeds the available stock.
      // For example, you can set a flag to indicate the issue:
      quantityExceedsStock = true;
    }
  });

  if (quantityExceedsStock) {
    alert("The quantity for one or more products exceeds the available stock. Please adjust the quantities.");
  } else {
    // Proceed to store customer and product details in session storage
    sessionStorage.setItem('customerName', customerName);
    sessionStorage.setItem('mobileNumber', mobileNumber);
    sessionStorage.setItem('products', JSON.stringify(products));

    // Get the current date
    const currentDate = new Date();
    const saleHistoryRef = database.ref('saleHistory');
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format date as "YYYY-MM-DD"

    // Add the sale to the sales history for the current date
    const saleRecord = {
      customerName: customerName,
      mobileNumber: mobileNumber,
      products: products,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    // Push the sale record under the current date
    saleHistoryRef.child(formattedDate).push(saleRecord);

    // Redirect to "bill.html"
    window.location.href = 'bill.html';
  }
}


