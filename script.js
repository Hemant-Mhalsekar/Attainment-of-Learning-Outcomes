// Function to handle form submission
let inputValues = [];
var refreshCount = 0;

var percentageArray = Array.from({ length: 4 }, () => []);

function SubmitForm2(e) {
  e.preventDefault();

  // Get input values
  let cell1Value = parseInt(document.getElementById("cell1").value, 10);
  let cell2Value = parseInt(document.getElementById("cell2").value, 10);
  let cell3Value = parseInt(document.getElementById("cell3").value, 10);
  let cell4Value = parseInt(document.getElementById("cell4").value, 10);

  // Assign cell values to respective indices in the inputValues array
  inputValues = [cell1Value, cell2Value, cell3Value, cell4Value];

  // Display object of input values (for demonstration purposes)
  console.log("Input Values:", inputValues);
}

function handleFileUpload() {
  var fileInput = document.getElementById("fileInput");
  var gridView2 = document.getElementById("gridView2");

  refreshCount++;

  localStorage.clear();

  var file = fileInput.files[0];
  var reader = new FileReader();

  reader.onload = function (e) {
    var data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, { type: "array" });
    var sheetName = workbook.SheetNames[0];
    var sheet = workbook.Sheets[sheetName];
    var jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    //****************************************************************************************************************************************************************************//
    //CREATING SECOND TABLE
    //****************************************************************************************************************************************************************************//

    // Initialize the HTML string for the table
    var html = "<table >";

    var html = "<div ></div><table class='w-full '>";
    // Loop through the rows of JSON data
    for (var i = 0; i < jsonData.length; i++) {
      html += "<tr>";

      // Loop through the columns of the current row
      for (var j = 0; j < jsonData[i].length; j++) {
        // If it's the first row, create header cells
        if (i === 0) {
          if (j < 3) {
            html +=
              "<th class='text-center h-10 bg-blue-500 '>" +
              jsonData[i][j] +
              "</th>"; // Create header cell with data
          }
        } else {
          if (j < 3) {
            html +=
              "<td class='text-center h-10 border border-gray-300'>" +
              jsonData[i][j] +
              "</td>"; // Create data cell with content
          }
        }

        // Check if it's the first row and the specific column for CO columns
        if (i === 0 && j === 2) {
          html +=
            "<th class='text-center h-10 bg-blue-500'>Remembering</th><th class='text-center h-10 bg-blue-500'>%</th>";
          html +=
            "<th class='text-center h-10 bg-blue-500'>Understanding</th><th class='text-center h-10 bg-blue-500'>%</th>";
          html +=
            "<th class='text-center h-10 bg-blue-500'>Applying</th><th class='text-center h-10 bg-blue-500'>%</th>";
          html +=
            "<th class='text-center h-10 bg-blue-500'>Analyse/Evaluate</th><th class='text-center h-10 bg-blue-500'>%</th>";
        }
      }

      // Close the row
      html += "</tr>";
    }

    // Close the table tag
    html += "</table>";

    // Insert the generated HTML into the gridView element
    gridView2.innerHTML = html;

    var table = gridView2.querySelector("table");
    var rows = table.getElementsByTagName("tr");

    for (var i = 1; i < rows.length; i++) {
      for (var j = 3; j < 3 + 4 * 2; j++) {
        (function (rowIndex, colIndex) {
          var newCell = document.createElement("td");
          newCell.className = "text-center h-10 border border-gray-300 ";

          if (j < 3 + 4 * 2) {
            newCell.addEventListener("input", function () {
              var enteredValue = parseInt(this.textContent.replace(/\D/g, ""));

              // Store the previous value in a data attribute
              var previousValue = this.getAttribute("data-previous-value");

              // console.log("Row:", rowIndex, "Column:", colIndex, "Value:", enteredValue);
              if (
                !isNaN(enteredValue) ||
                (previousValue && enteredValue === "")
              ) {
                // Update the data attribute with the new value
                var columnArray = inputValues.slice();

                if (columnArray.length === 4) {
                  var columnNumber = (colIndex - 3) / 2 + 1;

                  this.setAttribute("data-previous-value", enteredValue);

                  let storedValue = 0;

                  if (columnNumber === 1) {
                    storedValue = columnArray[0];
                  } else if (columnNumber === 2) {
                    storedValue = columnArray[1];
                  } else if (columnNumber === 3) {
                    storedValue = columnArray[2];
                  } else if (columnNumber === 4) {
                    storedValue = columnArray[3];
                  }

                  if (enteredValue > storedValue) {
                    showToast("Enter valid value", 5000);
                    this.textContent = "";
                    var percentageCellIndex = colIndex + 1;
                    var percentageCell =
                      rows[rowIndex].cells[percentageCellIndex];

                    if (percentageCell) {
                      percentageCell.textContent = "";
                    }
                    this.removeAttribute("data-previous-value");
                  } else {
                    var percentage = (enteredValue / storedValue) * 100;

                    if (!isNaN(percentage)) {
                      // Increment the count based on the percentage range

                      var existingIndex = percentageArray[
                        columnNumber - 1
                      ].findIndex(
                        (item) =>
                          item.rowIndex === rowIndex &&
                          item.colIndex === colIndex
                      );

                      if (existingIndex !== -1) {
                        // Replace the existing percentage value in the array
                        percentageArray[columnNumber - 1][
                          existingIndex
                        ].percentage = percentage;
                      } else {
                        // Push an object containing rowIndex, colIndex, and percentage
                        percentageArray[columnNumber - 1].push({
                          rowIndex: rowIndex,
                          colIndex: colIndex,
                          percentage: percentage,
                        });
                      }
                      trackCount();
                    }

                    var percentageCellIndex = colIndex + 1;
                    var percentageCell =
                      rows[rowIndex].cells[percentageCellIndex];
                    if (percentageCell) {
                      percentageCell.setAttribute("contenteditable", "false");
                    }
                    // console.log("Percentage : "+percentage);
                    if (percentageCell) {
                      percentageCell.textContent = percentage.toFixed(2) + "%";
                    }
                  }
                } else {
                  showToast("Please Enter data in 1st table", 5000);
                  this.textContent = "";
                }
              } else {
                // Clear both the value cell and the corresponding percentage cell
                this.textContent = "";
                var percentageCellIndex = colIndex + 1;
                var percentageCell = rows[rowIndex].cells[percentageCellIndex];
                if (percentageCell) {
                  percentageCell.textContent = "";
                }
              }
            });

            newCell.classList.add("text-center");
            newCell.setAttribute("contenteditable", "true");
          } else {
            newCell.setAttribute("contenteditable", "false");
          }

          rows[i].appendChild(newCell);
        })(i, j); // Pass current values of i and j to the IIFE
      }
    }
  };

  reader.readAsArrayBuffer(file);
}

