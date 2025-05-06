const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/employeeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Schema and model
const employeeSchema = new mongoose.Schema({
  name: String,
  department: String,
  designation: String,
  salary: Number,
  joiningDate: Date
});

const Employee = mongoose.model('Employee', employeeSchema);

// ————————————— ROUTES —————————————

// Home: view all records
app.get('/', async (req, res) => {
  const employees = await Employee.find();
  res.render('index', { employees });
});

// Add new employee
app.post('/add', async (req, res) => {
  const { name, department, designation, salary, joiningDate } = req.body;
  await Employee.create({ name, department, designation, salary, joiningDate });
  res.redirect('/');
});

// Update employee by ID
app.post('/update', async (req, res) => {
  const { id, name, department, designation, salary, joiningDate } = req.body;
  await Employee.findByIdAndUpdate(id, { name, department, designation, salary, joiningDate });
  res.redirect('/');
});

// Delete employee
app.post('/delete', async (req, res) => {
  const { id } = req.body;
  await Employee.findByIdAndDelete(id);
  res.redirect('/');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
