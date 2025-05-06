// Wait until the entire DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {

  // Get the registration form element by ID (if it exists on the page)
  const registerForm = document.getElementById('registerForm');

  // Get the login form element by ID (if it exists on the page)
  const loginForm = document.getElementById('loginForm');

  // If registration form is present, add event listener to handle form submission
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent the default form submission (page reload)

      // Create a user object with values from input fields
      const user = {
        fullname: document.getElementById('fullname').value, // Full name field
        email: document.getElementById('email').value,       // Email field
        mobile: document.getElementById('mobile').value,     // Mobile number
        dob: document.getElementById('dob').value,           // Date of birth
        city: document.getElementById('city').value,         // City
        address: document.getElementById('address').value,   // Address
        password: document.getElementById('password').value  // Password
      };

      // Retrieve existing users from localStorage or initialize empty array
      let users = JSON.parse(localStorage.getItem('users')) || [];

      // Add the new user to the array
      users.push(user);

      // Save the updated users array back to localStorage
      localStorage.setItem('users', JSON.stringify(users));

      // Show a confirmation alert
      alert('User Registered Successfully!');

      // Reset the form inputs
      registerForm.reset();

      // OPTIONAL: Send user data to a backend using XHR (for future backend support)
      const xhr = new XMLHttpRequest(); // Create a new XMLHttpRequest object
      xhr.open('POST', 'https://example.com/api/register', true); // Set the request type and URL
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8'); // Set the request header to send JSON
      xhr.send(JSON.stringify(user)); // Send the user data as a JSON string
    });
  }

  // If login form is present, add event listener to handle login
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent default form submission

      // Get entered login email and password
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      // Retrieve existing users from localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];

      // Check if a user with matching email and password exists
      const matchedUser = users.find(user => user.email === email && user.password === password);

      // If a match is found, show success and redirect to data.html
      if (matchedUser) {
        alert('Login successful!');
        window.location.href = 'data.html'; // Redirect to data display page
      } else {
        // Otherwise, show error message
        alert('Invalid email or password.');
      }

      // OPTIONAL: Send login data to a backend using XHR (for future use)
      const xhr = new XMLHttpRequest(); // Create a new XMLHttpRequest object
      xhr.open('POST', 'https://example.com/api/login', true); // POST to backend
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8'); // Send as JSON
      xhr.send(JSON.stringify({ email, password })); // Send login credentials
    });
  }

  // If userCards container exists, render all users as cards
  const userCards = document.getElementById('userCards');

  if (userCards) {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Loop through each user and create a card
    users.forEach(user => {
      const card = document.createElement('div'); // Create a new div element
      card.className = 'card'; // Add CSS class for styling

      // Set the inner HTML of the card with user details
      card.innerHTML = `
        <p><strong>Name:</strong> ${user.fullname}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Mobile:</strong> ${user.mobile}</p>
        <p><strong>DOB:</strong> ${user.dob}</p>
        <p><strong>City:</strong> ${user.city}</p>
        <p><strong>Address:</strong> ${user.address}</p>
      `;

      // Append the card to the userCards container
      userCards.appendChild(card);
    });
  }
});

// Function to clear all users from localStorage and refresh the page
function clearUsers() {
  localStorage.removeItem('users'); // Remove 'users' item from localStorage
  alert('All users cleared!'); // Show confirmation
  location.reload(); // Reload the page to update the UI
}
