// Get references to the form and the contacts list
const contactForm = document.getElementById("contactForm");
const contactsList = document.getElementById("contacts");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const errorDiv = document.getElementById("error");
const searchErrorDiv = document.getElementById("searchError");
const noContactsDiv = document.getElementById("noContacts");

// Function to load contacts from localStorage
function loadContacts() {
  // Get the contacts from localStorage
  const storedContacts = localStorage.getItem("contacts");
  // If contacts exist, parse and return them, otherwise return an empty array
  return storedContacts ? JSON.parse(storedContacts) : [];
}

// Array to store contacts, initialized from localStorage
let contacts = loadContacts();

// Function to save contacts to localStorage
function saveContacts() {
  // Save the contacts array to localStorage as a JSON string
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

// Function to check if a contact already exists
function contactExists(name, phone) {
  return contacts.some(
    (contact) => contact.name === name && contact.phone === phone
  );
}

// Function to add a contact
function addContact(name, phone) {
  // Check if the contact already exists
  if (contactExists(name, phone)) {
    showError("Contact already exists.");
    return;
  }

  // Add the new contact to the contacts array
  contacts.push({ name, phone });
  // Save the updated contacts array to localStorage
  saveContacts();
  // Re-render the contacts list
  renderContacts();
}

// Function to render the contacts list
function renderContacts(filter = "") {
  // Clear the current list
  contactsList.innerHTML = "";

  // Filter contacts based on the search input
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(filter.toLowerCase()) ||
      contact.phone.includes(filter)
  );

  // Show or hide the "No contacts found" message
  if (contacts.length === 0) {
    noContactsDiv.style.display = "block";
  } else {
    noContactsDiv.style.display = "none";
  }

  // Check if any contacts match the filter
  if (filteredContacts.length === 0 && filter !== "") {
    searchErrorDiv.textContent = "Contact not found.";
    searchErrorDiv.style.display = "block";
  } else {
    searchErrorDiv.style.display = "none";
  }

  // Loop through filtered contacts and create list items
  filteredContacts.forEach((contact, index) => {
    // Create a list item for each contact
    const li = document.createElement("li");

    // Create a div to hold the contact details
    const contactDiv = document.createElement("div");

    // Create a div for the name
    const nameDiv = document.createElement("div");
    nameDiv.className = "name-div";
    nameDiv.textContent = `Name: ${contact.name}`;

    // Create a div for the phone
    const phoneDiv = document.createElement("div");
    phoneDiv.className = "phone-div";
    phoneDiv.textContent = `Phone: ${contact.phone}`;

    // Append the name and phone divs to the contact div
    contactDiv.appendChild(nameDiv);
    contactDiv.appendChild(phoneDiv);

    // Create a delete button for each contact
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteContact(index);

    // Append the contact div and delete button to the list item
    li.appendChild(contactDiv);
    li.appendChild(deleteButton);

    // Append the list item to the contacts list
    contactsList.appendChild(li);
  });
}

// Function to delete a contact
function deleteContact(index) {
  // Remove the contact from the contacts array
  contacts.splice(index, 1);
  // Save the updated contacts array to localStorage
  saveContacts();
  // Re-render the contacts list
  renderContacts();
}

// Function to show an error message
function showError(message) {
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
}

// Function to hide the error message
function hideError() {
  errorDiv.style.display = "none";
}

// Form submit event handler
contactForm.onsubmit = (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();
  // Get the input values
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  // Hide any existing error messages
  hideError();

  // Add the contact to the list
  addContact(name, phone);

  // Clear the form fields
  contactForm.reset();
};

// Prevent typing alphabets in the phone input field
document.getElementById("phone").addEventListener("input", function (event) {
  this.value = this.value.replace(/[^0-9]/g, "");
});

// Search input event handler to enable/disable search button
searchInput.addEventListener("input", () => {
  searchButton.disabled = searchInput.value.trim() === "";
  if (searchInput.value.trim() === "") {
    renderContacts();
  }
});

// Search button click event handler
searchButton.onclick = () => {
  // Get the search input value
  const filter = searchInput.value;
  // Re-render the contacts list with the filter applied
  renderContacts(filter);
};

// Search input event handler for enter key press
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchButton.click();
  }
});

// Initial render of contacts when the page loads
renderContacts();
