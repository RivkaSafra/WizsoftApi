
const invoiceData = {
  AccountKey: "", 
  moves: [],
};

function addProduct() {
  const accountKey = document.getElementById("accountKey").value;
  const itemCode = document.getElementById("itemCode").value;
  const itemName = document.getElementById("itemName").value;
  const price = parseFloat(document.getElementById("price").value);
  const quantity = parseInt(document.getElementById("quantity").value);
  const discount = parseInt(document.getElementById("discount").value);
  const rate = parseFloat(document.getElementById("rate").value);
  const currency = document.getElementById("currency").value;
  const dueDate = document.getElementById("dueDate").value;

  const newProduct = {
    ItemKey: itemCode,
    ItemName: itemName,
    Price: price,
    Quantity: quantity,
    DiscountPrc: discount,
    Rate: rate,
    CurrencyCode: currency,
    DUEDATE: dueDate,
  };

  invoiceData.AccountKey = accountKey; // Set the AccountKey dynamically
  invoiceData.moves.push(newProduct);

  updateInvoicePreview();
  clearProductForm();
}

function clearProductForm() {
  document.getElementById("itemCode").value = "";
  document.getElementById("itemName").value = "";
  document.getElementById("price").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("discount").value = "";
  document.getElementById("rate").value = "";
  document.getElementById("currency").value = "";
  document.getElementById("dueDate").value = "";
}

function updateInvoicePreview() {
  const invoiceList = document.getElementById("invoiceList");
  invoiceList.innerHTML = "";

  invoiceData.moves.forEach((product) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${product.ItemName} ItemKey: ${product.ItemKey}- Quantity: ${product.Quantity} - Price: ${product.Price} ${product.CurrencyCode}`;
    invoiceList.appendChild(listItem);
  });
}

async function createInvoice() {
  try {
    const response = await fetch("http://localhost:4000/createInvoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoiceData),
    });

  alert(response.status);
  if(response.status==200){
    const result = await response.json();
    console.log(result[0].urlDoc);
     
      // window.location.href = result[0].urlDoc;
      window.open(result[0].urlDoc);
  }


    if(response.status==500){
      debugger;
      const error=await response.json();
      const errorDiv=document.getElementById("errorsPreview");
      errorDiv.innerText= error[1].map(err=>err.txtmsg).toString(); 
      console.log(error[1].map(err=>err.txtmsg).toString())
    }
  } catch (error) {
    console.error("Error creating invoice:", error.message);
    console.log(error.response.data[1][0].txtmsg)
  }
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
    const accountDetailsContent = document.getElementById("accounKeyContent");  
    accountDetailsContent.innerText = '';
    if(response.status==400){
      accountDetailsContent.innerText = '';

    }
    else{
    if (response.status === 200) {
      // const filteredDetails = Object.fromEntries(
      //   Object.entries(result.status.repdata[0]).filter(([key, value]) => value !== null)
      // );
      const result = await response.json();
      const detailsString = Object.entries(result.status.repdata[0])
        .map(([key, value]) => `${key}: ${value}`)
        .join(" ");



      accountDetailsContent.innerText = detailsString;
            Object.entries(result.status.repdata[0])
        .forEach(([key, value]) =>document.getElementById(key).value=value)
      console.log(result.status.repdata[0]);
    } 
    else{

      const error=await response.json();
      const errorDiv=document.getElementById("errorsPreview");
      console.log(error.status.errors)
      errorDiv.innerText=error.status.errors;

      // accountDetailsContent.innerText ="failed to fetch acoount details"
    }
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
    console.log(response);


    if (response.status === 200) {
      // const filteredDetails = Object.fromEntries(
      //   Object.entries(result.status.repdata[0]).filter(([key, value]) => value !== null)
      // );
      const result = await response.json();

      console.log(200)
      console.log(result);
      const detailsString = Object.entries(result.status.repdata[0])
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");

      exportMovementsResult.innerText = detailsString;
      console.log(result.status.repdata[0]);
    }
    if(response.status==500){
      console.log('here');
      const error=await response.json();
      const errorDiv=document.getElementById("errorsPreview");
      console.log(error.status.errors)
      exportMovementsResult.innerText='';
      errorDiv.innerText=error.status.errors;
    }
    // else{
      
    //   exportMovementsResult.innerText ="no data"
    // }
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
  