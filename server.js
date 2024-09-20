const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://gautam:appu@cluster0.dbs5z.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Book Schema
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    year: Number,
});

const Book = mongoose.model('Book', bookSchema);

// CRUD routes

// Create a book
app.post('/books', async (req, res) => {
    const { title, author, year } = req.body;
    const book = new Book({ title, author, year });
    await book.save();
    res.status(201).send(book);
});

// Get all books
app.get('/books', async (req, res) => {
    const books = await Book.find();
    res.send(books);
});

// Get a single book by ID
app.get('/books/:id', async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.send(book);
});

// Update a book
app.put('/books/:id', async (req, res) => {
    const { title, author, year } = req.body;
    const book = await Book.findByIdAndUpdate(req.params.id, { title, author, year }, { new: true });
    if (!book) return res.status(404).send('Book not found');
    res.send(book);
});

// Delete a book
app.delete('/books/:id', async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.send(book);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
