
const invoiceData = {
  AccountKey: "", 
  moves: [],
};

async function exportMovements() {
  const accountKey = document.getElementById("accountKeyMovments").value;
  const response = await fetch("http://localhost:4000/exportMovments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ accountKey })
  });
  console.log(response.status);
  if (response.status === 200) {
    await handleExportMovment200Status(response); 
  }
  if(response.status==500){
    await handleExportMovment500Status(response); 
  }

} 

async function createInvoice() {
  try {
    const invoiceData =inoviceDataToSend(); 
    const response = await fetch("http://localhost:4000/createInvoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoiceData),
    });

    console.log(response.status);

    if (response.status === 200) {
      await handle200StatusCode(response); 
    }

    if (response.status === 500) {
        await handle500StatusCode(response); 
    }

  } catch (error) {
    console.error("Error creating invoice:", error.message);
  }
}


function addProduct() {
  var table = document.getElementById("productTable").getElementsByTagName('tbody')[0];
  var newRow = table.insertRow(table.rows.length);
  // Add cells with input elements
  for (var i = 0; i < 7; i++) {
    debugger;
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
  }
  return products;
}

function getColumnName(index) {
  var columnNames = {
    0: 'CurrencyCode',
    1: 'Quantity',
    2: 'Rate',
    3: 'DiscountPrc',
    4: 'Price',
    5: 'ItemName',
    6: 'ItemKey'
  };

  return columnNames[index];
}
async function handle500StatusCode (response){
  const error = await response.json();
  const errorDiv = document.getElementById("errorsPreview");
  errorDiv.innerText = error[1].map(err => err.txtmsg).toString();
  errorDiv.style.visibility="visible"
  console.log(error[1].map(err => err.txtmsg).toString());
}

async function handle200StatusCode (response){
  document.getElementById("errorsPreview").style.visibility="hidden"
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


function removeProduct(button) {
  var row = button.parentNode.parentNode;
  row.parentNode.removeChild(row);
}

function clearInputs(){
  var inputElements = document.getElementsByClassName('input-container');  
  // Loop through each input element and clear its value
  for (var i = 0; i < inputElements.length; i++) {
    inputElements[i].value = '';
  }
  document.getElementById("errorsPreview").style.visibility="hidden"
}
async function fillDataInInputs(response){      
  const result = await response.json();
  console.log(result.status.repdata[0]);
  Object.entries(result.status.repdata[0])
  .forEach(([key, value]) => {
    const el=document.getElementById(key)
    if(el)
      el.value=value
    });
    document.getElementById("errorsPreview").style.visibility="hidden"

}
async function displayError(response){
  const error=await response.json();
  const errorDiv=document.getElementById("errorsPreview");
  errorDiv.style.visibility="visible"
  console.log(error.status.errors)
  errorDiv.innerText=error.status.errors;
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
    switch (response.status) {
      case 400:
        clearInputs();
        break;
      
      case 200:
        await fillDataInInputs(response);
        break;
    
      default:
        {
        clearInputs();
        await displayError(response);
        break;}
    }
    
  } catch (error) {
    console.error("Error fetching account details:", error.message);
  }
}


async function handleExportMovment200Status(response){
  document.getElementById("errorsMovmentsPreview").style.visibility="hidden"
  const result = await response.json();
  debugger;
  // const detailsString = Object.entries(result.status.repdata[0])
  //   .map(([key, value]) => `${key}: ${value}`)
  //   .join("\n");
// Assuming repdata is your array of arrays of objects
const productTableBody = document.getElementById('productTableBody');
productTableBody.innerText=''
result.status.repdata.forEach((item, index) => {
  const newRow = document.createElement('tr');

  const cells = [
    `תנועה ${index + 1}`,
    item['4 ספרות אחרונות של כרטיס אשראי'],
    item['לקוח משלם באשראי'],
    item['חשבון זכות ראשי'],
    item['חשבון חובה ראשי'],
    item['שם חשבון זכות'],
    item['יתרת חשבון'],
    item['סוג תנועה']
    // Add more cells as needed
  ];

  cells.forEach((content) => {
    const cell = document.createElement('td');
    cell.textContent = content;
    newRow.appendChild(cell);
  });

  productTableBody.appendChild(newRow);
});


  console.log(resultString);
    const exportMovementsResult = document.getElementById("exportMovementsResult");
  exportMovementsResult.innerText = resultString;
  document.getElementById("errorsMovmentsPreview").style.visibility="hidden"
}

async function handleExportMovment500Status(response){
  const error=await response.json();
  const errorDiv=document.getElementById("errorsMovmentsPreview");
  errorDiv.style.visibility="visible"
  // exportMovementsResult.innerText='';
  errorDiv.innerText=error.status.errors;
  const productTableBody = document.getElementById('productTableBody');
productTableBody.innerText=''
}
