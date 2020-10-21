class Main {
  constructor() {
    // what's the flow here?
    // 1. setup form events listener(s) that will make the actual api calls
    // 2. setup callback functions to process api responses
    this.setupEventListeners();
  }

  setupEventListeners() {
    const buttonEl = document.querySelector('[name="search"]');
    buttonEl.addEventListener("click", this.handleSearch);

    const bodyEl = document.querySelector("body");
    bodyEl.addEventListener("got-results", this.handleResults);
    bodyEl.addEventListener("got-error", this.handleSearchError);
  }

  reformatDate = (dateString) => {
    if (dateString == null || dateString == "") {
      return null;
    }

    const matched = dateString.match(
      /^(0?[1-9]|1[0-2])\W(3[01]|[12][0-9]|0?[1-9])\W?(\d*?)$/
    );

    let year = matched[3];
    if (year.length == 0) {
      year = new Date().getFullYear();
    } else if (year.length == 2) {
      year = `20${year}`;
    } else if (year.length != 4) {
      return null;
    }

    const testDate = new Date(year, parseInt(matched[1]) - 1, matched[2]);
    if (testDate == null) {
      return null;
    }

    let mm = matched[1];
    if (mm.length == 1) {
      mm = `0${mm}`;
    }
    let dd = matched[2];
    if (dd.length == 1) {
      dd = `0${dd}`;
    }

    let formattedDate = `${year}${mm}${dd}`;

    return formattedDate;
  };

  handleSearch = (event) => {
    event.preventDefault();

    const queryEl = document.querySelector('[name="query"]');
    const startDateEl = document.querySelector('[name="startDate"]');
    const endDateEl = document.querySelector('[name="endDate"]');
    const queryTerm = queryEl.value;
    const startDateOrig = startDateEl.value;
    const startDate = this.reformatDate(startDateOrig);
    const endDateOrig = endDateEl.value;
    const endDate = this.reformatDate(endDateOrig);

    const selectOptionsEl = document.querySelector('[name="sort"]');
    const selectOptionsOrig = selectOptionsEl.value;

    const searchOptions = {};
    if (startDate != null) {
      searchOptions.begin_date = startDate;
    }
    if (endDate != null) {
      searchOptions.end_date = endDate;
    }
    searchOptions.sort = selectOptionsOrig;

    const api = new NytApi();
    api.search(queryTerm, searchOptions);
  };

  handleResults(event) {
    const resultsUl = document.querySelector(".results");
    resultsUl.innerHTML = ""

    const results = event.detail;

    if (!results || results.length === 0) {
      results.textContent = "Womp womp...";
      return;
    }

    for (let result in results) {
      const article = results[result];
      const resultLi = document.createElement("li");
      resultsUl.appendChild(resultLi);

      const imgEl = document.createElement("div");
      imgEl.classList.add("photo");
      if (article.multimedia.length > 0) {
        imgEl.style.backgroundImage = `url(https://www.nytimes.com/${article.multimedia[0].url})`;
      }

      const articles = document.createElement("div");
      articles.setAttribute("class", "articles-div");
      resultLi.appendChild(articles);

      const articleInfo = document.createElement("div");
      articleInfo.setAttribute("class", "article-info");
      articles.appendChild(articleInfo);

      const sectionEl = document.createElement("span");
      articleInfo.appendChild(sectionEl);
      sectionEl.textContent = article.section_name;

      const linkEl = document.createElement("a");
      articleInfo.appendChild(linkEl);
      const titleEl = document.createElement("h2");
      linkEl.appendChild(titleEl);
      linkEl.setAttribute("href", article.web_url);
      linkEl.setAttribute("target", "_blank");
      titleEl.textContent = article.headline.main;

      const abstractEl = document.createElement("p");
      articleInfo.appendChild(abstractEl);
      abstractEl.textContent = article.snippet;

      const bylineInfoDiv = document.createElement("div");
      bylineInfoDiv.setAttribute("class", "byline-info");
      articles.appendChild(bylineInfoDiv);

      const bylineEl = document.createElement("span");
      bylineInfoDiv.appendChild(bylineEl);
      if (article.byline.original === null) {
        bylineEl.textContent === "Staff";
      } else {
        bylineEl.textContent = article.byline.original + " ";
      }

      const dateEl = document.createElement("span");
      bylineInfoDiv.appendChild(dateEl);
      dateEl.classList.add("date");
      new Date(article.pub_date.slice(0, 19));
      dateEl.textContent = new Date(article.pub_date).toDateString();
    }
  }

  handleSearchError(error) {}
}

new Main();
