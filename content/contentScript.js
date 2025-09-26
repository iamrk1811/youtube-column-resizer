// Apply stored columns value whenever YouTube's DOM changes
chrome.storage.local.get({ columns: 4 }, (res) => {
    observeAndApply(res.columns);
});

function applyColumns(num) {
    const grid = document.querySelector("ytd-rich-grid-renderer");
    if (grid) {
        grid.style.setProperty("--ytd-rich-grid-items-per-row", num);
        console.log(`[YouTube Column Customizer] Columns set to: ${num}`);
    }
}

function observeAndApply(columns) {
    applyColumns(columns);

    // Watch for changes in the main app container
    const targetNode = document.body;
    const observer = new MutationObserver(() => {
        applyColumns(columns);
    });

    observer.observe(targetNode, {
        childList: true,
        subtree: true
    });

    // Store observer so we can disconnect if needed
    window._ytColumnObserver = observer;
}

// Listen for changes from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "SET_COLUMNS") {
        chrome.storage.local.set({ columns: msg.value });
        observeAndApply(msg.value); // Reapply immediately
        sendResponse({ success: true });
    }
});
