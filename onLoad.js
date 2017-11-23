console.log("running extension load script")

extensionListener();

const projectUrls = getProjectUrls();

if(projectUrls.includes(window.location.href)){
  injectCSS();
  injectJquery();
  injectScript();
}

function injectCSS() {
  var pageStyle = document.createElement('link');
  pageStyle.href = chrome.extension.getURL('pageStyle.css');
  pageStyle.rel = "stylesheet";
  (document.head || document.documentElement).appendChild(pageStyle);
}

function injectJquery() {
  var jquery = document.createElement('script');
  jquery.src = chrome.extension.getURL('jquery.js');
  jquery.onload = function() {
      this.remove();
  };
  (document.head || document.documentElement).appendChild(jquery);
}

function injectScript() {
  var scriptInPage = document.createElement('script');
  scriptInPage.src = chrome.extension.getURL('scriptInPage.js');
  scriptInPage.onload = function() {
      this.remove();
  };
  (document.head || document.documentElement).appendChild(scriptInPage);
}

function extensionListener() {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.urls) {
      console.log('setting urls in local storage');
      localStorage.setItem('urls', message.urls);
      location.reload();
    } else if (message.toggle) {
      console.log('toggling pr disablePrStatus');
      const disablePrStatus = JSON.parse(localStorage.getItem('disablePrStatus'));
      console.log('setting from', disablePrStatus);
      console.log('setting to', !disablePrStatus);
      localStorage.setItem('disablePrStatus', JSON.stringify(!disablePrStatus));
      console.log('disablePrStatus =',localStorage.getItem('disablePrStatus'));
      location.reload();
    }
  });
}

function getProjectUrls() {
  const defaultURLs = [
    'https://github.com/sky-uk/Digital-Help/projects/26?fullscreen=true',
    'https://github.com/sky-uk/Digital-Help/projects/26',
    'https://github.com/sky-uk/Digital-Help/projects/27?fullscreen=true',
    'https://github.com/sky-uk/Digital-Help/projects/27',
    'https://github.com/sky-uk/Digital-Help/projects/25?fullscreen=true',
    'https://github.com/sky-uk/Digital-Help/projects/25'
  ];

  let projectUrls = JSON.parse(localStorage.getItem('urls'));
  console.log('urls from local storage', { urls: projectUrls });

  return projectUrls ? projectUrls : defaultURLs
}
