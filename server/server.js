import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const sessionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  score: Number,
  correct: Number,
  incorrect: Number,
  duration: Number,
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Session = mongoose.model('Session', sessionSchema);

const JWT_SECRET = 'change_this_secret';

app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });
  res.json({ id: user._id });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: 'Invalid' });
  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  res.json({ token });
});

app.use(async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).end();
  try {
    const { id } = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    req.user = await User.findById(id);
    next();
  } catch {
    res.status(401).end();
  }
});

app.post('/api/session', async (req, res) => {
  const { score, correct, incorrect, duration } = req.body;
  const session = await Session.create({
    userId: req.user._id,
    score,
    correct,
    incorrect,
    duration
  });
  res.json(session);
});

app.get('/api/session', async (req, res) => {
  const sessions = await Session.find({ userId: req.user._id }).sort({ date: 1 });
  res.json(sessions);
});

const PORT = process.env.PORT || 3001;
const MONGO = process.env.MONGO || 'mongodb://localhost/mentalspeed';

mongoose.connect(MONGO).then(() => {
  app.listen(PORT, () => console.log('Server running on', PORT));
});
