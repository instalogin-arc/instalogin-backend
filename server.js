const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Setup - allows all (adjust for Netlify)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

// ✅ MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Atlas connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ❌ REMOVE this if frontend is hosted separately
// app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Test route
app.get('/', (req, res) => {
  res.send('✅ Backend is running on Render');
});

// ✅ POST /login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log("📥 Received login:", username, password);

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  try {
    const newUser = new User({ username, password });
    await newUser.save();
    console.log("✅ Saved to DB:", newUser);
    res.status(200).json({ message: 'Login successful and stored in DB' });
  } catch (err) {
    console.error("❌ Save Error:", err);
    res.status(500).json({ error: 'Failed to store login' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
