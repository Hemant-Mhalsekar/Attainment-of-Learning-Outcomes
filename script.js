var refreshCount = 0;
let totalMarks; // Variable to store the total marks from the first form

var percentageArray = Array.from({ length: 4 }, () => []);
var tableDataArray = Array.from({ length: 4 }, () => []);

let inputValues = [];
let myCharts = [];
let myChart = null;

// Function to display form data
function displayFormData() {
  // Validation
  var courseName = document.getElementById("courseName").value;
  var category = document.getElementById("category").value;
  var courseTeacher = document.getElementById("courseTeacher").value;
  var className = document.getElementById("className").value;
  var totalStudents = document.getElementById("totalStudents").value;
  var targetPercentage = document.getElementById("targetPercentage").value;

  if (
    courseName === "" ||
    category === "" ||
    courseTeacher === "" ||
    className === "" ||
    totalStudents === "" ||
    targetPercentage === ""
  ) {
    showToast("Please fill in all the required fields", 5000);
    return;
  }

  let formDataDisplay = document.getElementById("formDataDisplay");
  if (formDataDisplay) {
    // Clear existing form data display
    formDataDisplay.innerHTML = "";

    // Get input values directly and display them
    formDataDisplay.innerHTML += `
      <div class="mb-4 p-4 bg-white rounded-lg">
        <h2 style="font-weight: bold; color: #007bff; font-size: 26px; ;text-decoration: underline; ">Course Information</h2>
        <p class="mb-2"><span class="font-bold">Name of Course:</span> ${
          document.getElementById("courseName").value
        }</p>
        <p class="mb-2"><span class="font-bold">Name of category:</span> ${
          document.getElementById("category").value
        }</p>
        <p class="mb-2"><span class="font-bold">Name of the Course Teacher:</span> ${
          document.getElementById("courseTeacher").value
        }</p>
        <p class="mb-2"><span class="font-bold">Name of the class:</span> ${
          document.getElementById("className").value
        }</p>
        <p class="mb-2"><span class="font-bold">Number of Students:</span> ${
          document.getElementById("totalStudents").value
        }</p>
        <p class="mb-2"><span class="font-bold">Total Marks:</span> ${
          document.getElementById("targetPercentage").value
        }</p>
      </div>`;

    // Show the form data display
    formDataDisplay.style.display = "block";
  }
  document.getElementById("div2").classList.remove("hidden");
}

function toggleInput(cellId, percentageId, isChecked) {
  const cellInput = document.getElementById(cellId);
  const percentageInput = document.getElementById(percentageId);

  if (isChecked) {
    cellInput.removeAttribute("disabled");
    percentageInput.removeAttribute("disabled");
  } else {
    cellInput.setAttribute("disabled", true);
    percentageInput.setAttribute("disabled", true);
  }
}

function SubmitForm2(event) {
  event.preventDefault();

  // Get input values
  let cell1Value = parseInt(document.getElementById("cell1").value, 10);
  let cell2Value = parseInt(document.getElementById("cell2").value, 10);
  let cell3Value = parseInt(document.getElementById("cell3").value, 10);
  let cell4Value = parseInt(document.getElementById("cell4").value, 10);

  inputValues = [cell1Value, cell2Value, cell3Value, cell4Value];

  // Calculate the total marks from the first form
  let totalMarks = parseInt(
    document.getElementById("targetPercentage").value,
    10
  );

  // Calculate the sum of marks entered in the second form
  let sumOfMarks = cell1Value + cell2Value + cell3Value + cell4Value;

  // Validate that the sum of marks does not exceed the total marks
  if (sumOfMarks > totalMarks) {
    // Display an error message or take appropriate action
    showToast("Sum of marks cannot exceed total marks", 5000);
  } else {
    // Calculate percentages and update the corresponding cells
    updatePercentageCell("cell1", "percentage1", cell1Value, totalMarks);
    updatePercentageCell("cell2", "percentage2", cell2Value, totalMarks);
    updatePercentageCell("cell3", "percentage3", cell3Value, totalMarks);
    updatePercentageCell("cell4", "percentage4", cell4Value, totalMarks);

    // Continue with processing the form data

    // Display object of input values (for demonstration purposes)
    console.log("Input Values:", inputValues);
    document.getElementById("ExcelInput").classList.remove("hidden");
  }
}

