console.log('loaded popup.js');

const saveButton = document.getElementById('saveURLs');

saveButton.addEventListener('click', () => {
  const urls = document.getElementById('URLs').value.split('\n');
  try {
    stringUrls = JSON.stringify(urls);
    sendMessage({ urls: stringUrls });
  } catch (e) {
    alert('error in input. please enter urls seperated by new lines')
  }
});

const togglePrInfo = document.getElementById('togglePrInfo');

togglePrInfo.addEventListener('click', () => {
  sendMessage({ toggleStatus: true });
});

const toggleLabels = document.getElementById('toggleLabels');

toggleLabels.addEventListener('click', () => {
  sendMessage({ toggleLabels: true });
});

function sendMessage(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}
