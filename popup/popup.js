// Load current value
chrome.storage.local.get({ columns: 4 }, (res) => {
    document.getElementById('columns').textContent = res.columns;
    updatePresetButtons(res.columns);
});

// Get references to elements
const columnsDisplay = document.getElementById('columns');
const decreaseBtn = document.getElementById('decreaseBtn');
const increaseBtn = document.getElementById('increaseBtn');
const saveBtn = document.getElementById('save');
const presetBtns = document.querySelectorAll('.preset-btn');

// Min and max column limits
const MIN_COLUMNS = 1;
const MAX_COLUMNS = 10;

// Update column display and save to storage
function updateColumns(newValue) {
    const val = Math.max(MIN_COLUMNS, Math.min(MAX_COLUMNS, newValue));
    columnsDisplay.textContent = val;
    
    // Update button states
    decreaseBtn.disabled = val <= MIN_COLUMNS;
    increaseBtn.disabled = val >= MAX_COLUMNS;
    
    // Update preset buttons
    updatePresetButtons(val);
    
    // Save to storage
    chrome.storage.local.set({ columns: val });
    
    // Add visual feedback
    columnsDisplay.style.transform = 'scale(1.1)';
    setTimeout(() => {
        columnsDisplay.style.transform = 'scale(1)';
    }, 150);
    
    return val;
}

// Update preset button active states
function updatePresetButtons(activeColumns) {
    presetBtns.forEach(btn => {
        const columns = parseInt(btn.dataset.columns);
        if (columns === activeColumns) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Decrease button functionality
decreaseBtn.addEventListener('click', () => {
    const currentVal = parseInt(columnsDisplay.textContent, 10);
    if (currentVal > MIN_COLUMNS) {
        updateColumns(currentVal - 1);
        
        // Add button press effect
        decreaseBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            decreaseBtn.style.transform = 'scale(1)';
        }, 100);
    }
});

// Increase button functionality
increaseBtn.addEventListener('click', () => {
    const currentVal = parseInt(columnsDisplay.textContent, 10);
    if (currentVal < MAX_COLUMNS) {
        updateColumns(currentVal + 1);
        
        // Add button press effect
        increaseBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            increaseBtn.style.transform = 'scale(1)';
        }, 100);
    }
});

// Preset button functionality
presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const columns = parseInt(btn.dataset.columns);
        updateColumns(columns);
        
        // Add button press effect
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 100);
    });
});

// Save/Apply button functionality
saveBtn.addEventListener('click', async () => {
    const val = parseInt(columnsDisplay.textContent, 10);
    if (isNaN(val) || val < MIN_COLUMNS) return;

    // Add loading state
    saveBtn.disabled = true;
    saveBtn.textContent = 'Applying...';
    
    try {
        // Get current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Send message to content script
        await chrome.tabs.sendMessage(tab.id, { type: "SET_COLUMNS", value: val });
        
        // Success feedback
        saveBtn.textContent = '✓ Applied!';
        saveBtn.style.background = 'linear-gradient(45deg, #4caf50, #388e3c)';
        
        setTimeout(() => {
            saveBtn.textContent = 'Apply Changes';
            saveBtn.style.background = 'linear-gradient(45deg, #ff4444, #cc0000)';
            saveBtn.disabled = false;
        }, 1500);
        
    } catch (error) {
        console.error('Error applying settings:', error);
        
        // Error feedback
        saveBtn.textContent = 'Error - Try Again';
        saveBtn.style.background = 'linear-gradient(45deg, #f44336, #d32f2f)';
        
        setTimeout(() => {
            saveBtn.textContent = 'Apply Changes';
            saveBtn.style.background = 'linear-gradient(45deg, #ff4444, #cc0000)';
            saveBtn.disabled = false;
        }, 2000);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === '-') {
        e.preventDefault();
        decreaseBtn.click();
    } else if (e.key === 'ArrowRight' || e.key === '+' || e.key === '=') {
        e.preventDefault();
        increaseBtn.click();
    } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        saveBtn.click();
    }
    
    // Number key shortcuts (1-9)
    const num = parseInt(e.key);
    if (num >= 1 && num <= 9) {
        e.preventDefault();
        updateColumns(num);
    }
});
