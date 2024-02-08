$('#searchInp').on('keyup', function () {
  var searchText = $(this).val(); // Get the current value of the input field

  $.ajax({
    url: './libs/php/SearchAll.php', // Adjust as needed
    type: 'POST', // Use 'POST' or 'GET' according to your actual setup
    dataType: 'json',
    data: {
      txt: searchText, // Use the current value of the input field
    },
    success: function (result) {
      console.log('Success:', result);
      $('#personnel-tab-pane .table tbody').empty();
      $.each(result.data.found, function (index) {
        var row = `
          <tr>
            <td class="align-middle text-nowrap"> ${this.firstName} ${this.lastName}</td>
            <td class="align-middle text-nowrap d-none d-md-table-cell">${this.departmentName}</td>
            <td class="align-middle text-nowrap d-none d-md-table-cell">${this.locationName}</td>
            <td class="align-middle text-nowrap d-none d-md-table-cell">${this.email}</td>
            <td class="text-end text-nowrap">
              <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${this.id}">
                <i class="fa-solid fa-pencil fa-fw"></i>
              </button>
              <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${this.id}">
                <i class="fa-solid fa-trash fa-fw"></i>
              </button>
            </td>
          </tr>
        `;
        $('#personnel-tab-pane .table tbody').append(row);
      });
    },
    error: function (xhr, status, error) {
      // Handle error
      console.error('Error:', status, error);
    },
  });
});

$('#refreshBtn').click(function () {
  if ($('#personnelBtn').hasClass('active')) {
    showAllPersonnel();
  } else {
    if ($('#departmentsBtn').hasClass('active')) {
      ShowAllDepartments();
    } else {
      showAllLocations();
    }
  }
});

