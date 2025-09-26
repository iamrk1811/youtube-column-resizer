// YouTube Column Resizer Popup Script
class PopupController {
  constructor() {
    this.columnCountInput = document.getElementById('columnCount');
    this.applyBtn = document.getElementById('applyBtn');
    this.status = document.getElementById('status');
    this.currentSetting = document.getElementById('currentSetting');
    this.presetBtns = document.querySelectorAll('.preset-btn');

    this.init();
  }

  async init() {
    // Load current settings
    await this.loadCurrentSettings();

    // Set up event listeners
    this.setupEventListeners();
  }

  async loadCurrentSettings() {
    try {
      const result = await chrome.storage.sync.get(['columnCount']);
      const columnCount = result.columnCount || 3;

      this.columnCountInput.value = columnCount;
      this.updateCurrentSetting(columnCount);
    } catch (error) {
      console.error('Error loading settings:', error);
      this.showStatus('Error loading settings', 'error');
    }
  }

  setupEventListeners() {
    // Apply button click
    this.applyBtn.addEventListener('click', () => {
      this.applySettings();
    });

    // Enter key on input
    this.columnCountInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.applySettings();
      }
    });

    // Input validation
    this.columnCountInput.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      if (value < 1) e.target.value = 1;
      if (value > 10) e.target.value = 10;
    });

    // Preset buttons
    this.presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const columns = parseInt(btn.dataset.columns);
        this.columnCountInput.value = columns;
        this.applySettings();
      });
    });
  }

  async applySettings() {
    const columnCount = parseInt(this.columnCountInput.value);

    if (columnCount < 1 || columnCount > 10) {
      this.showStatus('Please enter a number between 1 and 10', 'error');
      return;
    }

    try {
      // Save to storage
      await chrome.storage.sync.set({columnCount: columnCount});

      // Send message to content script
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

      if (tab && tab.url && tab.url.includes('youtube.com')) {
        await chrome.tabs.sendMessage(tab.id, {
          action: 'updateColumns',
          columnCount: columnCount
        });

        this.updateCurrentSetting(columnCount);
        this.showStatus(`Applied ${columnCount} columns successfully!`, 'success');
      } else {
        this.showStatus('Please navigate to YouTube first', 'error');
      }
    } catch (error) {
      console.error('Error applying settings:', error);
      this.showStatus('Error applying settings', 'error');
    }
  }

  updateCurrentSetting(columnCount) {
    this.currentSetting.textContent = `Current: ${columnCount} column${columnCount !== 1 ? 's' : ''}`;
  }

  showStatus(message, type) {
    this.status.textContent = message;
    this.status.className = `status ${type} show`;

    // Hide status after 3 seconds
    setTimeout(() => {
      this.status.classList.remove('show');
    }, 3000);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});
