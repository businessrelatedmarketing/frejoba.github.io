// const api_server_domain = "https://mailserver.crezalo.com/cmcs/";
const api_server_domain = "http://localhost:1234/";

const TAG_ACTIVE_CLASS = "tag--active";
const SEARCH_HIDDEN_CLASS = "search--hidden";
const CLOSE_TAG_CLASS = "close-tag";
const TAG_CLASS = "tag";

const parser = new DOMParser();

/* Storing user's device details in a variable*/
let details = navigator.userAgent;

/* Creating a regular expression  
containing some mobile devices keywords  
to search it in details string*/
let regexp = /android|iphone|kindle|ipad/i;

/* Using test() method to search regexp in details 
it returns boolean value*/
let isMobileDevice = regexp.test(details);

let loaderDiv = document.querySelector(".svgLoader")?.outerHTML;
let url = location.href;
let urlcompany = "";
if (url.includes("company")) {
  urlcompany = url.split("company=")[1];
  document.getElementsByClassName("company")[0].value = urlcompany;
}

console.log(url);

//////////////////////////// Mobile UX Update ////////////////////////////
function updateMobileUX() {
  if (isMobileDevice === true) {
    let slider_container = document.querySelector(".slider-container");
    slider_container.style.visibility = "hidden";
    slider_container.style.padding = 0;

    let sidenav_company_container = document.querySelector(
      ".sidenav-company-container"
    );
    sidenav_company_container.className = "";

    let mobile_company_button = document.querySelector(
      ".mobile-company-nav-div"
    );
    mobile_company_button.className = "mobile-company-nav-div-show";

    let company_links_container = document.querySelector(
      ".company-links-container"
    );
    company_links_container.className = "company-links-container-hide";

    let jobs = document.querySelector(".jobs");
    jobs.classList.add("jobs_mobile");

    let keywords = document.querySelector(".keywords");
    keywords?.classList.add("text-search-input-box-mobile");

    let location = document.querySelector(".location");
    location?.classList.add("text-search-input-box-mobile");

    let company = document.querySelector(".company");
    company?.classList.add("text-search-input-box-mobile");

    let slides = document.querySelectorAll(".slide");
    for (let i = 0; i < slides.length; i++) {
      slides[i]?.classList.add("slide-mobile");
    }
  } else {
    sideNotification();
  }
}

/////////////////////////////// Global Variables /////////////////////////////////////////////////
let jobsListings = [];
let liq = [];
let iq = [];
let sd = [];
let ie = [];
let c = [];

/////////////////////////////////////// APIs ///////////////////////////////////////////
///////////////////// Linkedin Job Lists/////////////////////
async function lk_jobs_list(
  searchInputData = {
    keyword: "software engineer",
    location: "India",
    company: "",
    dateSincePosted: "past month",
    jobType: "",
    remoteFilter: "",
    salary: "",
    experienceLevel: "entry level",
    limit: "25",
  }
) {
  // Define the request body
  let requestBody = {
    keyword: searchInputData.keyword + " " + searchInputData.company,
    location: searchInputData.location,
    company: searchInputData.company,
    dateSincePosted: searchInputData.dateSincePosted,
    jobType: searchInputData.jobType,
    remoteFilter: searchInputData.remoteFilter,
    salary: searchInputData.salary,
    experienceLevel: searchInputData.experienceLevel,
    limit: searchInputData.limit,
  };

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS",
  };

  try {
    const response = await fetch(api_server_domain + "linkedin-jobs", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    if (searchInputData?.company != "") {
      let companyReducedResult = [];
      for (let i = 0; i < result["result"].length; i++) {
        if (result["result"][i].company.includes(searchInputData.company)) {
          companyReducedResult.push(result["result"][i]);
        }
      }
      jobsListings = companyReducedResult;
    } else {
      jobsListings = result["result"];
    }
  } catch (error) {
    console.error("Error during fetch:", error);
    // Handle errors, e.g., display an error message to the user
  }
}

