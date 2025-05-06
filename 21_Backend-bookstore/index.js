// Importing required modules
const express = require('express');             // Import the Express framework
const mongoose = require('mongoose');           // Import Mongoose to interact with MongoDB
const path = require('path');                   // Import path module for handling file paths

// Initialize the Express app
const app = express();
const PORT = 3000;                              // Set the port for the server

// ------------------- MONGODB CONNECTION -------------------

// Connect to MongoDB with the database named 'bookstore'
mongoose.connect('mongodb://localhost:27017/bookstore', {
  useNewUrlParser: true,            // Use the new MongoDB URL parser
  useUnifiedTopology: true          // Use the new connection engine
})
.then(() => console.log('Connected to MongoDB bookstore'))  // Log success message
.catch(err => console.error(err));  // Log any connection errors

// ------------------- VIEW ENGINE SETUP -------------------

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the path to the 'views' directory for EJS templates
app.set('views', path.join(__dirname, 'views'));

// ------------------- MIDDLEWARE -------------------

// Middleware to parse URL-encoded data from incoming requests (like form submissions)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON data from incoming requests (for API calls or JSON payloads)
app.use(express.json());

// ------------------- SCHEMA AND MODEL -------------------

// Define the schema for a book document in MongoDB
const bookSchema = new mongoose.Schema({
  title: String,                    // Book title
  author: String,                   // Book author
  price: Number,                    // Price of the book
  genre: String                     // Genre of the book
});

// Create a model based on the book schema to interact with the MongoDB collection
const Book = mongoose.model('Book', bookSchema);

// ------------------- ROUTES -------------------

// Home route: Render a list of all books in the bookstore
app.get('/', async (req, res) => {
  const books = await Book.find();              // Fetch all book documents from the database
  res.render('index', { books });               // Render the 'index' view and pass the books to it
});

// Add new book route: Add a new book to the database
app.post('/books/add', async (req, res) => {
  const { title, author, price, genre } = req.body;  // Extract book details from the request body
  await Book.create({ title, author, price, genre }); // Create a new book document in the database
  res.redirect('/');                                // Redirect to the home page after adding the book
});

// Update book details route: Update a book's details in the database
app.post('/books/update', async (req, res) => {
  const { id, title, author, price, genre } = req.body; // Get the book's ID and updated details from the request body
  await Book.findByIdAndUpdate(id, { title, author, price, genre }); // Find the book by ID and update its details
  res.redirect('/');                                     // Redirect to the home page after updating the book
});

// Delete a book route: Remove a book from the database
app.post('/books/delete', async (req, res) => {
  const { id } = req.body;                            // Get the book's ID to be deleted from the request body
  await Book.findByIdAndDelete(id);                    // Delete the book document from the database by its ID
  res.redirect('/');                                    // Redirect to the home page after deleting the book
});

// ------------------- START SERVER -------------------

// Start the Express server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`); // Log the server URL to the console
});
