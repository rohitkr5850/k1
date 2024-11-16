// Firebase Configuration
const firebaseUrl = "https://your-database-name.firebaseio.com"; // Replace with your Firebase database URL

// DOM Elements
const booksTable = document.getElementById("books-table");
const filterGenre = document.getElementById("filter-genre");
const filterAvailable = document.getElementById("filter-available");
const sortField = document.getElementById("sort-field");
const sortOrder = document.getElementById("sort-order");
const itemsPerPageInput = document.getElementById("items-per-page");
const previousPageBtn = document.getElementById("previous-page");
const nextPageBtn = document.getElementById("next-page");

// Pagination Variables
let currentPage = 1;
let itemsPerPage = parseInt(itemsPerPageInput.value);

// Fetch Books from Firebase
const fetchBooks = async () => {
  let url = `${firebaseUrl}/books.json`;

  // Apply Filters
  const genre = filterGenre.value;
  const available = filterAvailable.value;
  if (genre) url += `?orderBy="genre"&equalTo="${genre}"`;
  if (available) url += `${genre ? "&" : "?"}orderBy="available"&equalTo=${available}`;

  // Fetch Data
  const response = await fetch(url);
  const data = await response.json();
  return Object.values(data || {});
};

// Render Books
const renderBooks = async () => {
  const books = await fetchBooks();

  // Apply Sorting
  const field = sortField.value;
  const order = sortOrder.value === "asc" ? 1 : -1;
  books.sort((a, b) => (a[field] > b[field] ? order : -order));

  // Pagination
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedBooks = books.slice(start, end);

  // Render Table
  booksTable.innerHTML = "";
  paginatedBooks.forEach((book) => {
    booksTable.innerHTML += `
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td>${book.publishedYear}</td>
        <td>${book.available ? "Yes" : "No"}</td>
      </tr>
    `;
  });
};

// Event Listeners
filterGenre.addEventListener("change", renderBooks);
filterAvailable.addEventListener("change", renderBooks);
sortField.addEventListener("change", renderBooks);
sortOrder.addEventListener("change", renderBooks);
itemsPerPageInput.addEventListener("change", () => {
  itemsPerPage = parseInt(itemsPerPageInput.value);
  renderBooks();
});
previousPageBtn.addEventListener("click", () => {
  if (currentPage > 1) currentPage--;
  renderBooks();
});
nextPageBtn.addEventListener("click", () => {
  currentPage++;
  renderBooks();
});

// Initial Load
renderBooks();