///////////////////// Linkedin Job Descriptions/////////////////////
// async function lk_job_description(jobUrl) {
//   // Define the request body
//   let requestBody = {
//     jobUrl: jobUrl.split("?")[0],
//   };

//   const headers = {
//     "Content-Type": "application/json",
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS",
//   };

//   try {
//     const response = await fetch(
//       api_server_domain + "linkedin-job-description",
//       {
//         method: "POST",
//         headers: headers,
//         body: JSON.stringify(requestBody),
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     const result = await response.json();
//     jobsDescription = result["result"];
//     return jobsDescription;
//   } catch (error) {
//     console.error("Error during fetch:", error);
//     // Handle errors, e.g., display an error message to the user
//   }
// }

///////////////////// DB Jobs /////////////////////
async function jobs(keyword, company, location) {
  // Define the request body
  let requestBody = {
    keyword: keyword,
    company: company,
    location: location,
    // limit: "50"
  };

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS",
  };

  try {
    const response = await fetch(api_server_domain + "links/liq", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    liq = result["result"];
    return liq;
  } catch (error) {
    console.error("Error during fetch:", error);
    // Handle errors, e.g., display an error message to the user
  }
}

///////////////////// LIQ /////////////////////
async function leetcode_interview_questions(companyName) {
  // Define the request body
  let requestBody = {
    companyName: companyName,
  };

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS",
  };

  try {
    const response = await fetch(api_server_domain + "links/liq", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    liq = result["result"];
    return liq;
  } catch (error) {
    console.error("Error during fetch:", error);
    // Handle errors, e.g., display an error message to the user
  }
}

///////////////////// IQ /////////////////////
async function interview_questions(companyName) {
  // Define the request body
  let requestBody = {
    companyName: companyName,
  };

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS",
  };

  try {
    const response = await fetch(api_server_domain + "links/iq", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    iq = result["result"];
    return iq;
  } catch (error) {
    console.error("Error during fetch:", error);
    // Handle errors, e.g., display an error message to the user
  }
}

///////////////////// SD /////////////////////
async function salary_discussion(companyName) {
  // Define the request body
  let requestBody = {
    companyName: companyName,
  };

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS",
  };

  try {
    const response = await fetch(api_server_domain + "links/sd", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    sd = result["result"];
    return sd;
  } catch (error) {
    console.error("Error during fetch:", error);
    // Handle errors, e.g., display an error message to the user
  }
}

///////////////////// IE /////////////////////
async function interview_experience(companyName) {
  // Define the request body
  let requestBody = {
    companyName: companyName,
  };

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS",
  };

  try {
    const response = await fetch(api_server_domain + "links/ie", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    ie = result["result"];
    return ie;
  } catch (error) {
    console.error("Error during fetch:", error);
    // Handle errors, e.g., display an error message to the user
  }
}

///////////////////// C /////////////////////
async function culture(companyName) {
  // Define the request body
  let requestBody = {
    companyName: companyName,
  };

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS",
  };

  try {
    const response = await fetch(api_server_domain + "links/c", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    c = result["result"];
    return c;
  } catch (error) {
    console.error("Error during fetch:", error);
    // Handle errors, e.g., display an error message to the user
  }
}

///////////////////////////////// Utility Function /////////////////////////////////////

function getTagHTML(tag, tagClasses) {
  return `<span class="${tagClasses}">
                ${tag}
            </span>`;
}

function getHostnameFromRegex(url) {
  // run against regex
  const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  // extract hostname (will be null if no match is found)
  return matches && matches[1];
}

function getSearchInputData() {
  var searchInputData = {
    keyword: "software engineer",
    location: "India",
    company: "",
    dateSincePosted: "past month",
    jobType: "",
    remoteFilter: "",
    salary: "",
    experienceLevel: "entry level",
    limit: "100",
  };

  searchInputData.keyword =
    document.getElementsByClassName("keywords")[0].value;
  searchInputData.location =
    document.getElementsByClassName("location")[0].value;
  searchInputData.company = document.getElementsByClassName("company")[0].value;
  searchInputData.jobType = document.getElementById("jobType").value;
  searchInputData.remoteFilter = document.getElementById("remoteFilter").value;
  searchInputData.experienceLevel =
    document.getElementById("experienceLevel").value;

  return searchInputData;
}

