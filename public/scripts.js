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

      if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          // use setTimeout to ensure browser has rendered
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: "smooth" });
          }, 50); // 50ms is usually enough
        }
      }
      if (targetEl) {
        setTimeout(() => {
          const offset = -100; // pixels above the element
          const elementPosition =
            targetEl.getBoundingClientRect().top + window.pageYOffset;
          const scrollPosition = elementPosition - offset;

          window.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
          });

          // Optional: highlight the element
          targetEl.style.transition = "background-color 1s";
          targetEl.style.backgroundColor = "#ffff99";
          setTimeout(() => (targetEl.style.backgroundColor = ""), 2000);
        }, 50);
      }
    })
    .catch((err) => console.error("Error fetching project data:", err));

  function populateDiv(data) {
    data.forEach((element, index) => {
      const newDiv = document.createElement("div");
      newDiv.classList.add("qual", "p20", "m20-top");
      newDiv.id = element.id;

      // Full Name field
      const fullName = document.createElement("h2");
      fullName.textContent = `${element["First Name"]} ${element["Last Name"]}`;
      fullName.contentEditable = true;
      fullName.dataset.key = "Full Name";
      fullName.dataset.index = index;
      newDiv.appendChild(fullName);

      fullName.addEventListener("input", () => {
        editedRows[index] = editedRows[index] || {};
        editedRows[index]["Full Name"] = fullName.textContent.trim();
      });

      // Generate QR code link pointing to local network IP
      //const localIP = "your computer's IP";
      const basePath = "/QRQualz/public/"; // path to project
      const link = `http://${localIP}${basePath}#${newDiv.id}`;

      // QR code image
      const qrImg = document.createElement("img");
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        link
      )}`;
      qrImg.alt = `QR code for ${element["First Name"]} ${element["Last Name"]}`;
      qrImg.classList.add("qr-code"); // optional styling
      newDiv.appendChild(qrImg);

      newDiv.appendChild(qrImg);

      // Other fields
      Object.entries(element).forEach(([key, value]) => {
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
        newDiv.appendChild(p);
      });

      container.appendChild(newDiv);
    });
  }

  // Save changes
  document.getElementById("saveChanges").addEventListener("click", () => {
    const updatedData = [];

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
