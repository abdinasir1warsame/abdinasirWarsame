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
      $('#personnel-tab-pane .table tbody').empty();
      $.each(result.data.found, function (index) {
        var row = `
          <tr>
            <td class="align-middle text-nowrap">${this.lastName} ${this.firstName} </td>
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
// Event listener for the personnel button
$('#personnelBtn').click(function () {
  $('#searchInp').val('');
  selectedDepartment = ''; // Reset selected department
  selectedLocation = ''; // Reset selected location
  showAllPersonnel();
  // Reset locations dropdown
});

// Event listener for the departments button
$('#departmentsBtn').click(function () {
  $('#searchInp').val('');
  selectedDepartment = ''; // Reset selected department
  selectedLocation = ''; // Reset selected location
  ShowAllDepartments();
  // Reset locations dropdown
});

// Event listener for the locations button
$('#locationsBtn').click(function () {
  $('#searchInp').val('');
  selectedDepartment = ''; // Reset selected department
  selectedLocation = ''; // Reset selected location
  showAllLocations();
  // Reset departments dropdown
});

// Event listener for the refresh button
$('#refreshBtn').click(function () {
  // Determine which tab is active and refresh accordingly
  if ($('#personnelBtn').hasClass('active')) {
    showAllPersonnel();
  } else if ($('#departmentsBtn').hasClass('active')) {
    ShowAllDepartments();
  } else if ($('#locationsBtn').hasClass('active')) {
    showAllLocations();
  }
});

// Initialize variables to store filter state
var selectedDepartment = '';
var selectedLocation = '';

// Function to populate departments dropdown
function populateDepartments() {
  $.ajax({
    url: './libs/php/getAllDepartments.php',
    type: 'GET',
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        $('#filterDepartmentSelect').empty();
        $('#filterDepartmentSelect').append(
          $('<option>', {
            value: '',
            text: 'All',
            selected: selectedDepartment === '',
          })
        );
        // Sort the departments alphabetically by name
        result.data.sort(function (a, b) {
          var nameA = a.DepartmentName.toUpperCase();
          var nameB = b.DepartmentName.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });

        // Append sorted departments to the select element
        $.each(result.data, function (index, department) {
          $('#filterDepartmentSelect').append(
            $('<option>', {
              value: department.DepartmentID,
              text: department.DepartmentName,
              selected: selectedDepartment == department.DepartmentID,
            })
          );
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {},
  });
}

// Function to populate locations dropdown
function populateLocations() {
  $.ajax({
    url: './libs/php/getAllLocations.php',
    type: 'GET',
    dataType: 'json',
    success: function (result) {
      if (result.status.code == 200) {
        $('#filterLocationSelect').empty();
        $('#filterLocationSelect').append(
          $('<option>', {
            value: '',
            text: 'All',
            selected: selectedLocation === '',
          })
        );
        // Sort the locations alphabetically by name
        result.data.sort(function (a, b) {
          var nameA = a.name.toUpperCase();
          var nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });

        // Append sorted locations to the select element
        $.each(result.data, function (index, location) {
          $('#filterLocationSelect').append(
            $('<option>', {
              value: location.id,
              text: location.name,
              selected: selectedLocation == location.id,
            })
          );
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {},
  });
}

// Event listener for clicking the filter button
$('#filterBtn').click(function () {
  // Show the filter modal
  $('#filterModal').modal('show');
});

// Event listener for applying the filter
$('#applyFilterBtn').on('click', function () {
  selectedDepartment = $('#filterDepartmentSelect').val();
  selectedLocation = $('#filterLocationSelect').val();

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

        $.each(result.data.personnel, function (index) {
          var row = `
            <tr>
              <td class="align-middle text-nowrap">${this.lastName}${this.firstName} </td>
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
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // Handle error
    },
  });

  // Hide the filter modal
  $('#filterModal').modal('hide');
});

// Event listener for when the filter modal is about to be shown
$('#filterModal').on('show.bs.modal', function () {
  // Populate departments dropdown
  populateDepartments();
  // Populate locations dropdown
  populateLocations();
});

// Event listener for when a department is selected
$('#filterDepartmentSelect').on('change', function () {
  selectedLocation = ''; // Reset selected location
  populateLocations(); // Repopulate locations dropdown
});

// Event listener for when a location is selected
$('#filterLocationSelect').on('change', function () {
  selectedDepartment = ''; // Reset selected department
  populateDepartments(); // Repopulate departments dropdown
});