function toggleClass(el, className) {
  if (el.classList.contains(className)) {
    el.classList.remove(className);

    return;
  }

  el.classList.add(className);
}

function getSearchBarTags(tagValue, searchContentEl) {
  let searchBarTags = Array.from(searchContentEl.children)
    .map((node) => node.innerHTML && node.innerHTML.trim())
    .filter((tag) => !!tag);

  if (searchBarTags.includes(tagValue)) {
    searchBarTags = searchBarTags.filter((tag) => tag !== tagValue);
  } else {
    searchBarTags = [...searchBarTags, tagValue];
  }

  return searchBarTags;
}

function displaySearchWrapper(display = false) {
  const searchWrapper = document.getElementById("search");

  if (display) {
    searchWrapper.classList.remove(SEARCH_HIDDEN_CLASS);

    return;
  }

  searchWrapper.classList.add(SEARCH_HIDDEN_CLASS);
}

function setSearchbarContent(searchContentEl, tags) {
  searchContentEl.innerHTML = tags.reduce((acc, currentTag) => {
    return acc + getTagHTML(currentTag, CLOSE_TAG_CLASS);
  }, "");
}

function resetState(searchContentEl) {
  searchContentEl.innerHTML = "";

  setJobsListings();
  displaySearchWrapper(false);
  toggleClass(targetEl, TAG_ACTIVE_CLASS);
}

window.addEventListener("click", (event) => {
  const targetEl = event.target;
  const targetText = targetEl.innerHTML.trim();
  const searchContentEl = document.getElementById("search-content");
  const searchBarTags = getSearchBarTags(targetText, searchContentEl);

  if (targetEl.id === "clear" || !searchBarTags.length) {
    resetState(searchContentEl);

    return;
  }

  if (
    ![TAG_CLASS, CLOSE_TAG_CLASS].some((c) => targetEl.classList.contains(c))
  ) {
    return;
  }

  setSearchbarContent(searchContentEl, searchBarTags);
  toggleClass(targetEl, TAG_ACTIVE_CLASS);
  displaySearchWrapper(searchBarTags.length > 0);
  setJobsListings(searchBarTags);
});

function getSolutionLink(solution) {
  if (solution === null) {
    return null;
  }

  const match = solution.match(/\[Solution\]\((.*?)\)/);
  if (match && match.length > 1) {
    return `<a href="${match[1]}">Solution</a>`;
  } else {
    return "";
  }
}

//////////////////////////// Job Listings ////////////////////////////

