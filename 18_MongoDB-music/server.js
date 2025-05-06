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

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/music', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB “music”'))
.catch(err => console.error(err));

// Song Schema & Model
const songSchema = new mongoose.Schema({
  Songname: String,
  Film: String,
  Music_director: String,
  singer: String,
  Actor: String,      // for update task (j)
  Actress: String     // for update task (j)
});
const Song = mongoose.model('songdetail', songSchema);

// ——————————————————————————————————————————
// ROUTES
// ——————————————————————————————————————————

// d+k) Home: show total count + all songs in a table
app.get('/', async (req, res) => {
  const count = await Song.countDocuments();
  const songs = await Song.find();
  res.render('index', { count, songs, message: null });
});

// c) Insert array of 5 song documents
app.post('/songs/insert', async (req, res) => {
  try {
    await Song.insertMany(req.body.songs);
    res.redirect('/');
  } catch (err) {
    res.render('index', { count: 0, songs: [], message: 'Insert Error: ' + err.message });
  }
});

// e) List by Music Director
app.get('/songs/by-director', async (req, res) => {
  const { director } = req.query;
  const songs = await Song.find({ Music_director: director });
  res.render('index', { count: songs.length, songs, message: `Songs by ${director}` });
});

// f) List by Director + Singer
app.get('/songs/by-director-singer', async (req, res) => {
  const { director, singer } = req.query;
  const songs = await Song.find({ Music_director: director, singer });
  res.render('index', { count: songs.length, songs, message: `Songs by ${director} sung by ${singer}` });
});

// g) Delete a song you don’t like
app.post('/songs/delete', async (req, res) => {
  const { id } = req.body;
  await Song.findByIdAndDelete(id);
  res.redirect('/');
});

// h) Add a new favourite song
app.post('/songs/add', async (req, res) => {
  await Song.create(req.body.song);
  res.redirect('/');
});

// i) List Songs by Singer from a specified Film
app.get('/songs/by-singer-film', async (req, res) => {
  const { singer, film } = req.query;
  const songs = await Song.find({ singer, Film: film });
  res.render('index', { count: songs.length, songs, message: `Songs from “${film}” sung by ${singer}` });
});

// j) Update a document by adding Actor and Actress
app.post('/songs/update-cast', async (req, res) => {
  const { id, Actor, Actress } = req.body;
  await Song.findByIdAndUpdate(id, { Actor, Actress });
  res.redirect('/');
});

// Start server
app.listen(PORT, () => {
  console.log(`Listening: http://localhost:${PORT}`);
});
