document.addEventListener('DOMContentLoaded', () => {
  const activationToggle = document.getElementById('activation-toggle');
  const settingsButton = document.getElementById('settingsButton');

  activationToggle.addEventListener('change', () => {
    chrome.runtime.sendMessage({ type: "toggle" }, (response) => {
      if (response.isActive) {
        document.getElementById('toggle-label').textContent = 'Deactivate';
      } else {
        document.getElementById('toggle-label').textContent = 'Activate';
      }
    });
  });
  
  settingsButton.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  
  chrome.runtime.sendMessage({ type: "getActiveState" }, (response) => {
    if (response.isActive) {
      document.getElementById('toggle-label').textContent = 'Deactivate';
      activationToggle.checked = true;
    } else {
      document.getElementById('toggle-label').textContent = 'Activate';
      activationToggle.checked = false;
    }
  });
});