function getJobListingHTML(jobData, filterTags = []) {
  const JOB_TAGS_PLACEHOLDER = "###JOB_TAGS###";
  let domain = getHostnameFromRegex(jobData?.jobUrl);
  let jobListingHTML = `
      <div class="jobs__item">
        <a href="${jobData.jobUrl}" target="_blank">
          <div class="jobs__column jobs__column--left">
            <img src="${jobData.companyLogo}" alt="${
    jobData.company
  }" class="jobs__img" />
            <div class="jobs__info">
                <span class="jobs__company">${jobData.company}</span>
                <span class="jobs__title">${jobData.position}</span>
                <ul class="jobs__details">
                  ${
                    jobData.agoTime
                      ? `<li class="jobs__details-item">${jobData.agoTime}</li>`
                      : ""
                  }
                  ${
                    jobData.salary
                      ? `<li class="jobs__details-item">${jobData.salary}</li>`
                      : ""
                  }
                  ${
                    jobData.location
                      ? `<li class="jobs__details-item">${jobData.location}</li>`
                      : ""
                  }
                </ul>
                <br/>
                <span class="jobs__details">${domain}</span>
            </div>
          </div>
        </a>
        <div class="jobs__column jobs__column--right">
            ${JOB_TAGS_PLACEHOLDER}
        </div>
      </div>
      </a>
      <div class="modal-container" id="modal-opened-${jobData.id}">
        <div class="modal_c">
          <div class="job-description"></div>
          <div class="loader"><div class="lds-dual-ring" id="lds-dual-ring-${
            jobData.id
          }"></div></div>
          <button class="modal__btn" type="button"><a href="${
            jobData.jobUrl
          }" target="_blank">Apply &rarr;</a></button>
          <a href="#modal-closed-${
            jobData.id
          }" class="link-2" aria-label="Job Description"></a>
        </div>
      </div>
    `;

  const tagsList = [...(jobData.languages || []), ...(jobData.tools || [])];
  const tagsListLowercase = tagsList.map((t) => t && t.toLowerCase());
  const passesFilter =
    !filterTags.length ||
    filterTags.every((tag) =>
      tagsListLowercase.includes(tag && tag.toLowerCase())
    );

  if (!passesFilter) {
    return "";
  }

  const tagsString = tagsList.reduce((acc, currentTag) => {
    const activeClass =
      (filterTags.includes(currentTag) && TAG_ACTIVE_CLASS) || "";

    return acc + getTagHTML(currentTag, `${TAG_CLASS} ${activeClass}`);
  }, "");

  return jobListingHTML.replace(JOB_TAGS_PLACEHOLDER, tagsString);
}

// async function updateJobDescription(jobId) {
//   try {
//     jobsListings[jobId]["Description"] = await lk_job_description(
//       jobsListings[jobId]["jobUrl"]
//     );
//     document.querySelector(
//       `#modal-opened-${jobsListings[jobId].id} .job-description`
//     ).innerHTML = jobsListings[jobId]["Description"];
//     document.querySelector("#lds-dual-ring-" + jobId).style.visibility =
//       "hidden";
//   } catch (error) {
//     console.error(error);
//     jobsListings[jobId]["Description"] = "";

//     document.querySelector(
//       `#modal-opened-${jobsListings[jobId].id} .job-description`
//     ).textContent = "Refer Apply Page for Job Description";
//     document.querySelector("#lds-dual-ring-" + jobId).style.visibility =
//       "hidden";
//   }
// }

async function setJobsListings(searchInputData, filterTags) {
  document.getElementById("jobs").innerHTML = loaderDiv;
  document.getElementById("jobListDisclaimer").textContent = "";
  await lk_jobs_list(searchInputData);
  if (jobsListings.length == 0) {
    await lk_jobs_list(searchInputData);
    if (jobsListings.length == 0) {
      await lk_jobs_list(searchInputData);
    }
  }
  let jobsListingsHTML;
  if (jobsListings.length == 0) {
    jobsListingsHTML = document.createElement("img");
    jobsListingsHTML.src = "./img/NoResultFound.png";
    jobsListingsHTML.alt = "na";
    jobsListingsHTML.height = isMobileDevice ? "300" : "500";
    jobsListingsHTML.width = isMobileDevice ? "300" : "500";
    document.getElementById("jobs").innerHTML = "<h1>No Jobs Found ☹️</h1>";
    document.getElementById("jobs").appendChild(jobsListingsHTML);
    document.getElementById("jobListDisclaimer").textContent =
      "*Not satisfied? Customize your search with keywords, location, company, and more for better results!";
  } else {
    jobsListingsHTML = jobsListings.reduce((acc, currentListing) => {
      return acc + getJobListingHTML(currentListing, filterTags);
    }, "");

    document.getElementById("jobs").innerHTML = jobsListingsHTML;
    document.getElementById("jobListDisclaimer").textContent =
      "*Not satisfied? Customize your search with keywords, location, company, and more for better results!";
  }
}

