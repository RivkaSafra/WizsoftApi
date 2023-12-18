
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
async function handleExportMovment200Status(response){
  const result = await response.json();
  const detailsString = Object.entries(result.status.repdata[0])
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
  exportMovementsResult.innerText = detailsString;
  document.getElementById("errorsMovmentsPreview").style.visibility="hidden"
  // console.log(result.status.repdata[0]);
}

async function handleExportMovment500Status(response){
 const error=await response.json();
      const errorDiv=document.getElementById("errorsMovmentsPreview");
      errorDiv.style.visibility="visible"
      exportMovementsResult.innerText='';
      errorDiv.innerText=error.status.errors;
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
      await handleExportMovment200Status(response); 
    }
    if(response.status==500){
     
    }

  } 
