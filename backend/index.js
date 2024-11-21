const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./config/db");
const otpRoutes = require("./routes/otp");
const userRoutes = require("./routes/userRouters");
const childrenRoutes = require('./routes/childrenRoutes');
const childImmunizationRecordRoutes = require('./routes/childImmunizationRecordRoutes');


const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use("/api", otpRoutes);
app.use("/api", userRoutes);
app.use('/api', childrenRoutes);
app.use('/api', childImmunizationRecordRoutes);


const initApp = async () => {
  console.log("Testing the database connection...");

  try {
    await pool.query("SELECT 1");
    console.log("Database connected successfully.");
    app.listen(PORT, () => {
      console.log(`Running at port: ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

initApp();