///////////////////////////////////// 2 Equivalent Parent Level Functions that trigger Job Search ///////////////////////////////////////////////
function getJobsData() {
  var searchInputData = getSearchInputData();
  setJobsListings(searchInputData, []);

  let companyName = searchInputData?.company.toLowerCase();
  companyVerticalHeader = document.querySelector(".company-links-container");
  if (companyName) {
    populate_liq_table();
    displayInterviewExperiences(companyName);
    displaySalaryDiscussion(companyName);
    displayCulture(companyName);

    setTimeout(() => {
      companyVerticalHeader.classList.remove("hide");
    }, 500);
  } else {
    companyVerticalHeader.classList.add("hide");
  }

  openVertical("job-listings");

  gaTrackJSearchEvent(searchInputData);
}

function jobList(company) {
  closeNav();
  document.getElementsByClassName("company")[0].value = company;
  var searchInputData = getSearchInputData();
  searchInputData.company = company;
  searchInputData.dateSincePosted = "past month";
  searchInputData.limit = "100";
  setJobsListings(searchInputData, []);

  // populate data for each vertical
  populate_liq_table();
  displayInterviewExperiences(company.toLowerCase());
  displaySalaryDiscussion(company.toLowerCase());
  displayCulture(company.toLowerCase());

  // make visible vertical header
  companyVerticalHeader = document.querySelector(".company-links-container");

  setTimeout(() => {
    companyVerticalHeader.classList.remove("hide");
  }, 500);

  openVertical("job-listings");

  // Google Analytics
  gaTrackCompanyClickEvent(company);
}

//////////////////////////// LeetCode Interview Questions Vertical Data Populate //////////////////////////////////////////////

async function populate_liq_table() {
  // prepare Tabs
  $("document").ready(function () {
    $(".tab-slider--body").hide();
    $(".tab-slider--body:first").show();
  });

  $(".tab-slider--nav li").click(function () {
    $(".tab-slider--body").hide();
    var activeTab = $(this).attr("rel");
    $("#" + activeTab).fadeIn();
    if ($(this).attr("rel") == "interview-questions-tab2") {
      $(".tab-slider--tabs").addClass("slide-iq");
    } else {
      $(".tab-slider--tabs").removeClass("slide-iq");
    }
    $(".tab-slider--nav li").removeClass("active");
    $(this).addClass("active");
  });

  const companyName = getSearchInputData()?.company.toLowerCase();
  const data = await leetcode_interview_questions(companyName);
  const data_links = await interview_questions(companyName);
  if (data.length > 0 || data_links.length > 0) {
    document.querySelector("#interviewQuestions_chip").classList.remove("hide");
    populateTable(data);
    populateIQLinks(data_links);
  } else {
    document.querySelector("#interviewQuestions_chip").classList.add("hide");
  }
}

function populateTable(data) {
  const tableBody = $("#liq_tableBody");

  // Remove existing rows
  tableBody.empty();

  data.forEach((item) => {
    const row = $("<tr>");
    row.append($("<td>").text(item.difficulty));
    row.append(
      $("<td>").html(
        `<a href="${item.discussionlinks}" target="_blank">${item.title}</a>`
      )
    );
    row.append($("<td>").html(getSolutionLink(item.solutions)));
    row.append($("<td>").text(item.video));
    row.append($("<td>").text(item.tag));
    tableBody.append(row);
  });
}

function populateIQLinks(data_links) {
  const container = document.querySelector("#interview-questions-tab2");

  // Clear existing content
  container.innerHTML = "";

  // Create HTML elements for each experience
  data_links.forEach((experience) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.textContent = experience.title;

    const link = document.createElement("a");
    link.href = experience.discussion_link;
    link.target = "_blank";
    link.textContent = "Discussion Link";

    const views = document.createElement("p");
    views.textContent = `Views: ${experience.views}`;

    const upvotes = document.createElement("p");
    upvotes.textContent = `Upvotes: ${experience.upvotes}`;

    const tags = document.createElement("p");
    tags.textContent = `Tags: ${experience.tags}`;

    cardBody.appendChild(title);
    cardBody.appendChild(link);
    cardBody.appendChild(views);
    cardBody.appendChild(upvotes);
    cardBody.appendChild(tags);

    card.appendChild(cardBody);

    container.appendChild(card);
  });
}