function updatePercentageCell(cellId, percentageId, marks, totalMarks) {
  let marksCell = document.getElementById(cellId);
  let percentageCell = document.getElementById(percentageId);

  if (marksCell && percentageCell) {
    let enteredValue = parseInt(marksCell.value, 10);
    let percentage = (enteredValue / totalMarks) * 100;

    // Display the percentage in the corresponding cell
    percentageCell.value = isNaN(percentage) ? "" : percentage.toFixed(2) + "%";
  }
}

function handleFileUpload() {
  document.getElementById("gridView2").classList.remove("hidden");
  var fileInput = document.getElementById("fileInput");
  var gridView2 = document.getElementById("gridView2");

  tableDataArray = Array.from({ length: 4 }, () => []);

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

    // Assuming you have checkbox IDs for Remembering, Understanding, Applying, Analyze/Evaluate
var rememberingCheckbox = document.getElementById('rememberingCheckbox');
var understandingCheckbox = document.getElementById('understandingCheckbox');
var applyingCheckbox = document.getElementById('applyingCheckbox');
var analysingCheckbox = document.getElementById('analysingCheckbox');

// Initialize the HTML string for the table
var html = "<table class='w-full'>";

// Loop through the rows of JSON data
for (var i = 0; i < jsonData.length; i++) {
  html += "<tr>";

  // Loop through the columns of the current row
  for (var j = 0; j < jsonData[i].length; j++) {
    // If it's the first row, create header cells
    if (i === 0) {
      if (j < 3) {
        html +=
          "<th class='text-center h-10 bg-blue-500'>" +
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
      // Add columns based on checkbox status
      if (rememberingCheckbox.checked) {
        html += "<th class='text-center h-10 bg-blue-500'>Remembering</th><th class='text-center h-10 bg-blue-500'>%</th>";
      }

      if (understandingCheckbox.checked) {
        html += "<th class='text-center h-10 bg-blue-500'>Understanding</th><th class='text-center h-10 bg-blue-500'>%</th>";
      }

      if (applyingCheckbox.checked) {
        html += "<th class='text-center h-10 bg-blue-500'>Applying</th><th class='text-center h-10 bg-blue-500'>%</th>";
      }

      if (analysingCheckbox.checked) {
        html += "<th class='text-center h-10 bg-blue-500'>Analyse/Evaluate</th><th class='text-center h-10 bg-blue-500'>%</th>";
      }

      html += "<th class='text-center h-10 bg-blue-500'>Total</th>";
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
      for (var j = 3; j < 3 + 4 * 2 + 1; j++) {
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

                      trackPercentage(
                        colIndex,
                        rowIndex,
                        percentage,
                        columnNumber
                      );
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

//Function to store all percentage in array
function trackPercentage(colIndex, rowIndex, percentage, columnNumber) {
  var existingIndex = percentageArray[columnNumber - 1].findIndex(
    (item) => item.rowIndex === rowIndex && item.colIndex === colIndex
  );

  if (existingIndex !== -1) {
    // Replace the existing percentage value in the array
    percentageArray[columnNumber - 1][existingIndex].percentage = percentage;
  } else {
    // Push an object containing rowIndex, colIndex, and percentage
    percentageArray[columnNumber - 1].push({
      rowIndex: rowIndex,
      colIndex: colIndex,
      percentage: percentage,
    });
  }
}

//Function to store all entered values  in array
function calculateTotal(colIndex, rowIndex, enteredValue, columnNumber) {
  var existingIndex = tableDataArray[columnNumber - 1].findIndex(
    (item) => item.rowIndex === rowIndex && item.colIndex === colIndex
  );

  if (existingIndex !== -1) {
    // Replace the existing percentage value in the array
    tableDataArray[columnNumber - 1][existingIndex].enteredValue = enteredValue;
  } else {
    // Push an object containing rowIndex, colIndex, and percentage
    tableDataArray[columnNumber - 1].push({
      rowIndex: rowIndex,
      colIndex: colIndex,
      enteredValue: enteredValue,
    });
  }
  calculateRowSum();
  console.log(tableDataArray);
}

//this function will calculate row wise sum
function calculateRowSum() {
  const rowSums = Array(tableDataArray.length).fill(0);

  tableDataArray.forEach((columnData) => {
    columnData.forEach((item) => {
      const rowIndex = item.rowIndex - 1; // Adjusting to 0-based index
      rowSums[rowIndex] += parseFloat(item.enteredValue) || 0; // Ensure enteredValue is parsed as a number
    });
  });

  rowSums.forEach((sum, index) => {
    console.log(`Row ${index + 1} Sum:`, sum);
    // You can store the row sum in another array or use it as needed
  });
  displayRowSums(rowSums);
}

function displayRowSums(rowSums) {
  var table = gridView2.querySelector("table");
  var rows = table.getElementsByTagName("tr");

  // Check if the number of rows in the table matches the row sums
  if (rowSums.length === rows.length - 1) {
    for (var i = 1; i < rows.length; i++) {
      var lastCellIndex = rows[i].cells.length - 1; // Get the index of the last cell
      var sumCell = rows[i].cells[lastCellIndex]; // Get the existing last cell

      if (sumCell) {
        sumCell.textContent = rowSums[i - 1]; // Update the content with the sum for this row
        sumCell.className = "text-center h-10 border border-gray-300";
      } else {
        console.error("Last cell not found in row " + i);
      }
    }
  } else {
    console.error("Row count mismatch between table and calculated row sums");
  }
}

//Function to keep track of students between [0-40%, 41-60%, 61-80%, 81-100%]
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
  // console.log("Count ", counts);
  generatePieCharts(counts);

  const columnAverages = calculateColumnWiseAverage();
  console.log("Column-wise averages:", columnAverages);
}

function calculateColumnWiseAverage() {
  const columnAverages = [];

  for (
    let columnIndex = 0;
    columnIndex < percentageArray.length;
    columnIndex++
  ) {
    const columnPercentages = percentageArray[columnIndex];
    let sum = 0;

    // Calculate sum of percentages for the current column
    columnPercentages.forEach((item) => {
      sum += item.percentage;
    });

    // Calculate average for the current column
    const columnAverage =
      columnPercentages.length > 0 ? sum / columnPercentages.length : 0;

    // Push the average for the current column into the array
    columnAverages.push(columnAverage);
  }
  generateBarGraph(columnAverages);
}

//function to generate pie chart
function generatePieCharts(counts) {
  document.getElementById("piechart").classList.remove("hidden");
  myCharts.forEach((chart) => chart.destroy());
  myCharts = [];

  // Create pie charts for each column
  for (let i = 0; i < counts.length; i++) {
    const canvasId = `column${i + 1}Chart`;
    const ctx = document.getElementById(canvasId).getContext("2d");

    const newChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["0-40%", "41-60%", "61-80%", "81-100%"],
        datasets: [
          {
            data: counts[i],
            backgroundColor: [
              "rgba(255, 99, 132, 0.8)",
              "rgba(54, 162, 235, 0.8)",
              "rgba(255, 206, 86, 0.8)",
              "rgba(75, 192, 192, 0.8)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: false,
        title: {
          display: true,
          text: `Column ${i + 1} Chart`,
        },
      },
    });
    myCharts.push(newChart);
  }
}

function generateBarGraph(columnAverages) {
  const canvas = document.getElementById("barGraph");

  // Remove inline styles from the canvas element
  canvas.removeAttribute("style");

  // Set the width and height of the canvas element
  canvas.style.width = 500;
  canvas.style.height = 200;

  // Destroy previous chart instance if it exists
  if (myChart) {
    myChart.destroy();
  }

  const ctx = canvas.getContext("2d");

  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Remembering",
        "Understanding",
        "Application",
        "Analyse/Evaluate",
      ],
      datasets: [
        {
          label: "Percentage Average",
          data: columnAverages,
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Percentage Average",
          },
        },
      },
    },
  });
}

//Display Toast message
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

///Print code
// Disable page reload
window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  e.returnValue = "Are you sure you want to leave this page?";
});

//new
// Function to show the "Print Page" button
function showPrintButton() {
  const printButton = document.getElementById("printButton");
  printButton.removeAttribute("hidden");
}

// Attach the printPage function to the print button
document.getElementById("printButton").addEventListener("click", printPage);
