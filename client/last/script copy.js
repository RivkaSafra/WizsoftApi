
const invoiceData = {
  AccountKey: "", 
  moves: [],
};

function addProduct() {
  var table = document.getElementById("productTable").getElementsByTagName('tbody')[0];

  var newRow = table.insertRow(table.rows.length);

  // Add cells with input elements
  for (var i = 0; i < 7; i++) {
    var cell = newRow.insertCell(i);
    var input = document.createElement('input');
    input.type = 'text';
    input.name = getColumnName(i); // Use a helper function to get the column name
    cell.appendChild(input);
  }

  // Add a button in the last cell for removing the row
  var removeButtonCell = newRow.insertCell(7);
  var removeButton = document.createElement('button');
  removeButton.textContent = 'מחק';
  removeButton.onclick = function() { removeProduct(this); };
  removeButtonCell.appendChild(removeButton);
  
}

function removeProduct(button) {
  var row = button.parentNode.parentNode;
  row.parentNode.removeChild(row);
}

function getColumnName(index) {
  var columnNames = ['CurrencyCode','Quantity', 'Rate','DiscountPrc', 'Price', 'ItemName', 'ItemKey'];
  return columnNames[index];
}

function productsDataFromTable(){
  const productTable = document.getElementById("productTable").getElementsByTagName('tbody')[0];
  const products = [];
  // Iterate through rows and collect product data
  for (let i = 0; i < productTable.rows.length; i++) {
    const product = {};
    for (let j = 0; j < productTable.rows[i].cells.length - 1; j++) {
      const key = getColumnName(j);
      const value = productTable.rows[i].cells[j].getElementsByTagName("input")[0].value;
      product[key] = value;
    }
    products.push(product);
    return products;
  }
}

async function handle500StatusCode (response){
  const error = await response.json();
  const errorDiv = document.getElementById("errorsPreview");
  errorDiv.innerText = error[1].map(err => err.txtmsg).toString();
  console.log(error[1].map(err => err.txtmsg).toString());
}

async function handle200StatusCode (response){
  const result = await response.json();
  console.log(result[0].urlDoc);
  // window.location.href = result[0].urlDoc;
  window.open(result[0].urlDoc);
}
function inoviceDataToSend(){
  const accountKey = document.getElementById("accountKey").value;
  const products=productsDataFromTable(); 
  return { AccountKey: accountKey, moves: products };
}



async function handleAccountKeyBlur() {
  try {
    const accountKey = document.getElementById("accountKey").value;

    const response = await fetch("http://localhost:4000/exportAccountDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountKey }),
    });
    if(response.status==400){
      var inputElements = document.getElementsByClassName('input-container');
    
      // Loop through each input element and clear its value
      for (var i = 0; i < inputElements.length; i++) {
        inputElements[i].value = '';
      }
    }
    if (response.status === 200) {
      // const filteredDetails = Object.fromEntries(
      //   Object.entries(result.status.repdata[0]).filter(([key, value]) => value !== null)
      // );
      const result = await response.json();

      // const accountDetailsContent = document.getElementById("accounKeyContent");  
      // const detailsString = Object.entries(result.status.repdata[0])
      //   .map(([key, value]) => `${key}: ${value}`)
      //   .join(" ");
     
      // accountDetailsContent.innerText = detailsString;
      console.log(result.status.repdata[0]);
      Object.entries(result.status.repdata[0])
      .forEach(([key, value]) => {
        const el=document.getElementById(key)
        if(el)
          el.value=value
          
        
        })
     ;
    } 
    else{
      debugger;
      const error=await response.json();
      const errorDiv=document.getElementById("errorsPreview");
      console.log(error.status.errors)
      errorDiv.innerText=error.status.errors;
      // accountDetailsContent.innerText ="failed to fetch acoount details"
    }

  } catch (error) {
    console.error("Error fetching account details:", error.message);
  }
}


function displayErrors(){
  console.log(error.response.data[1])
}

async function exportMovements() {
    const accountKey = document.getElementById("accountKeyMovments").value;
    const exportMovementsResult = document.getElementById("exportMovementsResult");
    const response = await fetch("http://localhost:4000/exportMovments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountKey })
    });
    console.log(response.status);
    if (response.status === 200) {
      const result = await response.json();
      const detailsString = Object.entries(result.status.repdata[0])
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
      exportMovementsResult.innerText = detailsString;
      document.getElementById("errorsMovmentsPreview").style.visibility="visible"
      // console.log(result.status.repdata[0]);
    }
    if(response.status==500){
      const error=await response.json();
      const errorDiv=document.getElementById("errorsMovmentsPreview");
      errorDiv.style.visibility="visible"
      exportMovementsResult.innerText='';
      errorDiv.innerText=error.status.errors;
    }

  } 




























// const invoiceData = {
//     rows: {
//       DocumentID: 1,
//       AccountKey: "30005",
//       moves: [],
//     },
//   };
  
// function addProduct() {
//     const accountKey = document.getElementById("accountKey").value;
//     const itemCode = document.getElementById("itemCode").value;
//     const itemName = document.getElementById("itemName").value;
//     const price = parseFloat(document.getElementById("price").value);
//     const quantity = parseInt(document.getElementById("quantity").value);
//     const discount = parseInt(document.getElementById("discount").value);
//     const rate = parseFloat(document.getElementById("rate").value);
//     const currency = document.getElementById("currency").value;
//     const dueDate = document.getElementById("dueDate").value;
  
//     const newProduct = {
//       ItemKey: itemCode, // Use the provided item code
//       ItemName: itemName,
//       Price: price,
//       Quantity: quantity,
//       DiscountPrc: discount,
//       Rate: rate,
//       CurrencyCode: currency,
//       DUEDATE: dueDate,
//     };
  
//     invoiceData= {
//       AccountKey: accountKey,
//       moves: [...invoiceData.rows.moves, newProduct],
//     };
  
//     updateInvoicePreview();
//     clearProductForm();
//   }  
  
//   function clearProductForm() {
//     document.getElementById("itemCode").value = "";
//     document.getElementById("itemName").value = "";
//     document.getElementById("price").value = "";
//     document.getElementById("quantity").value = "";
//     document.getElementById("discount").value = "";
//     document.getElementById("rate").value = "";
//     document.getElementById("currency").value = "";
//     document.getElementById("dueDate").value = "";
//   }
  
//   function updateInvoicePreview() {
//     const invoiceList = document.getElementById("invoiceList");
//     invoiceList.innerHTML = "";
  
//     invoiceData.rows.moves.forEach((product) => {
//       const listItem = document.createElement("li");
//       listItem.textContent = `${product.ItemName} ItemKey: ${product.ItemKey}- Quantity: ${product.Quantity} - Price: ${product.Price} ${product.CurrencyCode}`;
//       invoiceList.appendChild(listItem);
//     });
//   }
  
//   async function createInvoice() {
//     debugger;
//     try {
//       const response = await fetch('http://localhost:4000/createInovice', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(invoiceData),
//       });
  
//       const result = await response.json();
//       console.log('Invoice Created:', result);
//     } catch (error) {
//       console.error('Error creating invoice:', error.message);
//     }
//   }
  