// YouTube Column Resizer Content Script
class YouTubeColumnResizer {
  constructor() {
    this.columnCount = 3; // Default YouTube column count
    this.observer = null;
    this.init();
  }

  async init() {
    // Load saved settings
    await this.loadSettings();
    
    // Apply initial styling
    this.applyColumnLayout();
    
    // Set up mutation observer to handle dynamic content
    this.setupObserver();
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'updateColumns') {
        this.columnCount = request.columnCount;
        this.saveSettings();
        this.applyColumnLayout();
        sendResponse({success: true});
      }
    });
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['columnCount']);
      if (result.columnCount) {
        this.columnCount = result.columnCount;
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  }

  async saveSettings() {
    try {
      await chrome.storage.sync.set({columnCount: this.columnCount});
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  }

  setupObserver() {
    // Create observer to watch for YouTube's dynamic content loading
    this.observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check if new video containers were added
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.classList && (
                node.classList.contains('ytd-rich-grid-media') ||
                node.classList.contains('ytd-video-renderer') ||
                node.classList.contains('ytd-grid-video-renderer') ||
                node.querySelector('.ytd-rich-grid-media') ||
                node.querySelector('.ytd-video-renderer') ||
                node.querySelector('.ytd-grid-video-renderer')
              )) {
                shouldUpdate = true;
              }
            }
          });
        }
      });
      
      if (shouldUpdate) {
        // Debounce the update
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(() => {
          this.applyColumnLayout();
        }, 100);
      }
    });

    // Start observing
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  applyColumnLayout() {
    // Target different YouTube grid containers
    const selectors = [
      '#contents.ytd-rich-grid-renderer',
      '#contents.ytd-grid-renderer',
      '#contents.ytd-item-section-renderer',
      'ytd-rich-grid-renderer #contents',
      'ytd-grid-renderer #contents',
      'ytd-item-section-renderer #contents'
    ];

    selectors.forEach(selector => {
      const container = document.querySelector(selector);
      if (container) {
        this.updateGridLayout(container);
      }
    });

    // Also target individual video containers for more specific control
    const videoContainers = document.querySelectorAll(
      'ytd-rich-grid-media, ytd-video-renderer, ytd-grid-video-renderer'
    );
    
    videoContainers.forEach(container => {
      this.updateVideoContainer(container);
    });
  }

  updateGridLayout(container) {
    if (!container) return;

    // Calculate width based on column count
    const widthPercentage = 100 / this.columnCount;
    
    // Apply CSS custom property for dynamic styling
    container.style.setProperty('--column-count', this.columnCount);
    container.style.setProperty('--item-width', `${widthPercentage}%`);
    
    // Add class for CSS targeting
    container.classList.add('youtube-column-resizer-grid');
  }

  updateVideoContainer(container) {
    if (!container) return;

    // Calculate width based on column count
    const widthPercentage = 100 / this.columnCount;
    
    // Apply inline styles as fallback
    container.style.width = `${widthPercentage}%`;
    container.style.flexBasis = `${widthPercentage}%`;
    container.style.maxWidth = `${widthPercentage}%`;
    
    // Add class for CSS targeting
    container.classList.add('youtube-column-resizer-item');
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    clearTimeout(this.updateTimeout);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new YouTubeColumnResizer();
  });
} else {
  new YouTubeColumnResizer();
}

// Re-initialize on navigation (YouTube is a SPA)
let currentUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== currentUrl) {
    currentUrl = url;
    // Small delay to let YouTube finish loading new content
    setTimeout(() => {
      new YouTubeColumnResizer();
    }, 1000);
  }
}).observe(document, { subtree: true, childList: true });
