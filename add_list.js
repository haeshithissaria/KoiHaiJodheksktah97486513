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

  // Get a reference to the database
  const database = firebase.database();
  
  // Add product form submit event listener
const productForm = document.getElementById('product-form');
productForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get form values
  const vendorName = document.getElementById('vendor-name').value;
  const productName = document.getElementById('product-name').value;
  const purchaseQuantity = parseInt(document.getElementById('purchase-quantity').value) || 0;
  const unitMeasure = document.getElementById('unit-measure').value;
  const purchasePrice = document.getElementById('purchase-price').value;
  const salePrice = document.getElementById('sale-price').value;
  const paymentStatus = document.getElementById('cash-checkbox').checked ? 'Cash' : 'Credit';

  // Calculate the quantity in stock (initially, it's the same as purchase quantity)
  const quantityInStock = purchaseQuantity;

  // Save product data to the database
  database.ref('products').push({
    vendorName: vendorName,
    productName: productName,
    purchaseQuantity: purchaseQuantity,
    quantityInStock: quantityInStock,
    unitMeasure: unitMeasure,
    purchasePrice: purchasePrice,
    salePrice: salePrice,
    paymentStatus: paymentStatus
  });
  // Clear the form fields
  productForm.reset();
});

// Read product data from the database and populate the product list table
database.ref('products').on('value', (snapshot) => {
  const productList = document.getElementById('product-table-body');

  // Clear the existing table rows
  productList.innerHTML = '';

  snapshot.forEach((childSnapshot) => {
    const childData = childSnapshot.val();

    // Calculate the quantity in stock
    const quantityInStock = childData.quantityInStock;

    // Create a table row for the product
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${childData.productName}</td>
      <td>${childData.vendorName}</td>
      <td>${childData.purchasePrice}</td>
      <td>${childData.salePrice}</td>
      <td>${childData.purchaseQuantity}</td>
      <td>${quantityInStock}</td>
      <td>${childData.unitMeasure}</td>
      <td>${childData.paymentStatus}</td>
    `;

    // Append the row to the table
    productList.appendChild(row);
  });
});