document.addEventListener('DOMContentLoaded', () => {
  updateBlockedSitesUI();
  
  document.getElementById('add-btn').addEventListener('click', () => {
    let newSite = document.getElementById('new-site').value;
    if (newSite) {
      addBlockedSite(newSite);
      document.getElementById('new-site').value = ''; // Clear input field
    }
  });
});

function updateBlockedSitesUI() {
  chrome.storage.local.get(['blockedSites'], (result) => {
    let sites = result.blockedSites || [];
    let list = document.getElementById('blocklist');
    list.innerHTML = ''; // Clear existing list
    
    sites.forEach((site) => {
      let li = document.createElement('li');
      li.textContent = site;
      let removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        removeBlockedSite(site);
      });
      li.appendChild(removeBtn);
      list.appendChild(li);
    });
  });
}

function addBlockedSite(site) {
  chrome.storage.local.get(['blockedSites'], (result) => {
    let sites = result.blockedSites || [];
    if (!sites.includes(site)) {
      sites.push(site);
      chrome.storage.local.set({ blockedSites: sites }, () => {
        updateBlockedSitesUI();
        chrome.runtime.sendMessage({ type: "updateBlockedSites", blockedSites: sites });
      });
    }
  });
}

function removeBlockedSite(site) {
  chrome.storage.local.get(['blockedSites'], (result) => {
    let sites = result.blockedSites || [];
    let index = sites.indexOf(site);
    if (index > -1) {
      sites.splice(index, 1);
      chrome.storage.local.set({ blockedSites: sites }, () => {
        updateBlockedSitesUI();
        chrome.runtime.sendMessage({ type: "updateBlockedSites", blockedSites: sites });
      });
    }
  });
}
