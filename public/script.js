document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                // Redirect to home.html if login is successful
                window.location.href = "/home.html";
            } else {
                const data = await response.json();
                console.alert("Login failed:", data.message);
                // Show error message to the user
            }
        } catch (error) {
            console.error("Error:", error.message);
            // Handle network errors or other exceptions
        }
    });
});

// Connect to the Socket.IO server
const socket = io('http://localhost:3002');

// Function to create and append a new data entry
function appendDataEntry(data) {
    const licenseNo = data.licenseNo;
    const entryTime = data.entryTime;
    const exitTime = data.exitTime;

    const activityData = document.createElement('div');
    activityData.classList.add('activity-data');

    // License number
    const licenseNoDiv = document.createElement('div');
    licenseNoDiv.classList.add('number');
    licenseNoDiv.innerHTML = `
        <div class="time-title">License No:</div>
        <div class="time-value">${licenseNo}</div>
    `;
    activityData.appendChild(licenseNoDiv);

    // Entry time
    const entryTimeDiv = document.createElement('div');
    entryTimeDiv.classList.add('time-entry');
    entryTimeDiv.innerHTML = ` 
        <div class="time-title">Entry Time:</div>
        <div class="time-value">${entryTime}</div>
    `;
    activityData.appendChild(entryTimeDiv);

    // Exit time
    const exitTimeDiv = document.createElement('div');
    exitTimeDiv.classList.add('time-exit');
    exitTimeDiv.innerHTML = `
        <div class="time-title">Exit Time:</div>
        <div class="time-value">${exitTime}</div>
    `;
    activityData.appendChild(exitTimeDiv);

    // Payment slip button
    
    const paymentSlipDiv = document.createElement('div');
    paymentSlipDiv.classList.add('payment-slip');
    const downloadButton = document.createElement('button');
    downloadButton.classList.add('download-payment-slip');
    downloadButton.innerText = 'Download Payment Slip';
    paymentSlipDiv.appendChild(downloadButton);
    activityData.appendChild(paymentSlipDiv);
    document.getElementById('dataEntries').appendChild(activityData);

// Attach event listener to the download button
downloadButton.addEventListener('click', function() {
    // Parse entry and exit times
    const entryTimeParts = entryTime.split(':').map(Number);
    const exitTimeParts = exitTime.split(':').map(Number);

    // Create Date objects for entry and exit times
    const entryDate = new Date(0, 0, 0, entryTimeParts[0], entryTimeParts[1], entryTimeParts[2]);
    const exitDate = new Date(0, 0, 0, exitTimeParts[0], exitTimeParts[1], exitTimeParts[2]);

    // Calculate duration in milliseconds
    const durationInMillis = exitDate - entryDate;

    // Convert duration to minutes
    const durationInMinutes = durationInMillis / (1000 * 60);

    // Cost per minute (assuming 1 rupees per minute)
    const costPerMinute = 1;

    // Calculate total cost
    const totalCost = durationInMinutes * costPerMinute;

    // Generate PDF
    const doc = new jsPDF();
    doc.text('Payment Slip', 10, 10);
    doc.text(`License No: ${licenseNo}`, 10, 20);
    doc.text(`Entry Time: ${entryTime}`, 10, 30);
    doc.text(`Exit Time: ${exitTime}`, 10, 40);
    doc.text(`Duration (minutes): ${durationInMinutes}`, 10, 50);
    doc.text(`Cost Per Minute: Rs. ${costPerMinute}`, 10, 60);
    doc.text(`Total Cost: Rs. ${totalCost}`, 10, 70);

    // Save PDF
    doc.save(`payment_slip_${licenseNo}.pdf`);
});

}
socket.on('reload',(data) => {
    console.log(data);
    location.reload(true);
});


socket.on('entryExitTimeUpdate', (data) => {
    appendDataEntry(data);
});
// Listen for the 'vehicleCountUpdate' event
socket.on('vehicleCountUpdate', (count) => {
    // Update the content of the span element with the id 'totalVehicles'
    document.getElementById('totalVehicles').innerText = count;
    const totalSpace = 50;
    const availableSpace = totalSpace - count;
    document.getElementById('availableSpace').innerText = availableSpace;
});

document.addEventListener("DOMContentLoaded", function() {
    const body = document.querySelector("body"),
          modeToggle = document.querySelector(".mode-toggle"),
          sidebar = document.querySelector("nav"),
          sidebarToggle = document.querySelector(".sidebar-toggle");

    let getMode = localStorage.getItem("mode");
    if (getMode === "dark") {
        body.classList.add("dark");
    }

    let getStatus = localStorage.getItem("status");
    if (getStatus === "close") {
        sidebar.classList.add("close");
    }

    modeToggle.addEventListener("click", () => {
        body.classList.toggle("dark");
        const newMode = body.classList.contains("dark") ? "dark" : "light";
        localStorage.setItem("mode", newMode);
    });

    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
        const newStatus = sidebar.classList.contains("close") ? "close" : "open";
        localStorage.setItem("status", newStatus);
    });
});
