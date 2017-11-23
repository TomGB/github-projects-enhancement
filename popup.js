console.log('loaded popup.js');

const saveButton = document.getElementById('saveURLs');

saveButton.addEventListener('click', () => {
  const urls = document.getElementById('URLs').value.split('\n');
  try {
    stringUrls = JSON.stringify(urls);

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { urls: stringUrls });
    });
  } catch (e) {
    alert('error in input. please enter urls seperated by new lines')
  }
});
