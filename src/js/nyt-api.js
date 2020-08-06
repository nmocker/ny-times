class NytApi {
  API_URL_BASE = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
  API_KEY = "QT3L7SGkXlo5eJqpAsnf76L21p6I8tqO";

  search(term, options = {}) {
    axios
      .get(this.API_URL_BASE, {
        params: {
          "api-key": this.API_KEY,
          q: term,
          ...options,
        },
      })
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  handleResponse(response) {
    // pass results back to main.js via custom event
    const value = response.data.response.docs;

    const event = new CustomEvent("got-results", { detail: value });
    document.querySelector("body").dispatchEvent(event);
  }

  handleError(error) {}
}
