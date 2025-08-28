require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const { connectDB } = require('./config/db');
const scheduleRoutes = require('./routes/schedule');
const { errorHandler } = require('./middlewares/errorHandler');


const app = express();
const corsOptions = {
  origin: [`${process.env.NODE_CLIENT_URL}`],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); // set cookie-parser


connectDB();


app.use('/schedule', scheduleRoutes);
// app.use('/api/budget', budgetRoutes);
// app.use('/api/exam', examRoutes);
// app.use('/api/planner', plannerRoutes);


app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));


app.get("/", (req, res) => {
  res.send("Hello world from  mongoose server ..");
});