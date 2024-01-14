let isExtensionActive = false;
let blockedSites = [];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isExtensionActive: false, blockedSites: [] });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(['isExtensionActive', 'blockedSites'], (result) => {
    isExtensionActive = result.isExtensionActive || false;
    blockedSites = result.blockedSites || [];
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "toggle") {
    isExtensionActive = !isExtensionActive;
    chrome.storage.local.set({ isExtensionActive: isExtensionActive });
    sendResponse({ isActive: isExtensionActive });
  } else if (message.type === "getActiveState") {
    sendResponse({ isActive: isExtensionActive });
  } else if (message.type === "updateBlockedSites") {
    blockedSites = message.blockedSites;
    chrome.storage.local.set({ blockedSites: blockedSites });
    sendResponse({ blockedSites: blockedSites });
  }
  return true;
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (isExtensionActive) {
    let siteHost = new URL(details.url).hostname;
    if (blockedSites.includes(siteHost)) {
      chrome.tabs.update(details.tabId, {
        url: 'blocked.html' 
      });
    }
  }
}, { url: [{ hostContains: '.' }] });

