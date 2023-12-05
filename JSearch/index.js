const express = require("express");
const bodyParser = require("body-parser");
const linkedIn = require("./apis/linkedin_jobs_api");
const cp_jobs_api = require("./apis/cp_jobs_api");
const cp_job_description_api = require("./apis/cp_job_description_api");
const linkedin_job_description_api = require("./apis/linkedin_jobs_api");

const app = express();
const port = 1234; // Change to the desired port

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Linkedin Jobs List
app.get("/linkedin-jobs", async (req, res) => {
  try {
    const {
      keyword,
      location,
      dateSincePosted,
      jobType,
      remoteFilter,
      salary,
      experienceLevel,
      limit,
    } = req.body;

    const queryObject = {
      keyword,
      location,
      dateSincePosted,
      jobType,
      remoteFilter,
      salary,
      experienceLevel,
      limit,
    };

    const jobs = await linkedIn.query(queryObject);
    res.json({ isSuccessful: true, result: jobs, errMsg: "" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccessful: false, result: null, errMsg: error });
  }
});


// Linkedin Job Description
app.get("/linkedin-job-description", async (req, res) => {
  try {
    const {
      url
    } = req.body;

    const jd = await linkedin_job_description_api.query(url);
    res.json({ isSuccessful: true, result: jd, errMsg: "" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccessful: false, result: null, errMsg: error });
  }
});


// Career Page Jobs
app.get("/cp-jobs", async (req, res) => {
  try {
    const {
      keyword,
      location,
      dateSincePosted,
      jobType,
      remoteFilter,
      salary,
      experienceLevel,
      limit,
    } = req.body;

    const queryObject = {
      keyword,
      location,
      dateSincePosted,
      jobType,
      remoteFilter,
      salary,
      experienceLevel,
      limit,
    };

    const jobs = await cp_jobs_api.query(queryObject);
    res.json({ isSuccessful: true, result: jobs, errMsg: "" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccessful: false, result: null, errMsg: error });
  }
});

// Career Page Job Description
app.get("/cp-job-description", async (req, res) => {
  try {
    const {
      url
    } = req.body;

    const jd = await cp_job_description_api.query(url);
    res.json({ isSuccessful: true, result: jd, errMsg: "" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccessful: false, result: null, errMsg: error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
