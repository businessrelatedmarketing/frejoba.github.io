const api_server_domain = "https://mailserver.crezalo.com/cmcs/";

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

console.log(url);

function updateMobileUX() {
  if (isMobileDevice === true) {
    let slider_container = document.querySelector(".slider-container");
    slider_container.style.visibility = "hidden";
    slider_container.style.padding = 0;

    let mobile_company_button = document.querySelector(
      ".mobile-company-nav-div"
    );
    mobile_company_button.className = "mobile-company-nav-div-show";

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
  }
}

let jobsListings = [];

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
    limit: "100",
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

async function lk_job_description(jobUrl) {
  // Define the request body
  let requestBody = {
    jobUrl: jobUrl.split("?")[0],
  };

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS",
  };

  try {
    const response = await fetch(
      api_server_domain + "linkedin-job-description",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    jobsDescription = result["result"];
    return jobsDescription;
  } catch (error) {
    console.error("Error during fetch:", error);
    // Handle errors, e.g., display an error message to the user
  }
}

async function lk_job_companyUrl(jobUrl) {
  // Define the request body
  let requestBody = {
    jobUrl: jobUrl.split("?")[0],
  };

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS",
  };

  try {
    const response = await fetch(
      api_server_domain + "linkedin-job-companylogo",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody),
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    logo = result["result"];
    return logo;
  } catch (error) {
    console.error("Error during fetch:", error);
    // Handle errors, e.g., display an error message to the user
  }
}

function getTagHTML(tag, tagClasses) {
  return `<span class="${tagClasses}">
                ${tag}
            </span>`;
}

function getJobListingHTML(jobData, filterTags = []) {
  const JOB_TAGS_PLACEHOLDER = "###JOB_TAGS###";
  let jobListingHTML = `
      <div class="jobs__item">
        <a href="#modal-opened-${jobData.id}" id="modal-closed-${
    jobData.id
  }" onclick="updateJobDescription(${jobData.id})">
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

async function updateJobDescription(jobId) {
  try {
    jobsListings[jobId]["Description"] = await lk_job_description(
      jobsListings[jobId]["jobUrl"]
    );
    document.querySelector(
      `#modal-opened-${jobsListings[jobId].id} .job-description`
    ).innerHTML = jobsListings[jobId]["Description"];
    document.querySelector("#lds-dual-ring-" + jobId).style.visibility =
      "hidden";
  } catch (error) {
    console.error(error);
    jobsListings[jobId]["Description"] = "";

    document.querySelector(
      `#modal-opened-${jobsListings[jobId].id} .job-description`
    ).textContent = "Refer Apply Page for Job Description";
    document.querySelector("#lds-dual-ring-" + jobId).style.visibility =
      "hidden";
  }
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

async function setJobsListings(searchInputData, filterTags) {
  document.getElementById("jobs").innerHTML = loaderDiv;
  await lk_jobs_list(searchInputData);
  if (jobsListings.length == 0) {
    await lk_jobs_list(searchInputData);
    if (jobsListings.length == 0) {
      await lk_jobs_list(searchInputData);
    }
  }
  const jobsListingsHTML = jobsListings.reduce((acc, currentListing) => {
    return acc + getJobListingHTML(currentListing, filterTags);
  }, "");

  document.getElementById("jobs").innerHTML = jobsListingsHTML;
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

function getJobsData() {
  var searchInputData = getSearchInputData();
  setJobsListings(searchInputData, []);
  gaTrackJSearchEvent(searchInputData);
}

function jobList(company) {
  document.getElementsByClassName("company")[0].value = company;
  var searchInputData = getSearchInputData();
  searchInputData.keyword += " " + company;
  searchInputData.company = company;
  searchInputData.dateSincePosted = "past month";
  searchInputData.limit = "100";
  setJobsListings(searchInputData, []);
  gaTrackCompanyClickEvent(company);
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

// Google Analytics tracking code
function gaTrackPageview() {
  gtag("event", "page_view");
}

function gaTrackJSearchEvent(searchInputData) {
  gtag("event", "Search Button Click", searchInputData);
}

function gaTrackCompanyClickEvent(company) {
  gtag("event", "Company Slide click", {
    company: company,
  });
}

gaTrackPageview();
updateMobileUX();
setJobsListings();
