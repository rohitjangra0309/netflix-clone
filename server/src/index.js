const express = require('express');
const connectDB = require('./DB/config');
const dotenv = require('dotenv');
const cors = require('cors');
const userRouter = require('./Routes/UserRoutes');
const movieRouter = require('./Routes/MoviesRoutes')

dotenv.config()

// Connect to the database
connectDB();

const PORT = process.env.PORT;
const app = express();

app.use(cors()); // Enable CORS for all routes

// Body parser middleware
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads

app.get("/", (req, res) => res.send("Working!!!"));

// Routes
app.use('/api', userRouter);
app.use('/api', movieRouter)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

