document.addEventListener("DOMContentLoaded", function () {
  // Sample data
  let tableData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      department: "IT",
      joinDate: "2020-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "234-567-8901",
      department: "HR",
      joinDate: "2019-05-22",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert@example.com",
      phone: "345-678-9012",
      department: "Finance",
      joinDate: "2021-03-10",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "456-789-0123",
      department: "Marketing",
      joinDate: "2018-11-05",
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael@example.com",
      phone: "567-890-1234",
      department: "Operations",
      joinDate: "2022-02-18",
    },
    {
      id: 6,
      name: "Sarah Brown",
      email: "sarah@example.com",
      phone: "678-901-2345",
      department: "IT",
      joinDate: "2020-07-30",
    },
    {
      id: 7,
      name: "David Taylor",
      email: "david@example.com",
      phone: "789-012-3456",
      department: "HR",
      joinDate: "2019-09-12",
    },
    {
      id: 8,
      name: "Jessica Anderson",
      email: "jessica@example.com",
      phone: "890-123-4567",
      department: "Finance",
      joinDate: "2021-01-25",
    },
    {
      id: 9,
      name: "Thomas Martinez",
      email: "thomas@example.com",
      phone: "901-234-5678",
      department: "Marketing",
      joinDate: "2018-04-17",
    },
    {
      id: 10,
      name: "Lisa Robinson",
      email: "lisa@example.com",
      phone: "012-345-6789",
      department: "Operations",
      joinDate: "2022-06-08",
    },
  ];

  // DOM elements
  const tableBody = document.getElementById("tableBody");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const addRowBtn = document.getElementById("addRowBtn");
  const dataModal = new bootstrap.Modal(document.getElementById("dataModal"));
  const saveDataBtn = document.getElementById("saveData");
  const dataForm = document.getElementById("dataForm");
  const pagination = document.getElementById("pagination");
  const dataTableInfo = document.getElementById("dataTableInfo");

  // Pagination variables
  let currentPage = 1;
  const rowsPerPage = 5;

  // Initialize the table
  function initTable() {
    renderTable();
    renderPagination();
    updateTableInfo();
  }

  // Render table rows
  function renderTable(data = tableData) {
    tableBody.innerHTML = "";

    // Calculate paginated data
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

    if (paginatedData.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML =
        '<td colspan="7" class="text-center">No data available</td>';
      tableBody.appendChild(tr);
      return;
    }

    paginatedData.forEach((item) => {
      const tr = document.createElement("tr");

      // For mobile view, we'll add data-label attributes
      tr.innerHTML = `
                <td data-label="ID">${item.id}</td>
                <td data-label="Name">${item.name}</td>
                <td data-label="Email">${item.email}</td>
                <td data-label="Phone">${item.phone}</td>
                <td data-label="Department">${item.department}</td>
                <td data-label="Join Date">${formatDate(item.joinDate)}</td>
                <td data-label="Actions">
                    <button class="btn btn-sm btn-warning edit-btn" data-id="${
                      item.id
                    }">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${
                      item.id
                    }">Delete</button>
                </td>
            `;

      tableBody.appendChild(tr);
    });

    // Add event listeners to edit and delete buttons
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", handleEdit);
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", handleDelete);
    });
  }

  // Format date for display
  function formatDate(dateString) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Render pagination
  function renderPagination(data = tableData) {
    pagination.innerHTML = "";
    const pageCount = Math.ceil(data.length / rowsPerPage);

    if (pageCount <= 1) return;

    // Previous button
    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prevLi.innerHTML = `<a class="page-link" href="#">Previous</a>`;
    prevLi.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        renderTable(data);
        renderPagination(data);
        updateTableInfo(data);
      }
    });
    pagination.appendChild(prevLi);

    // Page numbers
    for (let i = 1; i <= pageCount; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === currentPage ? "active" : ""}`;
      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      li.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = i;
        renderTable(data);
        renderPagination(data);
        updateTableInfo(data);
      });
      pagination.appendChild(li);
    }

    // Next button
    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${
      currentPage === pageCount ? "disabled" : ""
    }`;
    nextLi.innerHTML = `<a class="page-link" href="#">Next</a>`;
    nextLi.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage < pageCount) {
        currentPage++;
        renderTable(data);
        renderPagination(data);
        updateTableInfo(data);
      }
    });
    pagination.appendChild(nextLi);
  }

  // Update table info (showing X to Y of Z entries)
  function updateTableInfo(data = tableData) {
    const startIndex = (currentPage - 1) * rowsPerPage + 1;
    const endIndex = Math.min(currentPage * rowsPerPage, data.length);
    dataTableInfo.textContent = `Showing ${startIndex} to ${endIndex} of ${data.length} entries`;
  }

  // Handle search
  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    if (!searchTerm) {
      currentPage = 1;
      renderTable();
      renderPagination();
      updateTableInfo();
      return;
    }

    const filteredData = tableData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.email.toLowerCase().includes(searchTerm) ||
        item.phone.includes(searchTerm) ||
        item.department.toLowerCase().includes(searchTerm)
    );

    currentPage = 1;
    renderTable(filteredData);
    renderPagination(filteredData);
    updateTableInfo(filteredData);
  }

  // Handle edit
  function handleEdit(e) {
    const id = parseInt(e.target.getAttribute("data-id"));
    const record = tableData.find((item) => item.id === id);

    if (record) {
      document.getElementById("modalTitle").textContent = "Edit Record";
      document.getElementById("recordId").value = record.id;
      document.getElementById("name").value = record.name;
      document.getElementById("email").value = record.email;
      document.getElementById("phone").value = record.phone;
      document.getElementById("department").value = record.department;
      document.getElementById("joinDate").value = record.joinDate;

      dataModal.show();
    }
  }

  // Handle delete
  function handleDelete(e) {
    if (confirm("Are you sure you want to delete this record?")) {
      const id = parseInt(e.target.getAttribute("data-id"));
      tableData = tableData.filter((item) => item.id !== id);

      // Adjust current page if needed
      const pageCount = Math.ceil(tableData.length / rowsPerPage);
      if (currentPage > pageCount && pageCount > 0) {
        currentPage = pageCount;
      } else if (pageCount === 0) {
        currentPage = 1;
      }

      renderTable();
      renderPagination();
      updateTableInfo();
    }
  }

  // Handle add new row
  function handleAddNew() {
    document.getElementById("modalTitle").textContent = "Add New Record";
    dataForm.reset();
    document.getElementById("recordId").value = "";
    dataModal.show();
  }

  // Save data (add or update)
  function saveData() {
    const id = document.getElementById("recordId").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const department = document.getElementById("department").value;
    const joinDate = document.getElementById("joinDate").value;

    if (!name || !email || !joinDate) {
      alert("Please fill in all required fields");
      return;
    }

    if (id) {
      // Update existing record
      const index = tableData.findIndex((item) => item.id === parseInt(id));
      if (index !== -1) {
        tableData[index] = {
          id: parseInt(id),
          name,
          email,
          phone,
          department,
          joinDate,
        };
      }
    } else {
      // Add new record
      const newId =
        tableData.length > 0
          ? Math.max(...tableData.map((item) => item.id)) + 1
          : 1;
      tableData.push({
        id: newId,
        name,
        email,
        phone,
        department,
        joinDate,
      });

      // Go to last page to see the new record
      const pageCount = Math.ceil(tableData.length / rowsPerPage);
      currentPage = pageCount;
    }

    dataModal.hide();
    renderTable();
    renderPagination();
    updateTableInfo();
  }

  // Event listeners
  searchButton.addEventListener("click", handleSearch);
  searchInput.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  });
  addRowBtn.addEventListener("click", handleAddNew);
  saveDataBtn.addEventListener("click", saveData);

  // Initialize the table
  initTable();
});
