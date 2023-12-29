const router = require("express").Router();
const linkedIn = require("./apis/linkedin/linkedin_jobs_api");
const { docClient, queryJobOpeningTable, queryCDLTable } = require("./db/db");
const stringSimilarity = require("string-similarity");

// Function to calculate similarity score
function calculateSimilarity(jobOpening, searchQuery) {
  const titleSimilarity = stringSimilarity.compareTwoStrings(
    jobOpening.Title.toLowerCase(),
    searchQuery.toLowerCase()
  );
  const descriptionSimilarity = stringSimilarity.compareTwoStrings(
    jobOpening.Description.toLowerCase(),
    searchQuery.toLowerCase()
  );
  const locationSimilarity = stringSimilarity.compareTwoStrings(
    jobOpening.Location.toLowerCase(),
    searchQuery.toLowerCase()
  );

  // Use a weighted average or other logic to calculate an overall similarity score
  const overallSimilarity =
    (titleSimilarity + descriptionSimilarity + locationSimilarity) / 3;

  return overallSimilarity;
}

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

// Job Data From DB
router.post("/jobs", async (req, res) => {
  try {
    const {
      keyword,
      company,
      location,
      dateSincePosted,
      jobType,
      remoteFilter,
      salary,
      experienceLevel,
      limit,
    } = req.body;

    let params = {
      company: company,
      location: location,
      dateSincePosted: dateSincePosted,
      jobType: jobType,
      remoteFilter: remoteFilter,
      experienceLevel: experienceLevel,
    };

    let jobOpenings = await queryJobOpeningTable(docClient, params, limit);

    // Sort job openings based on similarity score
    const sortedJobOpenings = jobOpenings.sort((a, b) => {
      const similarityA = calculateSimilarity(a, keyword + " " + location);
      const similarityB = calculateSimilarity(b, keyword + " " + location);

      // Sort in descending order of similarity
      return similarityB - similarityA;
    });

    res.json({ isSuccessful: true, result: sortedJobOpenings, errMsg: "" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccessful: false, result: null, errMsg: error });
  }
});

// Job Data From DB
router.post("/discussionLinks", async (req, res) => {
  try {
    const { companyName, type, limit } = req.body;

    let discussionLinks = await queryCDLTable(
      docClient,
      companyName,
      type,
      limit
    );

    res.json({ isSuccessful: true, result: discussionLinks, errMsg: "" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccessful: false, result: null, errMsg: error });
  }
});

module.exports = router;
