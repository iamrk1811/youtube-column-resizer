# YouTube Column Customizer

A Chrome extension that allows you to customize the number of video columns displayed on YouTube's homepage.

## 🎯 Features

- **Adjustable Columns**: Set anywhere from 1 to 10 columns (default: 4)
- **Beautiful UI**: Modern popup interface with gradient design and animations
- **One-Click Presets**: Quick access to common column counts (2, 3, 4, 5, 6, 8)
- **Keyboard Shortcuts**: Use +/- keys or number keys (1-9) for quick adjustments
- **Instant Apply**: Changes take effect immediately when you click "Apply Changes"
- **Persistent Settings**: Your preferences are saved using `chrome.storage.local`

## 🚀 Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked" and select the extension folder
5. Navigate to YouTube and start customizing!

## 💡 How to Use

1. Click the extension icon in your Chrome toolbar
2. Use the **+/-** buttons or click preset numbers to adjust columns
3. Click **"Apply Changes"** to update YouTube
4. Your settings are automatically saved and restored on page loads

## ⌨️ Keyboard Shortcuts

- **Arrow Keys** or **+/-**: Increase/decrease columns
- **Number Keys (1-9)**: Set specific column count directly
- **Enter/Space**: Apply changes

## 🛠️ Technical Details

- **Manifest V3** compatible
- Uses `chrome.storage.local` for settings persistence
- Modifies YouTube's `--ytd-rich-grid-items-per-row` CSS property
- Content script with MutationObserver for dynamic page changes
- Works on `https://www.youtube.com/*` pages

## 📁 File Structure

```
youtube-column-resizer/
├── manifest.json           # Extension configuration
├── background.js          # Service worker
├── popup/
│   ├── popup.html         # Extension popup interface
│   └── popup.js           # Popup functionality
└── content/
    └── contentScript.js   # YouTube page modification
```

## 🎨 UI Features

- Gradient background with floating animation
- Smooth button press effects and scaling animations
- Visual feedback for button states (disabled/active)
- Success/error states with color changes
- Responsive design with glassmorphism effects

## 📝 License

MIT License - Feel free to modify and distribute.

---

*Made with ❤️ for a better YouTube viewing experience*
