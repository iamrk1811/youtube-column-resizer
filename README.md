# YouTube Column Resizer

A Chrome extension that allows you to customize the number of video columns displayed on YouTube, making better use of your screen space.

## Features

- 🎯 **Customizable Columns**: Set any number of columns from 1 to 10
- ⚡ **Instant Application**: Changes apply immediately without page reload
- 💾 **Persistent Settings**: Your preferences are saved and restored across sessions
- 🎨 **Beautiful UI**: Modern popup interface with preset buttons
- 🔄 **Dynamic Updates**: Automatically handles YouTube's dynamic content loading

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your Chrome toolbar

## Usage

1. Navigate to YouTube (any page with video grids)
2. Click the extension icon in your Chrome toolbar
3. Enter your desired number of columns (1-10) or use preset buttons
4. Click "Apply" - changes take effect immediately
5. Your setting will persist across page reloads and browser restarts

## How It Works

The extension works by:
- Injecting CSS styles to modify YouTube's grid layout
- Using a MutationObserver to handle dynamic content loading
- Storing your preferences in Chrome's sync storage
- Applying responsive design principles for different screen sizes

## File Structure

```
youtube-column-resizer/
├── manifest.json          # Extension configuration
├── content.js            # Main content script
├── styles.css            # CSS for grid layout modifications
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── icon16.png            # 16x16 extension icon
├── icon48.png            # 48x48 extension icon
├── icon128.png           # 128x128 extension icon
└── README.md             # This file
```

## Browser Compatibility

- Chrome (Manifest V3)
- Edge (Chromium-based)
- Other Chromium-based browsers

## Permissions

- `storage`: To save your column preferences
- `activeTab`: To modify YouTube pages
- `https://www.youtube.com/*`: To inject scripts on YouTube

## Troubleshooting

**Extension not working?**
- Make sure you're on a YouTube page with video grids
- Try refreshing the page after applying settings
- Check that the extension is enabled in `chrome://extensions/`

**Settings not persisting?**
- Ensure Chrome sync is enabled
- Check that you have sufficient storage quota

**Layout looks broken?**
- Try reducing the number of columns
- Some YouTube layouts may not be fully compatible

## Development

To modify the extension:

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes on YouTube

## License

MIT License - feel free to modify and distribute.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
