const cheerio = require("cheerio");
const axios = require("axios");

module.exports.query = (jobUrl) => {
  const query = new Query(jobUrl);
  return query.getJobDescription();
};

//transfers object values passed to our .query to an obj we can access
function Query(jobUrl) {
  this.jobUrl = jobUrl;
}

Query.prototype.url = function () {
  return encodeURI(this.jobUrl);
};

Query.prototype.getJobDescription = async function () {
  //fetch our data using our url
  const { data } = await axios.get(this.url());

  // Parse the HTML string
  const $ = cheerio.load(data);

  //get JD HTML
  const jobDescription = $(".show-more-less-html__markup").toString();

  return jobDescription;
};
