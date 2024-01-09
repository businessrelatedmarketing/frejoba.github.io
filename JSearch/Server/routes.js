const router = require("express").Router();
const linkedIn = require("./apis/linkedin/linkedin_jobs_api");
const pool = require("./db/db");
const stringSimilarity = require("string-similarity");

// Function to calculate similarity score
function calculateSimilarity(jobOpening, searchQuery) {
  const titleSimilarity = stringSimilarity.compareTwoStrings(
    jobOpening["title"].toLowerCase(),
    searchQuery.toLowerCase()
  );
  const descriptionSimilarity = stringSimilarity.compareTwoStrings(
    jobOpening["description"].toLowerCase(),
    searchQuery.toLowerCase()
  );
  const locationSimilarity = stringSimilarity.compareTwoStrings(
    jobOpening["Location"].toLowerCase(),
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
    var { keyword, company, location, limit } = req.body;

    let values = [];

    let query = `
      SELECT
        j.JobId,
        j.JobUrl,
        j.Title,
        j.Description,
        j.DatePostedOn,
        j.Source,
        j.Location,
        j.LocationType,
        j.JobType,
        j.RemoteFilter,
        j.ExperienceLevel,
        j.TimeAgo,
        c.CompanyId,
        c.CompanyName
      FROM
        Job_Openings j
      INNER JOIN
        Company c ON j.CompanyId = c.CompanyId
      WHERE
        c.CompanyName = $1`;

    values.push(company);

    if (location !== "") {
      query += ` AND j.Location = $2`;
      values.push(location);
    }

    if (limit !== "") {
      query += ` LIMIT $` + (values.length + 1).toLocaleString() + `;`;
      values.push(limit);
    }
    // let jobOpenings = await queryJobOpeningTable(docClient, params, limit);
    let jobOpenings = (await pool.query(query, values)).rows;

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

router.post("/links/liq", async (req, res) => {
  try {
    const { companyName } = req.body;
    const query = `
      SELECT
        liq.QId,
        liq.DiscussionLinks,
        liq.Title,
        liq.Difficulty,
        liq.Solutions,
        liq.Video,
        liq.Tag,
        c.CompanyId,
        c.CompanyName
      FROM
        Leetcode_Interview_Questions liq
      INNER JOIN
        Company c ON liq.CompanyId = c.CompanyId
      WHERE c.CompanyName = $1;
    `;

    let liq_links = (await pool.query(query, [companyName])).rows;

    res.json({ isSuccessful: true, result: liq_links, errMsg: "" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccessful: false, result: null, errMsg: error });
  }
});

router.post("/links/iq", async (req, res) => {
  try {
    const { companyName, type, limit } = req.body;

    const query = `
      SELECT
        ll.LLId,
        ll.Title,
        ll.Discussion_Link,
        ll.Views,
        ll.Type,
        ll.Upvotes,
        ll.Tags,
        c.CompanyId,
        c.CompanyName
      FROM
        Leetcode_Links ll
      INNER JOIN
        Company c ON ll.CompanyId = c.CompanyId 
      WHERE c.CompanyName = $1 AND ll.Type = 'IQ';
    `;

    let iq_links = (await pool.query(query, [companyName])).rows;

    res.json({ isSuccessful: true, result: iq_links, errMsg: "" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccessful: false, result: null, errMsg: error });
  }
});

router.post("/links/sd", async (req, res) => {
  try {
    const { companyName } = req.body;

    const query_lc = `
      SELECT
        ll.LLId,
        ll.Title,
        ll.Discussion_Link,
        ll.Views,
        ll.Type,
        ll.Upvotes,
        ll.Tags,
        c.CompanyId,
        c.CompanyName
      FROM
        Leetcode_Links ll
      INNER JOIN
        Company c ON ll.CompanyId = c.CompanyId 
      WHERE c.CompanyName = $1 AND ll.Type = 'SD';
    `;

    const query_b = `
      SELECT
        bl.BLId,
        bl.Title,
        bl.Discussion_Link,
        bl.Views,
        bl.Type,
        bl.Description,
        bl.Likes,
        bl.Comments,
        c.CompanyId,
        c.CompanyName
      FROM
        Blind_Links bl
      INNER JOIN
        Company c ON bl.CompanyId = c.CompanyId 
      WHERE c.CompanyName = $1 AND b1.Type = 'SD';
    `;

    let sd_lc_links = (await pool.query(query_lc, [companyName])).rows;
    let sd_b_links = (await pool.query(query_b, [companyName])).rows;

    let sd_links = sd_lc_links.concat(sd_b_links);

    res.json({ isSuccessful: true, result: sd_links, errMsg: "" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccessful: false, result: null, errMsg: error });
  }
});

router.post("/links/ie", async (req, res) => {
  try {
    const { companyName, type, limit } = req.body;

    const query_lc = `
      SELECT
        ll.LLId,
        ll.Title,
        ll.Discussion_Link,
        ll.Views,
        ll.Type,
        ll.Upvotes,
        ll.Tags,
        c.CompanyId,
        c.CompanyName
      FROM
        Leetcode_Links ll
      INNER JOIN
        Company c ON ll.CompanyId = c.CompanyId 
      WHERE c.CompanyName = $1 AND ll.Type = 'IE';
    `;

    const query_b = `
      SELECT
        bl.BLId,
        bl.Title,
        bl.Discussion_Link,
        bl.Views,
        bl.Type,
        bl.Description,
        bl.Likes,
        bl.Comments,
        c.CompanyId,
        c.CompanyName
      FROM
        Blind_Links bl
      INNER JOIN
        Company c ON bl.CompanyId = c.CompanyId 
      WHERE c.CompanyName = $1 AND b1.Type = 'IE';
    `;

    let ie_lc_links = (await pool.query(query_lc, [companyName])).rows;
    let ie_b_links = (await pool.query(query_b, [companyName])).rows;

    let ie_links = ie_lc_links.concat(ie_b_links);

    res.json({ isSuccessful: true, result: ie_links, errMsg: "" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccessful: false, result: null, errMsg: error });
  }
});

router.post("/links/c", async (req, res) => {
  try {
    const { companyName } = req.body;

    const query = `
      SELECT
        bl.BLId,
        bl.Title,
        bl.Discussion_Link,
        bl.Views,
        bl.Type,
        bl.Description,
        bl.Likes,
        bl.Comments,
        c.CompanyId,
        c.CompanyName
      FROM
        Blind_Links bl
      INNER JOIN
        Company c ON bl.CompanyId = c.CompanyId 
      WHERE c.CompanyName = $1 AND b1.Type = 'C';
    `;

    let bc_links = (await pool.query(query, [companyName])).rows;

    res.json({ isSuccessful: true, result: bc_links, errMsg: "" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccessful: false, result: null, errMsg: error });
  }
});

module.exports = router;
