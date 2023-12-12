/**********************************************************************************
 * 
 *  ITE5315 – Project* I declare that this assignment is my own work in accordance with 
 * Humber Academic Policy.* No part of this assignment has been copied manually or electronically 
 * from any other source* (including web sites) or distributed to other students.** 
 * Group member 
 * Name:George Devid John Thekkineth__ Student IDs: _NO1547325___ 
 * Name:Keziah Thomas__ Student IDs: _N01541155___ 
 * Date: __12th December________************************************
 * *********************************************/
// This event listener waits for the DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Get references to the open and close modal buttons, and the modal itself
  var openModalBtn = document.getElementById('openModalBtn');
  var closeModalBtn = document.getElementById('closeModalBtn');
  var addModal = document.getElementById('addModal');

  // Event listener for opening the modal
  openModalBtn.addEventListener('click', function () {
      // Display the modal
      addModal.style.display = 'block';
      // Get a reference to the form inside the modal and reset it
      var form = document.getElementById("myForm");
      form.reset();
  });

  // Event listener for closing the modal
  closeModalBtn.addEventListener('click', function () {
      // Get a reference to the form inside the modal and reset it
      var form = document.getElementById("myForm");
      form.reset();
      // Hide the modal
      addModal.style.display = 'none';
  });

  // Event listener to close the modal if clicked outside of it
  window.addEventListener('click', function (event) {
      if (event.target == addModal) {
          addModal.style.display = 'none';
      }
  });

  // Get a reference to the form inside the modal
  var addItemForm = document.getElementById('addItemForm');

  // Event listener for form submission
  addItemForm.addEventListener('submit', function (event) {
      event.preventDefault();

      // Add your logic here to handle the form submission
      // For now, let's just close the modal
      addModal.style.display = 'none';
  });
});
