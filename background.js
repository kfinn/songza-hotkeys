chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostSuffix: 'songza.com' },
            css: [
              '.miniplayer-control-play-pause'
            ]
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

function handlePlayPause(tabId) {
  chrome.tabs.executeScript(tabId, {
    code: "document.getElementsByClassName('miniplayer-control-play-pause')[0].click();"
  });
};

chrome.commands.onCommand.addListener(function(command) {
  chrome.tabs.query({
    'url': '*://songza.com/'
  }, function(tabs) {
    console.log(tabs);
    if (tabs) {
      if (command == 'play-pause') {
        handlePlayPause(tabs[0].id);
      }
    }
  });
  console.log('command: ' + command);
});

chrome.pageAction.onClicked.addListener(function(tab) {
  handlePlayPause(tab.id);
});
