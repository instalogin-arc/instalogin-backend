const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Atlas connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Serve frontend homepage
// Optional welcome message
app.get('/', (req, res) => {
  res.send('Backend is running');
});


// ✅ Login Route - Save to MongoDB
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

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
