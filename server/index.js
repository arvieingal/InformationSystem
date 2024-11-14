const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./models");
const userRoutes = require("./routes/user"); // Import user routes
const otpRoutes = require("./routes/otp"); // Import OTP routes
const childrenRoutes = require("./routes/children"); // Import children routes
const childImmunizationRoutes = require("./routes/childImmunizationRecord"); // Import child immunization routes
const vaccineDoseRoutes = require("./routes/vaccineDose"); // Import vaccine dose routes
const families = require("./routes/families"); // Import vaccine dose routes
const familyMembers = require("./routes/familyMembers"); // Import vaccine dose routes
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use("/api", userRoutes); // Use user routes with /api prefix
app.use("/api", otpRoutes); // Use OTP routes with /api prefix
app.use("/api", childrenRoutes);
app.use("/api", childImmunizationRoutes); // Use child immunization routes with /api prefix
app.use("/api", vaccineDoseRoutes); // Use vaccine dose routes with /api prefix
app.use("/api", families); // Use vaccine dose routes with /api prefix
app.use("/api", familyMembers); // Use vaccine dose routes with /api prefix
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
