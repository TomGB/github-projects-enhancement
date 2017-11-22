setTimeout(() => {
  var pageStyle = document.createElement('link');
  pageStyle.href = chrome.extension.getURL('pageStyle.css');
  pageStyle.rel = "stylesheet";
  console.log(pageStyle);
  (document.head || document.documentElement).appendChild(pageStyle);

  var jquery = document.createElement('script');
  jquery.src = chrome.extension.getURL('jquery.js');
  jquery.onload = function() {
      this.remove();
  };
  (document.head || document.documentElement).appendChild(jquery);

  setTimeout(() => {
    var scriptInPage = document.createElement('script');
    scriptInPage.src = chrome.extension.getURL('scriptInPage.js');
    scriptInPage.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(scriptInPage);
  }, 50);
}, 100);
