const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// built-in body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB Connection → DB “student”
mongoose.connect('mongodb://localhost:27017/student', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB “student”'))
.catch(err => console.error(err));

// Schema & Model for studentmarks
const studentSchema = new mongoose.Schema({
  Name: String,
  Roll_No: Number,
  WAD_Marks: Number,    // Maths
  CC_Marks: Number,     // Science
  DSBDA_Marks: Number,
  CNS_Marks: Number,
  AI_marks: Number
});
const Student = mongoose.model('studentmark', studentSchema);

// ——————————————————————————————————————————
// ROUTES
// ——————————————————————————————————————————

// d+j) Home: count + table of all students
app.get('/', async (req, res) => {
  const count = await Student.countDocuments();
  const students = await Student.find();
  res.render('index', { count, students, message: null });
});

// c) Insert array of student docs
// c) Insert array of student docs
app.post('/students/insert', async (req, res) => {
  try {
    const studentsArray = JSON.parse(req.body.students);  // Parse the JSON string
    await Student.insertMany(studentsArray);
    res.redirect('/');
  } catch (err) {
    const count = await Student.countDocuments();
    const students = await Student.find();
    res.render('index', {
      count,
      students,
      message: 'Insert Error: ' + err.message
    });
  }
});


// e) Names with DSBDA > 20
app.get('/students/dsbda', async (req, res) => {
  const students = await Student.find({ DSBDA_Marks: { $gt: 20 } }, 'Name');
  res.render('index', {
    count: students.length,
    students,
    message: 'DSBDA > 20'
  });
});

// f) Update specified student’s marks by +10
app.post('/students/update', async (req, res) => {
  const { rollNo } = req.body;
  await Student.updateOne(
    { Roll_No: rollNo },
    { $inc: {
        WAD_Marks: 10,
        CC_Marks: 10,
        DSBDA_Marks: 10,
        CNS_Marks: 10,
        AI_marks: 10
      }
    }
  );
  res.redirect('/');
});

// g) Names with >25 in all subjects
app.get('/students/allsubjects', async (req, res) => {
  const students = await Student.find({
    WAD_Marks: { $gt: 25 },
    CC_Marks: { $gt: 25 },
    DSBDA_Marks: { $gt: 25 },
    CNS_Marks: { $gt: 25 },
    AI_marks: { $gt: 25 }
  }, 'Name');
  res.render('index', {
    count: students.length,
    students,
    message: 'All subjects > 25'
  });
});

// h) Names with <40 in WAD (Maths) AND CC (Science)
app.get('/students/mathsscience', async (req, res) => {
  const students = await Student.find({
    WAD_Marks: { $lt: 40 },
    CC_Marks: { $lt: 40 }
  }, 'Name');
  res.render('index', {
    count: students.length,
    students,
    message: 'WAD & CC < 40'
  });
});

// i) Remove specified student
app.post('/students/delete', async (req, res) => {
  const { rollNo } = req.body;
  await Student.deleteOne({ Roll_No: rollNo });
  res.redirect('/');
});

// Start server
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

/*
[
  {
    "Name": "Alice",
    "Roll_No": 1,
    "WAD_Marks": 35,
    "CC_Marks": 40,
    "DSBDA_Marks": 28,
    "CNS_Marks": 30,
    "AI_marks": 25
  },
  {
    "Name": "Bob",
    "Roll_No": 2,
    "WAD_Marks": 20,
    "CC_Marks": 22,
    "DSBDA_Marks": 19,
    "CNS_Marks": 30,
    "AI_marks": 35
  },
  {
    "Name": "Charlie",
    "Roll_No": 3,
    "WAD_Marks": 42,
    "CC_Marks": 38,
    "DSBDA_Marks": 45,
    "CNS_Marks": 41,
    "AI_marks": 40
  },
  {
    "Name": "Diana",
    "Roll_No": 4,
    "WAD_Marks": 26,
    "CC_Marks": 29,
    "DSBDA_Marks": 22,
    "CNS_Marks": 24,
    "AI_marks": 27
  }
]
  */
