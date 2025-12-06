  
    document.addEventListener("DOMContentLoaded", function () {
      // Enhanced sample data
      let tableData = [
        { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890", department: "IT", joinDate: "2020-01-15" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "234-567-8901", department: "HR", joinDate: "2019-05-22" },
        { id: 3, name: "Robert Johnson", email: "robert@example.com", phone: "345-678-9012", department: "Finance", joinDate: "2021-03-10" },
        { id: 4, name: "Emily Davis", email: "emily@example.com", phone: "456-789-0123", department: "Marketing", joinDate: "2018-11-05" },
        { id: 5, name: "Michael Wilson", email: "michael@example.com", phone: "567-890-1234", department: "Operations", joinDate: "2022-02-18" },
        { id: 6, name: "Sarah Brown", email: "sarah@example.com", phone: "678-901-2345", department: "IT", joinDate: "2020-07-30" },
        { id: 7, name: "David Taylor", email: "david@example.com", phone: "789-012-3456", department: "HR", joinDate: "2019-09-12" },
        { id: 8, name: "Jessica Anderson", email: "jessica@example.com", phone: "890-123-4567", department: "Finance", joinDate: "2021-01-25" },
        { id: 9, name: "Thomas Martinez", email: "thomas@example.com", phone: "901-234-5678", department: "Marketing", joinDate: "2018-04-17" },
        { id: 10, name: "Lisa Robinson", email: "lisa@example.com", phone: "012-345-6789", department: "Operations", joinDate: "2022-06-08" },
        { id: 11, name: "James Wilson", email: "james@example.com", phone: "123-456-7891", department: "Frontend Developer", joinDate: "2021-08-14" },
        { id: 12, name: "Maria Garcia", email: "maria@example.com", phone: "234-567-8902", department: "Backend Developer", joinDate: "2020-03-22" },
        { id: 13, name: "William Lee", email: "william@example.com", phone: "345-678-9013", department: "MERN Stack", joinDate: "2023-01-10" },
        { id: 14, name: "Sophia Clark", email: "sophia@example.com", phone: "456-789-0124", department: "MEAN Stack", joinDate: "2022-09-05" }
      ];

      // DOM elements
      const tableBody = document.getElementById("tableBody");
      const searchInput = document.getElementById("searchInput");
      const searchInfo = document.getElementById("searchInfo");
      const addRowBtn = document.getElementById("addRowBtn");
      const dataModal = new bootstrap.Modal(document.getElementById("dataModal"));
      const saveDataBtn = document.getElementById("saveData");
      const dataForm = document.getElementById("dataForm");
      const pagination = document.getElementById("pagination");
      const paginationContainer = document.getElementById("paginationContainer");
      const dataTableInfo = document.getElementById("dataTableInfo");
      const noResults = document.getElementById("noResults");
      const toastContainer = document.querySelector('.toast-container');
      const searchLoading = document.querySelector('.search-loading');

      // Pagination variables
      let currentPage = 1;
      let rowsPerPage = window.innerWidth < 768 ? 3 : 5;
      let filteredData = [...tableData];
      let searchTimeout = null;
      let lastSearchTerm = '';

      // Initialize the table
      function initTable() {
        updateRowsPerPage();
        renderTable();
        renderPagination();
        updateTableInfo();
        updateSearchInfo();
      }

      // Update rows per page based on screen size
      function updateRowsPerPage() {
        if (window.innerWidth < 576) {
          rowsPerPage = 3;
        } else if (window.innerWidth < 768) {
          rowsPerPage = 4;
        } else {
          rowsPerPage = 5;
        }
      }

      // Highlight text in search results
      function highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
        return text.replace(regex, '<span class="highlight match-found">$1</span>');
      }

      // Escape special regex characters
      function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }

      // Render table rows with search highlighting
      function renderTable(data = filteredData) {
        tableBody.innerHTML = '';
        
        // Hide/show no results message
        if (data.length === 0) {
          tableBody.parentElement.style.display = 'none';
          noResults.style.display = 'block';
          paginationContainer.style.display = 'none';
          return;
        } else {
          tableBody.parentElement.style.display = 'block';
          noResults.style.display = 'none';
          paginationContainer.style.display = 'flex';
        }

        // Calculate paginated data
        const startIndex = (currentPage - 1) * rowsPerPage;
        const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);
        const searchTerm = searchInput.value.toLowerCase().trim();

        paginatedData.forEach((item) => {
          const tr = document.createElement("tr");
          
          // Create department badge
          const deptClass = item.department.replace(/\s+/g, '-');
          
          // Highlight matching text
          const highlightedName = searchTerm ? highlightText(item.name, searchTerm) : item.name;
          const highlightedEmail = searchTerm ? highlightText(item.email, searchTerm) : item.email;
          const highlightedPhone = searchTerm && item.phone ? highlightText(item.phone, searchTerm) : (item.phone || 'N/A');
          const highlightedDept = searchTerm ? highlightText(item.department, searchTerm) : item.department;
          
          tr.innerHTML = `
            <td data-label="ID"><span class="badge bg-light text-dark">${item.id}</span></td>
            <td data-label="Name">
              <div class="d-flex align-items-center">
                <div class="avatar-placeholder me-2 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;">
                  ${item.name.charAt(0)}
                </div>
                <div>${highlightedName}</div>
              </div>
            </td>
            <td data-label="Email">
              <a href="mailto:${item.email}" class="text-decoration-none">${highlightedEmail}</a>
            </td>
            <td data-label="Phone">${highlightedPhone}</td>
            <td data-label="Department">
              <span class="department-badge ${deptClass}">${highlightedDept}</span>
            </td>
            <td data-label="Join Date">
              <div class="d-flex flex-column">
                <span>${formatDate(item.joinDate)}</span>
                <small class="text-muted">${calculateTenure(item.joinDate)}</small>
              </div>
            </td>
            <td data-label="Actions">
              <div class="btn-group-actions">
                <button class="btn btn-sm btn-edit edit-btn" data-id="${item.id}" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-delete delete-btn" data-id="${item.id}" title="Delete">
                  <i class="fas fa-trash-alt"></i>
                </button>
                <button class="btn btn-sm btn-outline-primary view-btn" data-id="${item.id}" title="View Details">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </td>
          `;

          tableBody.appendChild(tr);
        });

        // Add event listeners
        document.querySelectorAll(".edit-btn").forEach((btn) => {
          btn.addEventListener("click", handleEdit);
        });

        document.querySelectorAll(".delete-btn").forEach((btn) => {
          btn.addEventListener("click", handleDelete);
        });

        document.querySelectorAll(".view-btn").forEach((btn) => {
          btn.addEventListener("click", handleView);
        });
      }

      // Format date for display
      function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      }

      // Calculate tenure
      function calculateTenure(joinDate) {
        const join = new Date(joinDate);
        const now = new Date();
        const years = now.getFullYear() - join.getFullYear();
        const months = now.getMonth() - join.getMonth();
        
        let tenure = '';
        if (years > 0) {
          tenure += `${years} year${years > 1 ? 's' : ''} `;
        }
        if (months > 0 || years === 0) {
          tenure += `${months} month${months !== 1 ? 's' : ''}`;
        }
        
        return tenure ? `${tenure} ago` : 'Recently joined';
      }

      // Render pagination
      function renderPagination(data = filteredData) {
        pagination.innerHTML = '';
        const pageCount = Math.ceil(data.length / rowsPerPage);

        if (pageCount <= 1) {
          pagination.innerHTML = '';
          return;
        }

        // Previous button
        const prevLi = document.createElement("li");
        prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
        prevLi.innerHTML = `
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        `;
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
        const maxVisiblePages = window.innerWidth < 768 ? 3 : 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // First page
        if (startPage > 1) {
          const firstLi = document.createElement("li");
          firstLi.className = "page-item";
          firstLi.innerHTML = `<a class="page-link" href="#">1</a>`;
          firstLi.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage = 1;
            renderTable(data);
            renderPagination(data);
            updateTableInfo(data);
          });
          pagination.appendChild(firstLi);
          
          if (startPage > 2) {
            const ellipsisLi = document.createElement("li");
            ellipsisLi.className = "page-item disabled";
            ellipsisLi.innerHTML = `<span class="page-link">...</span>`;
            pagination.appendChild(ellipsisLi);
          }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
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

        // Last page
        if (endPage < pageCount) {
          if (endPage < pageCount - 1) {
            const ellipsisLi = document.createElement("li");
            ellipsisLi.className = "page-item disabled";
            ellipsisLi.innerHTML = `<span class="page-link">...</span>`;
            pagination.appendChild(ellipsisLi);
          }
          
          const lastLi = document.createElement("li");
          lastLi.className = "page-item";
          lastLi.innerHTML = `<a class="page-link" href="#">${pageCount}</a>`;
          lastLi.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage = pageCount;
            renderTable(data);
            renderPagination(data);
            updateTableInfo(data);
          });
          pagination.appendChild(lastLi);
        }

        // Next button
        const nextLi = document.createElement("li");
        nextLi.className = `page-item ${currentPage === pageCount ? "disabled" : ""}`;
        nextLi.innerHTML = `
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        `;
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

      // Update table info
      function updateTableInfo(data = filteredData) {
        const startIndex = data.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
        const endIndex = Math.min(currentPage * rowsPerPage, data.length);
        dataTableInfo.textContent = `Showing ${startIndex} to ${endIndex} of ${data.length} entries`;
        
        // Add filter info if search is active
        const searchTerm = searchInput.value.trim();
        if (searchTerm && data.length < tableData.length) {
          dataTableInfo.innerHTML += ` <span class="text-primary">(filtered from ${tableData.length} total entries)</span>`;
        }
      }

      // Update search info
      function updateSearchInfo() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
          searchInfo.innerHTML = `
            Found <span class="search-match-count">${filteredData.length}</span> matching records
            <button class="btn btn-sm btn-outline-secondary ms-2" id="clearSearch">
              <i class="fas fa-times me-1"></i> Clear
            </button>
          `;
          
          // Add clear search button event
          document.getElementById('clearSearch')?.addEventListener('click', clearSearchHandler);
        } else {
          searchInfo.textContent = 'Start typing to search employees by name, email, phone, or department';
        }
      }

      // Show toast notification
      function showToast(message, type = 'info') {
        const toastId = 'toast-' + Date.now();
        const toast = document.createElement('div');
        toast.className = `toast align-items-center border-0 ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
        toast.setAttribute('id', toastId);
        toast.innerHTML = `
          <div class="d-flex">
            <div class="toast-body">
              <i class="fas ${type === 'success' ? 'fa-check-circle text-success' : type === 'error' ? 'fa-exclamation-circle text-danger' : 'fa-info-circle text-primary'} me-2"></i>
              ${message}
            </div>
            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
          </div>
        `;
        
        toastContainer.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
        bsToast.show();
        
        toast.addEventListener('hidden.bs.toast', function () {
          toast.remove();
        });
      }

      // Live search function - triggered as user types
      function performLiveSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // Show loading indicator
        searchLoading.classList.add('active');
        
        // Clear previous timeout
        if (searchTimeout) {
          clearTimeout(searchTimeout);
        }
        
        // Set new timeout for search (debouncing)
        searchTimeout = setTimeout(() => {
          if (searchTerm === lastSearchTerm && searchTerm !== '') {
            searchLoading.classList.remove('active');
            return;
          }
          
          lastSearchTerm = searchTerm;
          
          if (!searchTerm) {
            filteredData = [...tableData];
          } else {
            filteredData = tableData.filter(
              (item) =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.email.toLowerCase().includes(searchTerm) ||
                (item.phone && item.phone.includes(searchTerm)) ||
                item.department.toLowerCase().includes(searchTerm)
            );
          }
          
          currentPage = 1;
          renderTable(filteredData);
          renderPagination(filteredData);
          updateTableInfo(filteredData);
          updateSearchInfo();
          
          // Remove loading indicator
          searchLoading.classList.remove('active');
          
          // Show notification if no results
          if (searchTerm && filteredData.length === 0) {
            showToast('No matching records found', 'error');
          }
        }, 300); // 300ms delay for smoother typing experience
      }

      // Clear search
      function clearSearchHandler() {
        searchInput.value = '';
        searchInput.focus();
        filteredData = [...tableData];
        currentPage = 1;
        renderTable();
        renderPagination();
        updateTableInfo();
        updateSearchInfo();
        showToast('Search cleared', 'info');
      }

      // Handle edit
      function handleEdit(e) {
        const id = parseInt(e.currentTarget.getAttribute("data-id"));
        const record = tableData.find((item) => item.id === id);

        if (record) {
          document.getElementById("modalTitle").innerHTML = `<i class="fas fa-user-edit me-2"></i>Edit Employee`;
          document.getElementById("recordId").value = record.id;
          document.getElementById("name").value = record.name;
          document.getElementById("email").value = record.email;
          document.getElementById("phone").value = record.phone;
          document.getElementById("department").value = record.department;
          document.getElementById("joinDate").value = record.joinDate;

          // Clear validation states
          document.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
          });

          dataModal.show();
        }
      }

      // Handle view
      function handleView(e) {
        const id = parseInt(e.currentTarget.getAttribute("data-id"));
        const record = tableData.find((item) => item.id === id);
        
        if (record) {
          const message = `
            <strong>${record.name}</strong><br>
            <strong>Email:</strong> ${record.email}<br>
            <strong>Phone:</strong> ${record.phone || 'N/A'}<br>
            <strong>Department:</strong> ${record.department}<br>
            <strong>Joined:</strong> ${formatDate(record.joinDate)} (${calculateTenure(record.joinDate)})<br>
            <strong>Employee ID:</strong> ${record.id}
          `;
          
          alert(message);
        }
      }

      // Handle delete
      function handleDelete(e) {
        const id = parseInt(e.currentTarget.getAttribute("data-id"));
        const record = tableData.find((item) => item.id === id);
        
        if (record && confirm(`Are you sure you want to delete ${record.name}? This action cannot be undone.`)) {
          tableData = tableData.filter((item) => item.id !== id);
          filteredData = filteredData.filter((item) => item.id !== id);

          // Adjust current page if needed
          const pageCount = Math.ceil(filteredData.length / rowsPerPage);
          if (currentPage > pageCount && pageCount > 0) {
            currentPage = pageCount;
          } else if (pageCount === 0) {
            currentPage = 1;
          }

          renderTable();
          renderPagination();
          updateTableInfo();
          updateSearchInfo();
          showToast(`Employee ${record.name} deleted successfully`, 'success');
        }
      }

      // Handle add new row
      function handleAddNew() {
        document.getElementById("modalTitle").innerHTML = `<i class="fas fa-user-plus me-2"></i>Add New Employee`;
        dataForm.reset();
        document.getElementById("recordId").value = "";
        document.getElementById("joinDate").valueAsDate = new Date();
        
        // Clear validation states
        document.querySelectorAll('.is-invalid').forEach(el => {
          el.classList.remove('is-invalid');
        });
        
        dataModal.show();
      }

      // Validate form
      function validateForm() {
        let isValid = true;
        
        // Name validation
        const name = document.getElementById("name");
        if (!name.value.trim()) {
          name.classList.add('is-invalid');
          isValid = false;
        } else {
          name.classList.remove('is-invalid');
        }
        
        // Email validation
        const email = document.getElementById("email");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value)) {
          email.classList.add('is-invalid');
          isValid = false;
        } else {
          email.classList.remove('is-invalid');
        }
        
        // Department validation
        const department = document.getElementById("department");
        if (!department.value) {
          department.classList.add('is-invalid');
          isValid = false;
        } else {
          department.classList.remove('is-invalid');
        }
        
        // Date validation
        const joinDate = document.getElementById("joinDate");
        if (!joinDate.value) {
          joinDate.classList.add('is-invalid');
          isValid = false;
        } else {
          joinDate.classList.remove('is-invalid');
        }
        
        return isValid;
      }

      // Save data (add or update)
      function saveData() {
        if (!validateForm()) {
          showToast('Please fill in all required fields correctly', 'error');
          return;
        }

        const id = document.getElementById("recordId").value;
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const department = document.getElementById("department").value;
        const joinDate = document.getElementById("joinDate").value;

        // Check for duplicate email
        const duplicateEmail = tableData.find(item => 
          item.email.toLowerCase() === email.toLowerCase() && 
          (!id || item.id !== parseInt(id))
        );
        
        if (duplicateEmail) {
          document.getElementById("email").classList.add('is-invalid');
          showToast('This email is already registered', 'error');
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
            showToast(`Employee ${name} updated successfully`, 'success');
          }
        } else {
          // Add new record
          const newId = tableData.length > 0
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
          showToast(`Employee ${name} added successfully`, 'success');
          
          // Go to last page to see the new record
          const pageCount = Math.ceil(tableData.length / rowsPerPage);
          currentPage = pageCount;
        }

        // Update filtered data if search is active
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
          performLiveSearch();
        } else {
          filteredData = [...tableData];
          renderTable();
          renderPagination();
          updateTableInfo();
          updateSearchInfo();
        }

        dataModal.hide();
      }

      // Event listeners
      searchInput.addEventListener("input", performLiveSearch);
      searchInput.addEventListener("keydown", function(e) {
        if (e.key === 'Escape') {
          clearSearchHandler();
        }
      });
      searchInput.addEventListener("focus", function() {
        this.select();
      });
      addRowBtn.addEventListener("click", handleAddNew);
      saveDataBtn.addEventListener("click", saveData);

      // Window resize handler
      let resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          updateRowsPerPage();
          currentPage = 1;
          renderTable();
          renderPagination();
          updateTableInfo();
          updateSearchInfo();
        }, 250);
      });

      // Initialize the table
      initTable();
    });
  