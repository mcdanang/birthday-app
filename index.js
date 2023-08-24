require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { birthdayTask } = require("./scheduler/birthdayScheduler");
const app = express();
const port = 3000;

app.use(bodyParser.json());

// API routes
app.use("/user", require("./routes/userRouter"));

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

birthdayTask.start();