/////////////////////////////// Interview Experience Data Display ////////////////////////////////////////////
async function displayInterviewExperiences(companyName) {
  const experiences = await interview_experience(companyName);
  if (experiences.length > 0) {
    document
      .querySelector("#interview-experience_chip")
      .classList.remove("hide");
    const container = document.querySelector(".interview-experience-links");

    // Clear existing content
    container.innerHTML = "";

    // Create HTML elements for each experience
    experiences.forEach((experience) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      const title = document.createElement("h5");
      title.classList.add("card-title");
      title.textContent = experience.title;

      const link = document.createElement("a");
      link.href = experience.discussion_link;
      link.target = "_blank";
      link.textContent = "Discussion Link";

      const views = document.createElement("p");
      views.textContent = `Views: ${experience.views}`;

      const upvotes = document.createElement("p");
      upvotes.textContent = `Upvotes: ${experience.upvotes}`;

      const tags = document.createElement("p");
      tags.textContent = `Tags: ${experience.tags}`;

      cardBody.appendChild(title);
      cardBody.appendChild(link);
      cardBody.appendChild(views);
      cardBody.appendChild(upvotes);
      cardBody.appendChild(tags);

      card.appendChild(cardBody);

      container.appendChild(card);
    });
  } else {
    document.querySelector("#interview-experience_chip").classList.add("hide");
  }
}

/////////////////////////////// Salary Discussion Data Display ////////////////////////////////////////////
async function displaySalaryDiscussion(companyName) {
  const experiences = await salary_discussion(companyName);
  if (experiences.length > 0) {
    document.querySelector("#salary-discussions_chip").classList.remove("hide");
    const container = document.querySelector(".salary-discussion-links");

    // Clear existing content
    container.innerHTML = "";

    // Create HTML elements for each experience
    experiences.forEach((experience) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      const title = document.createElement("h5");
      title.classList.add("card-title");
      title.textContent = experience.title;

      const link = document.createElement("a");
      link.href = experience.discussion_link;
      link.target = "_blank";
      link.textContent = "Discussion Link";

      const views = document.createElement("p");
      views.textContent = `Views: ${experience.views}`;

      const upvotes = document.createElement("p");
      upvotes.textContent = `Upvotes: ${experience.upvotes}`;

      const tags = document.createElement("p");
      tags.textContent = `Tags: ${experience.tags}`;

      cardBody.appendChild(title);
      cardBody.appendChild(link);
      cardBody.appendChild(views);
      cardBody.appendChild(upvotes);
      cardBody.appendChild(tags);

      card.appendChild(cardBody);

      container.appendChild(card);
    });
  } else {
    document.querySelector("#salary-discussions_chip").classList.add("hide");
  }
}

/////////////////////////////// Salary Discussion Data Display ////////////////////////////////////////////
async function displayCulture(companyName) {
  const experiences = await culture(companyName);
  if (experiences.length > 0) {
    document.querySelector("#culture_chip").classList.remove("hide");
    const container = document.querySelector(".culture-links");

    // Clear existing content
    container.innerHTML = "";

    // Create HTML elements for each experience
    experiences.forEach((experience) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      const title = document.createElement("h5");
      title.classList.add("card-title");
      title.textContent = experience.title;

      const link = document.createElement("a");
      link.href = experience.discussion_link;
      link.target = "_blank";
      link.textContent = "Discussion Link";

      const views = document.createElement("p");
      views.textContent = `Views: ${experience.views}`;

      const upvotes = document.createElement("p");
      upvotes.textContent = `Upvotes: ${experience.upvotes}`;

      const tags = document.createElement("p");
      tags.textContent = `Tags: ${experience.tags}`;

      cardBody.appendChild(title);
      cardBody.appendChild(link);
      cardBody.appendChild(views);
      cardBody.appendChild(upvotes);
      cardBody.appendChild(tags);

      card.appendChild(cardBody);

      container.appendChild(card);
    });
  } else {
    document.querySelector("#culture_chip").classList.add("hide");
  }
}