$('#addBtn').click(function () {
  if ($('#personnelBtn').hasClass('active')) {
    $.ajax({
      url: './libs/php/getAllDepartments.php',
      type: 'GET',
      dataType: 'json',
      success: function (result) {
        $('#createPersonnelDepartment').html('');
        // Sort the departments alphabetically by name
        result.data.sort(function (a, b) {
          var nameA = a.DepartmentName.toUpperCase(); // ignore upper and lowercase
          var nameB = b.DepartmentName.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });

        // Append sorted departments to the select element
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
          // Sort the locations alphabetically by name
          result.data.sort(function (a, b) {
            var nameA = a.name.toUpperCase(); // ignore upper and lowercase
            var nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            // names must be equal
            return 0;
          });

          // Append sorted locations to the select element
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
  // Prevent the default form submission
});
// create department function
$('#createDepartmentForm').on('submit', function (e) {
  e.preventDefault();
  $('#createDepartmentModal').modal('hide');
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

  // Prevent the default form submission

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

  // Prevent the default form submission

  $('#locationSuccessBtn').on('click', function () {
    $('#locationCreatedModal').modal('hide');
  });
});
// all edit functions
// edit personnel
$('#editPersonnelModal').on('show.bs.modal', function (e) {
  $.ajax({
    url: './libs/php/getPersonnelByID.php',
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

        // Sort departments alphabetically by name
        result.data.department.sort(function (a, b) {
          return a.name.localeCompare(b.name);
        });

        // Append sorted departments to the select element
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
      'user ' +
        ' ' +
        firstName +
        ' ' +
        lastName +
        ' ' +
        ' has succesfully been updated' +
        '?'
    );
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

    $('#employeeUpdateConfirmBtn').on('click', function () {
      $('#employeeUpdateSuccessBtn').on('click', function () {
        $('#employeeUpdateSuccess').modal('hide');
      });
    });
  });
});

// edit departments
$('#editDepartmentModal').on('show.bs.modal', function (e) {
  $.ajax({
    url: './libs/php/getDepartmentByID.php',
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

        // Access department information
        $('#editDepartmentID').val(result.data.department.departmentID);
        $('#editDepartmentName').val(result.data.department.DepartmentName);

        // Clear and populate the dropdown with locations
        $('#editDepartmentsLocation').html('');

        // Sort the locations alphabetically by name
        result.data.locations.sort(function (a, b) {
          var nameA = a.LocationName.toUpperCase(); // ignore upper and lowercase
          var nameB = b.LocationName.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });

        // Append sorted locations to the select element
        $.each(result.data.locations, function () {
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
    departmentName + ' has been updated successfully.'
  );
  $('#editDepartmentForm').on('submit', function (e) {
    // Prevent the default form submission
    e.preventDefault();
    $('#editDepartmentModal').modal('hide');
    // Collect the form data
    var formData = {
      id: $('#editDepartmentID').val(),
      name: $('#editDepartmentName').val(),
      locationID: $('#editDepartmentsLocation').val(),

      // Add other fields as necessary
    };
    $.ajax({
      url: './libs/php/updateDepartment.php',
      type: 'POST',
      data: formData,
      dataType: 'json',
      success: function (result) {
        if (result.status.code == 200) {
          // Update was successful
          ShowAllDepartments();

          $('#successDepartmentUpdate').modal('show');
        } else {
          // Handle error - You may want to display an error message to the user
          console.error('Error updating department: ' + result.status.message);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Handle AJAX error - You may want to display an error message to the user
        console.error('AJAX Error: ' + textStatus + ' - ' + errorThrown);
      },
    });

    // AJAX call to save form data

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
    url: './libs/php/getLocationByID.php',
    type: 'POST',
    dataType: 'json',
    data: {
      id: $(e.relatedTarget).attr('data-id'), // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        // Update the hidden input with the employee id so that

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

    // Collect the form data
    var formData = {
      id: $('#editLocationID').val(),
      name: $('#editLocationName').val(),
    };
    $.ajax({
      url: './libs/php/updateLocation.php',
      type: 'POST',
      data: formData,
      dataType: 'json',
      success: function (result) {
        if (result.status.code == 200) {
          // Update was successful
          showAllLocations();

          $('#successLocationUpdate').modal('show');
        } else {
          // Handle error -
          console.error('Error updating department: ' + result.status.message);
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
  // AJAX call to save form data
});

// All delete functions
// delete employee function
$('#deletePersonnelModal').on('show.bs.modal', function (e) {
  var firstName = $(e.relatedTarget).attr('data-first-name');
  var lastName = $(e.relatedTarget).attr('data-last-name');
  $('#deletePersonnelMessage').html(
    'Are you sure you want to delete ' + firstName + ' ' + lastName + '?'
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

  // Retrieve department information
  $.ajax({
    url: './libs/php/getDepartmentByID.php',
    type: 'POST',
    dataType: 'json',
    data: {
      id: departmentID,
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        var departmentInfo = result.data.department;
        var personnelCount = departmentInfo.personnelCount;

        if (personnelCount > 0) {
          $('#deleteDepartmentModal .modal-title').html(
            'Cannot remove department ...'
          );
          $('#departmentDeleteConfirmTxt').html(
            'You cannot remove the entry for ' +
              departmentName +
              ' because it has ' +
              personnelCount +
              ' employees assigned to it.'
          );
          $('#deleteDepartmentFooter').empty();
          $('#deleteDepartmentFooter').append(
            '<button type="button" class="btn btn-outline-secondary btn-sm myBtn" data-bs-dismiss="modal">OK</button>'
          );
        } else {
          $('#deleteDepartmentFooter').empty();
          $('#deleteDepartmentModal .modal-title').html(
            'Remove department entry?'
          );
          $('#departmentDeleteConfirmTxt').html(
            'Are you sure that you want to remove the entry for ' +
              departmentName +
              '?'
          );
          $('#deleteDepartmentFooter').append(
            '<button type="button" id="confirmDeleteForDepartment" class="btn btn-outline-secondary btn-sm myBtn" data-bs-dismiss="modal">YES</button>' +
              '<button type="button" class="btn btn-outline-secondary btn-sm myBtn" data-bs-dismiss="modal">NO</button>'
          );
        }
      } else {
        $('#deleteDepartmentModal .modal-title').html(
          'Cannot remove department ..'
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#deleteDepartmentModal .modal-title').html('Error retrieving data');
    },
  });

  // Confirm deletion
  $(document).on('click', '#confirmDeleteForDepartment', function () {
    var departmentID = $(e.relatedTarget).attr('data-id');

    $.ajax({
      url: './libs/php/deleteDepartmentByID.php',
      type: 'POST',
      data: { id: departmentID },
      success: function (result) {
        var employeeCount = result.data.employeeCount;
        if (result.status.code === '200' && employeeCount === 0) {
          // Show success modal and hide unsuccessful modal
          $('#successDepartmentDeletion').modal('show');
          ShowAllDepartments();
        } else {
          // Show unsuccessful modal
        }
      },
      error: function (xhr, status, error) {
        alert('AJAX error: ' + status + ', ' + error);
      },
      complete: function (xhr) {
        console.log('AJAX request completed. Status code: ' + xhr.status);
      },
    });

    return false;
  });
});

// delete location

$('#deleteLocationModal').on('show.bs.modal', function (e) {
  var locationName = $(e.relatedTarget).attr('data-name');

  $.ajax({
    url: './libs/php/getLocationByID.php',
    type: 'POST',
    dataType: 'json',
    data: {
      id: $(e.relatedTarget).attr('data-id'), // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      if (result.status.code == 200) {
        console.log(result);
        // Check if there are employees attributed to the location
        employeeCount = result.data.employeeCount;
        if (employeeCount > 0) {
          $('#deleteLocationTitle').html('Cannot remove location ...');
          $('#deleteLocationConfirm').html(
            'You cannot remove the entry for ' +
              locationName +
              ' because it has ' +
              employeeCount +
              ' employees assigned to it.'
          );
          $('#deleteLocationFooter').empty();
          $('#deleteLocationFooter').append(
            '<button type="button" class="btn btn-outline-secondary btn-sm myBtn" data-bs-dismiss="modal">OK</button>'
          );
        } else {
          $('#deleteLocationTitle').html('Remove location entry?');
          $('#deleteLocationConfirm').html(
            'Are you sure you want to delete this Location?'
          );
          $('#deleteLocationFooter').empty();
          $('#deleteLocationFooter').append(
            '<button type="button" id="locationConfirmDelete" class="btn btn-outline-secondary btn-sm myBtn" data-bs-dismiss="modal">YES</button>' +
              '<button type="button" class="btn btn-outline-secondary btn-sm myBtn" data-bs-dismiss="modal">NO</button>'
          );
        }
      }
    },
  });

  $(document).on('click', '#locationConfirmDelete', function () {
    var locationID = $(e.relatedTarget).attr('data-id');
    $.ajax({
      url: './libs/php/deleteLocationByID.php', // URL to your delete script
      type: 'POST',
      data: { id: locationID },
      success: function (result) {
        var employeeCount = result.data.employeeCount;

        if (result.status.code === '200') {
          // Check for a successful status code
          showAllLocations();

          $('#successLocationDeletion').modal('show');
        } else {
        }
      },
      error: function (xhr, status, error) {
        alert('AJAX error: ' + status + ', ' + error);
        // Handle AJAX errors
      },
    });

    return false;
  });
});
