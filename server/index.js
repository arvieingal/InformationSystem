const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./models");
const userRoutes = require("./routes/user"); 
const otpRoutes = require("./routes/otp"); 
const childrenRoutes = require("./routes/children"); 
const childImmunizationRoutes = require("./routes/childImmunizationRecord"); 
const logRoutes = require('./routes/log');
const householdHead = require("./routes/householdHead"); 
const householdMember = require("./routes/householdMember"); 
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use("/api", userRoutes); 
app.use("/api", otpRoutes); 
app.use("/api", childrenRoutes);
app.use("/api", childImmunizationRoutes); 
app.use('/api', logRoutes);
app.use("/api", householdHead); 
app.use("/api", householdMember); 
const initApp = async () => {
  console.log("Testing the database connection...");

  try {
    await db.sequelize.authenticate();
    console.log("Connection has been established successfully.");

    app.listen(PORT, () => {
      console.log(`Running at port: ${PORT}`);
    });
  } catch (error) {
    console.log("Unable to connect to the database:", error);
  }
};

initApp();
