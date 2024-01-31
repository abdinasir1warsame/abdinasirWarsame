var locations = [];

$('#searchInp').on('keyup', function () {
  // your code
});

$('#refreshBtn').click(function () {
  if ($('#personnelBtn').hasClass('active')) {
    // Refresh personnel table
  } else {
    if ($('#departmentsBtn').hasClass('active')) {
      // Refresh department table
    } else {
      // Refresh location table
    }
  }
});

$('#filterBtn').click(function () {
  // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
});

$('#addBtn').click(function () {
  // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
});

$('#personnelBtn').click(function () {
  // Call function to refresh personnel table
  $.ajax({
    url: './libs/php/getAll.php', // Replace with the actual URL
    type: 'GET',
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        // Clear the existing table data
        $('#personnel-tab-pane .table tbody').empty();
        console.log(result);

        // result.data.forEach((personnel, index) => {
        //   personnel.originalIndex = index + 1;
        // });

        // result.data.sort(function (a, b) {
        //   let lastNameA = a.lastName.toLowerCase();
        //   let lastNameB = b.lastName.toLowerCase();
        //   if (lastNameA < lastNameB) return -1;
        //   if (lastNameA > lastNameB) return 1;

        //   let nameA = a.firstName.toLowerCase();
        //   let nameB = b.firstName.toLowerCase();
        //   if (nameA < nameB) return -1;
        //   if (nameA > nameB) return 1;

        //   return 0; // names must be equal
        // });

        // Iterate through the sorted data and append it to the table
        $.each(result.data, function (index, personnel) {
          var row = `
            <tr>
              <td class="align-middle text-nowrap"> ${personnel.firstName} ${personnel.lastName}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.department}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.location}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.email}</td>
              <td class="text-end text-nowrap">
                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${personnel.id}">
                  <i class="fa-solid fa-pencil fa-fw"></i>
                </button>
                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${personnel.id}">
                  <i class="fa-solid fa-trash fa-fw"></i>
                </button>
              </td>
            </tr>
          `;
          $('#personnel-tab-pane .table tbody').append(row);
        });
      } else {
        // Handle error - You may want to display an error message to the user
        console.error('Error: ' + result.status.message);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Handle AJAX error - You may want to display an error message to the user
      console.error('AJAX Error: ' + textStatus + ' - ' + errorThrown);
    },
  });
});

