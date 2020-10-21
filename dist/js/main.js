"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Main = /*#__PURE__*/function () {
  function Main() {
    var _this = this;

    _classCallCheck(this, Main);

    _defineProperty(this, "reformatDate", function (dateString) {
      if (dateString == null || dateString == "") {
        return null;
      }

      var matched = dateString.match(/^(0?[1-9]|1[0-2])\W(3[01]|[12][0-9]|0?[1-9])\W?(\d*?)$/);
      var year = matched[3];

      if (year.length == 0) {
        year = new Date().getFullYear();
      } else if (year.length == 2) {
        year = "20".concat(year);
      } else if (year.length != 4) {
        return null;
      }

      var testDate = new Date(year, parseInt(matched[1]) - 1, matched[2]);

      if (testDate == null) {
        return null;
      }

      var mm = matched[1];

      if (mm.length == 1) {
        mm = "0".concat(mm);
      }

      var dd = matched[2];

      if (dd.length == 1) {
        dd = "0".concat(dd);
      }

      var formattedDate = "".concat(year).concat(mm).concat(dd);
      return formattedDate;
    });

    _defineProperty(this, "handleSearch", function (event) {
      event.preventDefault();
      var queryEl = document.querySelector('[name="query"]');
      var startDateEl = document.querySelector('[name="startDate"]');
      var endDateEl = document.querySelector('[name="endDate"]');
      var queryTerm = queryEl.value;
      var startDateOrig = startDateEl.value;

      var startDate = _this.reformatDate(startDateOrig);

      var endDateOrig = endDateEl.value;

      var endDate = _this.reformatDate(endDateOrig);

      var selectOptionsEl = document.querySelector('[name="sort"]');
      var selectOptionsOrig = selectOptionsEl.value;
      var searchOptions = {};

      if (startDate != null) {
        searchOptions.begin_date = startDate;
      }

      if (endDate != null) {
        searchOptions.end_date = endDate;
      }

      searchOptions.sort = selectOptionsOrig;
      var api = new NytApi();
      api.search(queryTerm, searchOptions);
    });

    // what's the flow here?
    // 1. setup form events listener(s) that will make the actual api calls
    // 2. setup callback functions to process api responses
    this.setupEventListeners();
  }

  _createClass(Main, [{
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var buttonEl = document.querySelector('[name="search"]');
      buttonEl.addEventListener("click", this.handleSearch);
      var bodyEl = document.querySelector("body");
      bodyEl.addEventListener("got-results", this.handleResults);
      bodyEl.addEventListener("got-error", this.handleSearchError);
    }
  }, {
    key: "handleResults",
    value: function handleResults(event) {
      var resultsUl = document.querySelector(".results");
      resultsUl.innerHTML = "";
      var results = event.detail;

      if (!results || results.length === 0) {
        results.textContent = "Womp womp...";
        return;
      }

      for (var result in results) {
        var article = results[result];
        var resultLi = document.createElement("li");
        resultsUl.appendChild(resultLi);
        var articles = document.createElement("div");
        articles.setAttribute("class", "articles-div");
        resultLi.appendChild(articles);
        var articleInfo = document.createElement("div");
        articleInfo.setAttribute("class", "article-info");
        articles.appendChild(articleInfo);
        var imgEl = document.createElement("div");
        imgEl.classList.add("photo");
        resultLi.appendChild(imgEl);

        if (article.multimedia.length > 0) {
          imgEl.style.backgroundImage = "url(https://www.nytimes.com/".concat(article.multimedia[0].url, ")");
        }

        var sectionEl = document.createElement("span");
        articleInfo.appendChild(sectionEl);
        sectionEl.textContent = article.section_name;
        var linkEl = document.createElement("a");
        articleInfo.appendChild(linkEl);
        var titleEl = document.createElement("h2");
        linkEl.appendChild(titleEl);
        linkEl.setAttribute("href", article.web_url);
        linkEl.setAttribute("target", "_blank");
        titleEl.textContent = article.headline.main;
        var abstractEl = document.createElement("p");
        articleInfo.appendChild(abstractEl);
        abstractEl.textContent = article.snippet;
        var bylineInfoDiv = document.createElement("div");
        bylineInfoDiv.setAttribute("class", "byline-info");
        articleInfo.appendChild(bylineInfoDiv);
        var bylineEl = document.createElement("span");
        bylineInfoDiv.appendChild(bylineEl);

        if (article.byline.original === null) {
          bylineEl.textContent === "Staff";
        } else {
          bylineEl.textContent = article.byline.original + " ";
        }

        var dateEl = document.createElement("span");
        bylineInfoDiv.appendChild(dateEl);
        dateEl.classList.add("date");
        new Date(article.pub_date.slice(0, 19));
        dateEl.textContent = new Date(article.pub_date).toDateString();
      }
    }
  }, {
    key: "handleSearchError",
    value: function handleSearchError(error) {}
  }]);

  return Main;
}();

new Main();
//# sourceMappingURL=main.js.map
