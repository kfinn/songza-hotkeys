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

var playIcon = {
  '19': 'play.png',
  '38': 'play@2x.png'
};

var pauseIcon = {
  '19': 'pause.png',
  '38': 'pause@2x.png'
};

function handlePlayPause(tabId) {
  chrome.tabs.executeScript(tabId, {
    code: "document.getElementsByClassName('miniplayer-control-play-pause')[0].click(); document.getElementsByClassName('player-state-pause').length > 0;"
  }, function(results) {
    console.log(results[0]);
    if (results[0]) {
      chrome.pageAction.setIcon({tabId: tabId, path: playIcon});
    } else {
      chrome.pageAction.setIcon({tabId: tabId, path: pauseIcon});
    }
  });
};

chrome.commands.onCommand.addListener(function(command) {
  chrome.tabs.query({
    'url': '*://songza.com/*'
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
