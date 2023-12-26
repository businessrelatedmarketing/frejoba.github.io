const router = require("express").Router();
const linkedIn = require("./apis/linkedin/linkedin_jobs_api");
const linkedin_job_description_api = require("./apis/linkedin/linkedin_job_description_api");
const cp_jobs_api = require("./apis/careerpage/cp_jobs_api");
const cp_job_description_api = require("./apis/careerpage/cp_job_description_api");

// Linkedin Jobs List
router.post("/linkedin-jobs", async (req, res) => {
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
    res.status(500).json({ isSuccessful: false, result: null, errMsg: error });
  }
});

// Linkedin Job Description
router.post("/linkedin-job-description", async (req, res) => {
  try {
    const { jobUrl } = req.body;

    const jd = await linkedin_job_description_api.query(jobUrl);
    res.json({ isSuccessful: true, result: jd, errMsg: "" });
  } catch (error) {
    res.status(500).json({ isSuccessful: false, result: null, errMsg: error });
  }
});

// Career Page Jobs
router.post("/cp-jobs", async (req, res) => {
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
    res.status(500).json({ isSuccessful: false, result: null, errMsg: error });
  }
});

// Career Page Job Description
router.post("/cp-job-description", async (req, res) => {
  try {
    const { jobUrl } = req.body;

    const jd = await cp_job_description_api.query(jobUrl);
    res.json({ isSuccessful: true, result: jd, errMsg: "" });
  } catch (error) {
    res.status(500).json({ isSuccessful: false, result: null, errMsg: error });
  }
});

module.exports = router;