$('#departmentsBtn').click(function () {
  $.ajax({
    url: './libs/php/getAllDepartments.php',
    type: 'GET',
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        $('#departments-tab-pane .table tbody').empty();
        console.log(result);

        $.each(result.data, function (index, department) {
          var row = `
          <tr>
          <td class="align-middle text-nowrap">${department.DepartmentName}</td>
          <td class="align-middle text-nowrap d-none d-md-table-cell">
          ${department.LocationName}
          </td>
          <td class="align-middle text-end text-nowrap">
            <button
              type="button"
              class="btn btn-primary btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#deleteDepartmentModal"
              data-id="1"
            >
              <i class="fa-solid fa-pencil fa-fw"></i>
            </button>
            <button
              type="button"
              class="btn btn-primary btn-sm deleteDepartmentBtn"
              data-id="1"
            >
              <i class="fa-solid fa-trash fa-fw"></i>
            </button>
          </td>
        </tr>
          `;
          $('#departments-tab-pane .table tbody').append(row);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {},
  });
});

$('#locationsBtn').click(function () {
  // Call function to refresh location table
  $.ajax({
    url: './libs/php/getAllLocations.php', // Replace with the actual URL
    type: 'GET', // or 'POST', depending on how your server is set up
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        // Clear the existing table data
        $('#locations-tab-pane .table tbody').empty();
        console.log(result);
        locations = result;
        // Iterate through the returned data and append it to the table
        $.each(result.data, function (index, location) {
          var row = `
          <tr>
          <td class="align-middle text-nowrap">${location.name}</td>
          <td class="align-middle text-end text-nowrap">
            <button type="button" class="btn btn-primary btn-sm">
              <i class="fa-solid fa-pencil fa-fw"></i>
            </button>
            <button type="button" class="btn btn-primary btn-sm">
              <i class="fa-solid fa-trash fa-fw"></i>
            </button>
          </td>
        </tr>
          `;
          $('#locations-tab-pane .table tbody').append(row);
        });
      } else {
        // Handle error - You may want to display an error message to the user
        console.error('Error: ' + result.status.message);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Handle AJAX error - You may want to display an error message to the user
      console.error('AJAX Error: ' + textStatus + ' - ' + errorThrown);
    },
  });
});

$('#editPersonnelModal').on('show.bs.modal', function (e) {
  var personnelId = $(e.relatedTarget).attr('data-id');
  console.log('Personnel ID sent to server: ', personnelId);
  $.ajax({
    url: './libs/php/getPersonnelById.php',
    type: 'POST',
    dataType: 'json',
    data: {
      id: $(e.relatedTarget).attr('data-id'), // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        console.log(result);
        $('#editPersonnelEmployeeID').val(result.data.personnel[0].id);

        $('#editPersonnelFirstName').val(result.data.personnel[0].firstName);
        $('#editPersonnelLastName').val(result.data.personnel[0].lastName);
        $('#editPersonnelJobTitle').val(result.data.personnel[0].jobTitle);
        $('#editPersonnelEmailAddress').val(result.data.personnel[0].email);

        $('#editPersonnelDepartment').html('');

        $.each(result.data.department, function () {
          $('#editPersonnelDepartment').append(
            $('<option>', {
              value: this.id,
              text: this.name,
            })
          );
        });

        $('#editPersonnelDepartment').val(
          result.data.personnel[0].departmentID
        );
      } else {
        $('#editPersonnelModal .modal-title').replaceWith(
          'Error retrieving data'
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#editPersonnelModal .modal-title').replaceWith(
        'Error retrieving data'
      );
    },
  });
});

// Executes when the form button with type="submit" is clicked

$('#editPersonnelForm').on('submit', function (e) {
  // Prevent the default form submission
  e.preventDefault();

  // Collect the form data
  var formData = {
    id: $('#editPersonnelEmployeeID').val(),
    firstName: $('#editPersonnelFirstName').val(),
    lastName: $('#editPersonnelLastName').val(),
    jobTitle: $('#editPersonnelJobTitle').val(),
    email: $('#editPersonnelEmailAddress').val(),
    departmentID: $('#editPersonnelDepartment').val(),
    // Add other fields as necessary
  };

  // AJAX call to save form data
  $.ajax({
    url: './libs/php/updatePersonnel.php',
    type: 'POST',
    data: formData,
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        // Update was successful
        console.log('Update Success: ', result);
        $('#editPersonnelModal').modal('hide');

        $('#personnelBtn').click();
      } else {
        // Handle error - You may want to display an error message to the user
        console.error('Error updating personnel: ' + result.status.message);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Handle AJAX error - You may want to display an error message to the user
      console.error('AJAX Error: ' + textStatus + ' - ' + errorThrown);
    },
  });
});

// delete employee function
$('#deletePersonnelModal').on('show.bs.modal', function (e) {
  var personnelId = $(e.relatedTarget).attr('data-id');
  console.log('Personnel ID sent to server: ', personnelId);
  $.ajax({
    url: './libs/php/getPersonnelById.php',
    type: 'POST',
    dataType: 'json',
    data: { id: personnelId },
    success: function (result) {
      if (result.status.code == 200) {
        console.log(result);
        var personnel = result.data.personnel[0];
        $('#infoPersonnelEmployeeID').val(personnel.id);
        $('#infoPersonnelFirstName').val(personnel.firstName);
        $('#infoPersonnelLastName').val(personnel.lastName);
        $('#infoPersonnelJobTitle').val(personnel.jobTitle);
        $('#infoPersonnelEmailAddress').val(personnel.email);

        var departmentSelect = $('#infoPersonnelDepartment').empty();
        result.data.department.forEach(function (dept) {
          departmentSelect.append(
            $('<option>', {
              value: dept.id,
              text: dept.name,
              selected: dept.id === personnel.departmentID,
            })
          );
        });

        $('#infoPersonnelDepartment').prop('disabled', true);
      } else {
        $('#deletePersonnelModal .modal-title').text('Error retrieving data');
      }
    },
    error: function () {
      $('#deletePersonnelModal .modal-title').text('Error retrieving data');
    },
  });
});

$('#deleteEmployeeBtn').on('click', function () {
  $('#deletePersonnelModal').modal('hide');
  $('#confirmationModal').modal('show');
});

$('#cancelButton').on('click', function () {
  $('#confirmationModal').modal('hide');
});

$('#confirmDelete').on('click', function () {
  var personnelId = $('#infoPersonnelEmployeeID').val();

  $.ajax({
    url: './libs/php/deletePersonnelByID.php',
    type: 'POST',
    dataType: 'json',
    data: { id: personnelId },
    success: function (result) {
      if (result.status.code == 200) {
        console.log('Personnel deleted successfully');
        $('#personnelBtn').click();
      } else {
        console.error('Error: ', result.status.description);
        // Error handling
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('AJAX error: ', textStatus, errorThrown);
      // AJAX error handling
    },
  });

  $('#confirmationModal').modal('hide');
});
