const urls = chrome.runtime.getURL('./config/urls.json');
function conditions() {
    return fetch(urls)
      .then(function(res) {
      if (res.status === 200) {
        return res.json();
      }
      })
      .then(function(safeUrls) {
        return Object.values(safeUrls).map(function (key) {
          console.log(key.url);
          return new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals : key.url }
          })
        });
      })
  }

chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      conditions().then(function(response) {
      chrome.declarativeContent.onPageChanged.addRules([
        {
          conditions: response,
          actions: [ new chrome.declarativeContent.ShowPageAction() ]
        }
      ]);
    });
  });
});