function trackCount() {
  var counts = [
    [0, 0, 0, 0], // Counts for column 1: [0-40%, 41-60%, 61-80%, 81-100%]
    [0, 0, 0, 0], // Counts for column 2
    [0, 0, 0, 0], // Counts for column 3
    [0, 0, 0, 0], // Counts for column 4
  ];

  for (
    let columnIndex = 0;
    columnIndex < percentageArray.length;
    columnIndex++
  ) {
    let columnPercentages = percentageArray[columnIndex];

    // Iterate through the percentageArray for the current column
    for (let i = 0; i < columnPercentages.length; i++) {
      let percentage = columnPercentages[i].percentage;

      // Increment the count based on the percentage range
      if (percentage >= 0 && percentage <= 40) {
        counts[columnIndex][0]++; // Increment count for 0-40% range
      } else if (percentage >= 41 && percentage <= 60) {
        counts[columnIndex][1]++; // Increment count for 41-60% range
      } else if (percentage >= 61 && percentage <= 80) {
        counts[columnIndex][2]++; // Increment count for 61-80% range
      } else if (percentage >= 81 && percentage <= 100) {
        counts[columnIndex][3]++; // Increment count for 81-100% range
      }
    }
  }
  console.log("Count ", counts);
}

function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.textContent = message;
    toast.classList.remove("hidden");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, duration);
  }
}