//////////////////////////// Toggle Verticals ////////////////////////////
function openVertical(name) {
  // name : <!-- job-listings, interview-questions, interview-experience, salary-discussions, culture, compare-with-faang -->
  var ansChips = document.querySelectorAll(".chip");
  var ansVerticals = document.querySelectorAll("#answer-vertical");

  for (let i = 0; i < ansVerticals.length; i++) {
    if (ansVerticals[i].className.includes(name)) {
      ansVerticals[i].classList.remove("hide");
      ansChips[i].classList.add("active");
    } else {
      ansVerticals[i].classList.add("hide");
      ansChips[i].classList.remove("active");
    }
  }

  // GA Track Vertical Click Success
  gaTrackCompanyDetailChipClick(name);
}

/////////////////////////////// NavBar Functions /////////////////////////////////////////

function closeNav() {
  document.getElementById("mySidenav").style.width = "0px";
  document.getElementById("backdrop").style.display = "none";
}

function openNav() {
  // If already open then close
  if (
    document.getElementById("mySidenav").style.width != "0px" &&
    document.getElementById("mySidenav").style.width != ""
  ) {
    closeNav();
  } else {
    document.getElementById("mySidenav").style.width = isMobileDevice
      ? "100%"
      : "50%"; //opens side navbar by 70 percent
    document.getElementById("backdrop").style.display = "block"; //displays overlay
  }
}

/////////////////////////////// Social Proof Functions /////////////////////////////////////////

function sideNotification() {
  var r_text = new Array();
  r_text[0] = "Bengaluru";
  r_text[1] = "Hyderabad";
  r_text[2] = "Delhi";
  r_text[3] = "Mumbai";
  r_text[5] = "Pune";
  r_text[4] = "Noida";
  r_text[6] = "Chennai";

  var r_map = new Array();
  r_map[0] = "./img/anonymousWoman.png";
  r_map[1] = "./img/anonymousMan.png";

  var r_product = new Array();
  r_product[0] = "Microsoft";
  r_product[1] = "Google";
  r_product[2] = "Amazon";
  r_product[3] = "Uber";
  r_product[4] = "LinkedIn";
  r_product[5] = "Sprinklr";
  r_product[6] = "Salesforce";
  r_product[7] = "Oracle";
  r_product[8] = "Adobe";

  setInterval(function () {
    $(".custom-social-proof").stop().slideToggle("slow");
  }, 3000);
  $(".custom-close").click(function () {
    $(".custom-social-proof").stop().slideToggle("slow");
  });

  setInterval(function () {
    document
      .querySelector("#csp_map")
      .setAttribute("src", r_map[Math.floor(2 * Math.random())]);
    document.querySelector("#city").textContent =
      r_text[Math.floor(7 * Math.random())];
    document.querySelector("#csp_company").textContent =
      r_product[Math.floor(9 * Math.random())];
    document.querySelector("#time").textContent = Math.floor(5 * Math.random());
  }, 6000);
}

function disableCSP() {
  $(".custom-social-proof").style = "display: none;";
}

/////////////////////////////// Google Analytics Functions /////////////////////////////////////////

// Google Analytics tracking code
function gaTrackPageview() {
  gtag("event", "page_view");
}

function gaTrackJSearchEvent(searchInputData) {
  gtag("event", "Search Button Click", searchInputData);
}

function gaTrackCompanyClickEvent(company) {
  gtag("event", "Company Slide/SideNav Click", {
    company: company,
  });
}

function gaTrackCompanyDetailChipClick(chip) {
  gtag("event", "Company Vertical Click", {
    company: document.getElementsByClassName("company")[0].value,
    chip: chip,
  });
}

gaTrackPageview();
updateMobileUX();
setJobsListings();