$('#filterBtn').click(function () {
  $('#filterModal').modal('show');

  // Fetch and populate departments
  $.ajax({
    url: './libs/php/getAllDepartments.php',
    type: 'GET',
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        console.log(result);
        $('#filterDepartmentSelect').empty();
        $('#filterDepartmentSelect').append(
          $('<option>', {
            value: '',
            text: 'Choose a Department',
            selected: true,
            disabled: true,
          })
        );
        $.each(result.data, function (index, department) {
          $('#filterDepartmentSelect').append(
            $('<option>', {
              value: department.DepartmentID,
              text: department.DepartmentName,
            })
          );
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {},
  });

  // Fetch and populate locations
  $.ajax({
    url: './libs/php/getAllLocations.php',
    type: 'GET',
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        console.log(result);
        $('#filterLocationSelect').empty();
        $('#filterLocationSelect').append(
          $('<option>', {
            value: '',
            text: 'Choose a Location',
            selected: true,
            disabled: true,
          })
        );
        $.each(result.data, function (index, location) {
          $('#filterLocationSelect').append(
            $('<option>', {
              value: location.id,
              text: location.name,
            })
          );
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {},
  });

  // Event listener for when a department or location is selected
  $('#applyFilterBtn').on('click', function () {
    const selectedDepartment = $('#filterDepartmentSelect').val();
    const selectedLocation = $('#filterLocationSelect').val();

    // AJAX request to get filtered personnel
    $.ajax({
      url: './libs/php/filterPersonnel.php',
      type: 'POST',
      dataType: 'json',
      data: {
        departmentID: selectedDepartment,
        locationID: selectedLocation,
      },
      success: function (result) {
        if (result.status.code == 200) {
          $('#personnel-tab-pane .table tbody').empty();
          console.log(result);
          $.each(result.data.personnel, function (index) {
            var row = `
              <tr>
                <td class="align-middle text-nowrap"> ${this.firstName} ${this.lastName}</td>
                <td class="align-middle text-nowrap d-none d-md-table-cell">${this.departmentName}</td>
                <td class="align-middle text-nowrap d-none d-md-table-cell">${this.locationName}</td>
                <td class="align-middle text-nowrap d-none d-md-table-cell">${this.email}</td>
                <td class="text-end text-nowrap">
                  <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${this.id}">
                    <i class="fa-solid fa-pencil fa-fw"></i>
                  </button>
                  <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${this.id}">
                    <i class="fa-solid fa-trash fa-fw"></i>
                  </button>
                </td>
              </tr>
            `;
            $('#personnel-tab-pane .table tbody').append(row);
            $('#filterModal').modal('hide');
            $('#closeFilterModal').on('click', function () {
              console.log('clicked');
              $('#filterModal').modal('hide');
            });
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Handle error
      },
    });
  });
});

function updatePersonnelDisplay(personnel) {
  // Implement how you want to display the personnel data
  // For instance, updating a table, a list, or cards on your page
}

$('#addBtn').click(function () {
  if ($('#personnelBtn').hasClass('active')) {
    $.ajax({
      url: './libs/php/getAllDepartments.php',
      type: 'GET',
      dataType: 'json',
      success: function (result) {
        $('#createPersonnelDepartment').html('');
        $.each(result.data, function () {
          $('#createPersonnelDepartment').append(
            $('<option>', {
              value: this.DepartmentID,
              text: this.DepartmentName,
            })
          );
        });

        $('#createPersonnelModal').modal('show');
      },
    });
  } else {
    if ($('#departmentsBtn').hasClass('active')) {
      $.ajax({
        url: './libs/php/getAllLocations.php',
        type: 'GET',
        dataType: 'json',
        success: function (result) {
          $.each(result.data, function () {
            $('#chooseLocation').append(
              $('<option>', {
                value: this.id,
                text: this.name,
              })
            );
          });

          $('#createDepartmentModal').modal('show');
        },
      });
    } else {
      $('#createLocationModal').modal('show');
    }
  }
});

const showAllPersonnel = () => {
  // Call function to refresh personnel table
  $.ajax({
    url: './libs/php/getAll.php', // Replace with the actual URL
    type: 'GET',
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        // Clear the existing table data
        $('#personnel-tab-pane .table tbody').empty();

        // Initialize a variable to store the highest ID

        // Iterate through the data to find the highest ID
        $.each(result.data, function (index, personnel) {
          var row = `
            <tr>
              <td class="align-middle text-nowrap "> ${personnel.firstName} ${personnel.lastName}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.department}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.location}</td>
              <td class="align-middle text-nowrap d-none d-md-table-cell">${personnel.email}</td>
              <td class="text-end text-nowrap">
                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="${personnel.id}"data-first-name="${personnel.firstName}" data-last-name="${personnel.lastName}">
                  <i class="fa-solid fa-pencil fa-fw"></i>
                </button>
                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="${personnel.id}" data-first-name="${personnel.firstName}" data-last-name="${personnel.lastName}">
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
};

const ShowAllDepartments = () => {
  $.ajax({
    url: './libs/php/getAllDepartments.php',
    type: 'GET',
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        $('#departments-tab-pane .table tbody').empty();

        $.each(result.data, function (index, department) {
          var row = `
          <tr>
          <td class="align-middle text-nowrap ">${department.DepartmentName}</td>
          <td class="align-middle text-nowrap d-none d-md-table-cell">
          ${department.LocationName}
          </td>
          <td class="align-middle text-end text-nowrap">
            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${department.DepartmentID}" data-name="${department.DepartmentName}"
            >
              <i class="fa-solid fa-pencil fa-fw"></i>
            </button>
            <button
              type="button"
              class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" data-id="${department.DepartmentID}" data-name="${department.DepartmentName}">
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
};
const showAllLocations = () => {
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
        // Iterate through the returned data and append it to the table
        $.each(result.data, function (index, location) {
          var row = `
          <tr>
          <td class="align-middle text-nowrap">${location.name}</td>
          <td class="align-middle text-end text-nowrap">
            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${location.id}" data-name="${location.name}">
              <i class="fa-solid fa-pencil fa-fw"></i>
            </button>
            <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-id="${location.id}" data-name="${location.name}">
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
};
$(document).ready(() => {
  // Call the function to show all personnel
  showAllPersonnel();
  ShowAllDepartments();
  showAllLocations();
});
// all create functions
// create personell  function
$('#createPersonnelForm').on('submit', function (e) {
  e.preventDefault();
  $('#createPersonnelModal').modal('hide');
  $('#createConfirmationModal').modal('show');

  // Prevent the default form submission

  $('#createConfirmationModal').on('click', function () {
    // Collect the form data
    var formData = {
      firstName: $('#createPersonnelFirstName').val(),
      lastName: $('#createPersonnelLastName').val(),
      jobTitle: $('#createPersonnelJobTitle').val(),
      email: $('#createPersonnelEmailAddress').val(),
      departmentID: $('#createPersonnelDepartment').val(),
      // Add other fields as necessary
    };

    // AJAX call to save form data
    $.ajax({
      url: './libs/php/createPersonnel.php',
      type: 'POST',
      data: formData,
      dataType: 'json',
      success: function (result) {
        if (result.status.code == 200) {
          // Update was successful
          showAllPersonnel();
          $('#createConfirmationModal').modal('hide');
          $('#EmployeeCreatedModal').modal('show');
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
  $('#cancelButton').on('click', function () {
    $('#createConfirmationModal').modal('hide');
  });
  $('#successOkButton').on('click', function () {
    $('#EmployeeCreatedModal').modal('hide');
  });
});
// create department function
$('#createDepartmentForm').on('submit', function (e) {
  e.preventDefault();
  $('#createDepartmentModal').modal('hide');

  $('#createDepartmentConfirmModal').modal('show');

  // Prevent the default form submission

  $('#createDepartmentConfirmModal').on('click', function () {
    // Collect the form data
    var formData = {
      name: $('#createDepartment').val(),
      locationID: $('#chooseLocation').val(),
      // Add other fields as necessary
    };

    // AJAX call to save form data
    $.ajax({
      url: './libs/php/insertDepartment.php',
      type: 'POST',
      data: formData,
      dataType: 'json',
      success: function (result) {
        if (result.status.code == 200) {
          // Update was successful
          $('#createDepartmentConfirmModal').modal('hide');
          $('#departmentCreatedModal').modal('show');
          ShowAllDepartments();
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
  $('#departmentConfButton').on('click', function () {
    $('#createDepartmentConfirmModal').modal('hide');
  });
  $('#departmentsuccessBtn').on('click', function () {
    $('#departmentCreatedModal').modal('hide');
  });
});
// create location function
$('#createLocationForm').on('submit', function (e) {
  e.preventDefault();
  $('#createLocationModal').modal('hide');

  $('#createLocationConfirmModal').modal('show');

  // Prevent the default form submission

  $('#LocationConfButton').on('click', function () {
    // Collect the form data
    var formData = {
      name: $('#locationName').val(),

      // Add other fields as necessary
    };

    // AJAX call to save form data
    $.ajax({
      url: './libs/php/createLocation.php',
      type: 'POST',
      data: formData,
      dataType: 'json',
      success: function (result) {
        if (result.status.code == 200) {
          // Update was successful
          showAllLocations();
          $('#createLocationConfirmModal').modal('hide');
          $('#locationCreatedModal').modal('show');
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
  $('#locationCreateCancel').on('click', function () {
    $('#createLocationConfirmModal').modal('hide');
  });
  $('#locationSuccessBtn').on('click', function () {
    $('#locationCreatedModal').modal('hide');
  });
});
// all edit functions
// edit personnel
$('#editPersonnelModal').on('show.bs.modal', function (e) {
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

  $('#editPersonnelForm').on('submit', function (event) {
    event.preventDefault();
    // Prevent the default form submission
    $('#editPersonnelModal').modal('hide');
    $('#employeeUpdateConfirm').modal('show');
    var firstName = $(e.relatedTarget).attr('data-first-name');
    var lastName = $(e.relatedTarget).attr('data-last-name');
    var id = $(e.relatedTarget).attr('data-id');
    $('#employeeEditMessage').html(
      'Are you sure you want to apply changes for ' +
        ' ' +
        firstName +
        ' ' +
        lastName +
        ' ' +
        '?'
    );

    $('#employeeUpdateConfirmBtn').on('click', function () {
      var formData = {
        id: id,
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
            $('#employeeUpdateConfirm').modal('hide');
            $('#employeeUpdateSuccess').modal('show');

            showAllPersonnel();
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
      $('#employeeUpdateSuccessBtn').on('click', function () {
        $('#employeeUpdateSuccess').modal('hide');
      });
    });
  });
});

// edit departments
$('#editDepartmentModal').on('show.bs.modal', function (e) {
  $.ajax({
    url: './libs/php/getDepartmentById.php',
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
        // Access department information
        $('#editDepartmentID').val(result.data.department.departmentID);
        $('#editDepartmentName').val(result.data.department.DepartmentName);

        // Clear and populate the dropdown with locations
        $('#editDepartmentsLocation').html('');

        $.each(result.data.locations, function () {
          console.log('Location:', this.LocationName, 'ID:', this.locationID);
          $('#editDepartmentsLocation').append(
            $('<option>', {
              value: this.locationID,
              text: this.LocationName,
            })
          );
        });

        // Set the default selected location (assuming locations[0] exists)
        if (result.data.locations.length > 0) {
          $('#editDepartmentsLocation').val(result.data.department.locationID);
        }
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
  var departmentName = $(e.relatedTarget).attr('data-name');
  $('#updateDepartmentparagraph').html(
    'Are you Sure you want to apply changes for' + ' ' + departmentName + '?'
  );
  $('#editDepartmentForm').on('submit', function (e) {
    // Prevent the default form submission
    e.preventDefault();

    $('#editDepartmentModal').modal('hide');
    $('#updateDepartmentConfirmation').modal('show');

    // Collect the form data
    var formData = {
      id: $('#editDepartmentID').val(),
      name: $('#editDepartmentName').val(),
      locationID: $('#editDepartmentsLocation').val(),

      // Add other fields as necessary
    };

    // AJAX call to save form data
    $('#departmentConfirmDelete').on('click', function () {
      $.ajax({
        url: './libs/php/updateDepartment.php',
        type: 'POST',
        data: formData,
        dataType: 'json',
        success: function (result) {
          if (result.status.code == 200) {
            // Update was successful
            ShowAllDepartments();
            $('#updateDepartmentConfirmation').modal('hide');
            $('#successDepartmentUpdate').modal('show');
          } else {
            // Handle error - You may want to display an error message to the user
            console.error(
              'Error updating department: ' + result.status.message
            );
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          // Handle AJAX error - You may want to display an error message to the user
          console.error('AJAX Error: ' + textStatus + ' - ' + errorThrown);
        },
      });
    });
    $('#successDepartmentUpdate').on('click', function () {
      $('#successDepartmentUpdate').modal('hide');
    });
  });
});

// edit location
$('#editLocationModal').on('show.bs.modal', function (e) {
  var locationName = $(e.relatedTarget).attr('data-name');
  $('#updateLocationConfirmTxt').html(
    'Are you Sure you want to apply changes for ' + locationName + ' ?'
  );
  $.ajax({
    url: './libs/php/getLocationById.php',
    type: 'POST',
    dataType: 'json',
    data: {
      id: $(e.relatedTarget).attr('data-id'), // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that

        console.log(result);
        // Access department information
        $('#editLocationID').val(result.data.id);
        $('#editLocationName').val(result.data.name);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#editPersonnelModal .modal-title').replaceWith(
        'Error retrieving data'
      );
    },
  });
  $('#editLocationForm').on('submit', function (e) {
    // Prevent the default form submission
    e.preventDefault();
    $('#editLocationModal').modal('hide');
    $('#updateLocationConfirmation').modal('show');
    // Collect the form data
    var formData = {
      id: $('#editLocationID').val(),
      name: $('#editLocationName').val(),
    };
    // AJAX call to save form data
    $('#confirmLocationUpdate').on('click', function () {
      $.ajax({
        url: './libs/php/updateLocation.php',
        type: 'POST',
        data: formData,
        dataType: 'json',
        success: function (result) {
          if (result.status.code == 200) {
            // Update was successful
            showAllLocations();
            $('#updateLocationConfirmation').modal('hide');
            $('#successLocationUpdate').modal('show');
          } else {
            // Handle error -
            console.error(
              'Error updating department: ' + result.status.message
            );
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          // Handle AJAX error -
          console.error('AJAX Error: ' + textStatus + ' - ' + errorThrown);
        },
      });
    });
    $('#successLocationUpdate').on('click', function () {
      $('#successLocationUpdate').modal('hide');
    });
  });
});

// All delete functions
// delete employee function
$('#deletePersonnelModal').on('show.bs.modal', function (e) {
  var firstName = $(e.relatedTarget).attr('data-first-name');
  var lastName = $(e.relatedTarget).attr('data-last-name');
  $('#deletePersonnelMessage').html(
    'Are you sure you want to delete ' +
      ' ' +
      firstName +
      ' ' +
      lastName +
      ' ' +
      '?'
  );
  $('#deleteEmployeeBtn').on('click', function () {
    $.ajax({
      url: './libs/php/deletePersonnelByID.php',
      type: 'POST',
      dataType: 'json',
      data: { id: $(e.relatedTarget).attr('data-id') },
      success: function (result) {
        if (result.status.code == 200) {
          $('#deletePersonnelModal').modal('hide');
          $('#successModal').modal('show');
          $('#successOkButton').on('click', function () {
            $('#successModal').modal('hide');
          });
          showAllPersonnel();
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

    $('#userDeleteSuccess').on('click', function () {
      $('#successModal').modal('hide');
    });
    $('#cancelButton').on('click', function () {
      $('#confirmationModal').modal('hide');
    });
  });
});

$('#deleteDepartmentModal').on('show.bs.modal', function (e) {
  var departmentID = $(e.relatedTarget).attr('data-id');
  var departmentName = $(e.relatedTarget).attr('data-name');
  $.ajax({
    url: './libs/php/getDepartmentById.php',
    type: 'POST',
    dataType: 'json',
    data: {
      id: departmentID, // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      var resultCode = result.status.code;
      console.log(resultCode);
      if (resultCode == 200) {
        console.log(result);
        // Access department information
        $('#departmentID').val(result.data.department.departmentID);
        $('#DepartmentName').val(result.data.department.DepartmentName);

        var locationID = result.data.department.locationID;
        var locationName = result.data.department.locationName;

        $('#departmentLocation').html('');
        $('#departmentLocation').append(
          $('<option>', {
            value: locationID,
            text: locationName,
          })
        );

        // Set the default selected location (assuming locations[0] exists)
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#editPersonnelModal .modal-title').replaceWith(
        'Error retrieving data'
      );
    },
  });
  $('#depertmantDeleteConfirmTxt').html(
    'Are you Sure you want to delete' + ' ' + departmentName + '?'
  );

  $('#deleteDepartmentBtn').on('click', function () {
    $('#deleteDepartmentModal').modal('hide');
    $('#DepartmentDeleteConfirmation').modal('show');
  });

  $('#confirmDeleteForDepartment').on('click', function () {
    var departmentID = $(e.relatedTarget).attr('data-id');
    console.log('button is clicked');
    $.ajax({
      url: './libs/php/deleteDepartmentByID.php',
      type: 'POST',
      data: { id: departmentID },
      success: function (result) {
        console.log(result);
        var employeeCount = result.data.employeeCount;
        if (result.status.code === '200' && employeeCount === 0) {
          $('#DepartmentDeleteConfirmation').modal('hide');
          $('#successDepartmentDeletion').modal('show');
          ShowAllDepartments();
        } else if (employeeCount > 0) {
          // Department cannot be deleted because it is associated with personnel
          $('#departmentDeleteUnsuccessful').html(
            departmentName +
              ' cannot be deleted because it is associated with ' +
              employeeCount +
              ' personnel.'
          );
          $('#DepartmentDeleteConfirmation').modal('hide');
          $('#unsuccessfulDeletionModal').modal('show');
        } else {
          // Handle other errors
          $('#DepartmentDeleteConfirmation').modal('hide');
          $('#unsuccessfulDeletionModal').modal('show');
        }
      },
      error: function (xhr, status, error) {
        alert('AJAX error: ' + status + ', ' + error);
      },
      complete: function (xhr) {
        console.log('AJAX request completed. Status code: ' + xhr.status);
      },
    });

    $('#close-Department-unsuccess').on('click', function () {
      $('#unsuccessfulDeletionModal').modal('hide');
    });
    $('#departmentDeleteSuccess').on('click', function () {
      $('#successDepartmentDeletion').modal('hide');
    });

    return false;
  });
});
// delete location

$('#deleteLocationModal').on('show.bs.modal', function (e) {
  var locationName = $(e.relatedTarget).attr('data-name');
  $('#deleteLocationConfirm').html(
    'Are you Sure you want to delete ' + locationName
  );

  $.ajax({
    url: './libs/php/getLocationById.php',
    type: 'POST',
    dataType: 'json',
    data: {
      id: $(e.relatedTarget).attr('data-id'), // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      if (result.status.code == 200) {
        // Update the hidden input with the employee id so that

        console.log(result);
        // Access department information
        $('#locationID').val(result.data.id);
        $('#locationDeleteName').val(result.data.name);
      }
    },
  });

  $('#deleteLocationBtn').on('click', function () {
    $('#deleteLocationModal').modal('hide');
    $('#locationDeleteConfirmation').modal('show');
  });

  $('#locationConfirmDelete').on('click', function () {
    var locationID = $(e.relatedTarget).attr('data-id');
    $.ajax({
      url: './libs/php/deleteLocationByID.php', // URL to your delete script
      type: 'POST',
      data: { id: locationID },
      success: function (result) {
        console.log(result);
        var employeeCount = result.data.employeeCount;
        $('#locationDeleteUnsuccess').html(
          locationName +
            ' cannot be deleted because it is associated with ' +
            employeeCount +
            ' personnel.'
        );
        if (result.status.code === '200') {
          // Check for a successful status code
          showAllLocations();
          $('#locationDeleteConfirmation').modal('hide');
          $('#successLocationDeletion').modal('show');
        } else {
          $('#locationDeleteConfirmation').modal('hide');
          $('#unsuccessfulLocationDeletionModal').modal('show');
          // Handle errors, show messages to users
        }
      },
      error: function (xhr, status, error) {
        alert('AJAX error: ' + status + ', ' + error);
        // Handle AJAX errors
      },
    });
    $('#close-Location-unsuccess').on('click', function () {
      $('#unsuccessfulLocationDeletionModal').modal('hide');
    });
    $('#successLocationButton').on('click', function () {
      $('#successLocationDeletion').modal('hide');
    });

    return false;
  });
});
