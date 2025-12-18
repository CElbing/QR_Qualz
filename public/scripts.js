let curHash = "";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("quals_container");
  const editedRows = {};
  let data = []; // store original data

  fetch("quals.json")
    .then((res) => res.json())
    .then((json) => {
      data = json.quals.map((row, index) => {
        // Generate a unique ID for each row
        row.id = `${row["First Name"]} ${row["Last Name"]}`
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\-]/g, "");
        return row;
      });
      populateDiv(data);

      // Gathering the necessary elements
      const targetId = window.location.hash.substring(1); // current hash in url w/o '#'
      const targetEl = document.getElementById(targetId); // gets the div container
      const details = targetEl.querySelector("details"); // finds <details> in container
      

      //update the current hash, used to toggle 'open' on QR scan
      curHash = targetId;

      if (window.location.hash) {
        if (targetEl) {
          // use setTimeout to ensure browser has rendered
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: "smooth" });
            details.open = true; // Show content on QR scan
          }, 1000);
        }
      }
    })
    .catch((err) => console.error("Error fetching project data:", err));

  // Function fills each container with the qualifications and QR code
  function populateDiv(data) {
    data.forEach((element, index) => {
      const newDiv = document.createElement("div");
      // newDiv is the container
      newDiv.classList.add("qual", "p20", "m20-top");
      newDiv.id = element.id;

      // Gets the full name to display in newDiv
      const fullName = document.createElement("h2");
      fullName.textContent = `${element["First Name"]} ${element["Last Name"]}`;
      fullName.contentEditable = true;
      fullName.dataset.key = "Full Name";
      fullName.dataset.index = index;
      newDiv.appendChild(fullName);

      // Removes unnecessary spaces from the name input by an editor
      fullName.addEventListener("input", () => {
        editedRows[index] = editedRows[index] || {};
        editedRows[index]["Full Name"] = fullName.textContent.trim();
      });

      // Section with the qualifications
      const detailSection = document.createElement("details");
      detailSection.classList.add("smooth");
      newDiv.appendChild(detailSection);

      // Summary that when clicked expands the qualifications
      const summarySection = document.createElement("summary");
      summarySection.textContent = "Toggle Content";
      detailSection.classList.add(
        "primary-font-400",
        "m20-top",
        "button-primary",
        "font-14"
      );
      detailSection.appendChild(summarySection);

      // Generate QR code link pointing to Apache server
      const IP = "192.168.1.50"; // IP of my RaspberryPi
      //const basePath = "/QRQualz/public/index.html"; // path to index.html (not needed anymore)
      //const link = `http://${IP}${basePath}#${newDiv.id}`; //create the link based on the IP, basePath, and the id of the div

      const link = `http://${IP}#${newDiv.id}`; //create the link based on the IP, basePath, and the id of the div

      // QR code image
      const qrImg = document.createElement("img");
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        link
      )}`; // Generates the QR code to link to an employee
      qrImg.alt = `QR code for ${element["First Name"]} ${element["Last Name"]}`;
      qrImg.classList.add("m20-top");
      qrImg.classList.add("qr-code"); // optional styling
      detailSection.appendChild(qrImg);

      // Loops through all the qualifications to be pulled onto the page
      Object.entries(element).forEach(([key, value]) => {
        // Skip the these elements
        if (key === "First Name" || key === "Last Name" || key === "id") return;

        const p = document.createElement("p");
        p.dataset.key = key;
        p.dataset.index = index;

        const label = document.createElement("span");
        label.textContent = key + ": ";
        label.style.fontWeight = "bold";

        const valueSpan = document.createElement("span");
        valueSpan.textContent = value;
        valueSpan.contentEditable = true;

        valueSpan.addEventListener("input", () => {
          editedRows[index] = editedRows[index] || {};
          editedRows[index][key] = valueSpan.textContent.trim();
        });

        p.appendChild(label);
        p.appendChild(valueSpan);
        detailSection.appendChild(p);
      });

      container.appendChild(newDiv);
    });
  }

  // Save changes
  document.getElementById("saveChanges").addEventListener("click", () => {
    const updatedData = [];

    // Loops through all edited rows
    Object.entries(editedRows).forEach(([index, edits]) => {
      const originalRow = data[index];
      const merged = { ...originalRow, ...edits };

      // Handle Full Name split
      if (merged["Full Name"]) {
        const parts = merged["Full Name"].split(" ");
        merged["First Name"] = parts[0] || "";
        merged["Last Name"] = parts.slice(1).join(" ") || "";
        delete merged["Full Name"];
      }

      updatedData.push(merged);
    });

    if (updatedData.length === 0) {
      alert("No changes to save!");
      return;
    }

    // Send the changed data to save-json.php to make changes to the JSON file
    fetch("save-json.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quals: editedRows }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  });
});

window.addEventListener("hashchange", () => {
  if (curHash) {
    const prevID = curHash
    const prevEl = document.getElementById(prevID);
    const details = prevEl.querySelector('details');

    details.open = false;
  }

  const targetId = window.location.hash.substring(1);
  const targetEl = document.getElementById(targetId);
  const details = targetEl.querySelector("details");

  if (targetEl) {
    targetEl.scrollIntoView({ behavior: "smooth" });

    details.open = true;
  }
  curHash = targetId;
});
