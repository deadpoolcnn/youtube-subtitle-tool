# Screenshots

This folder contains screenshots for the README.md file.

## Required Screenshots

Please add the following screenshots to this folder:

1. **login.png** - Login page screenshot

   - Show the login form with typewriter animation
   - Include the animated background
   - Recommended size: 1920x1080 or 1280x720

2. **dashboard.png** - Main dashboard screenshot

   - Show the YouTube URL input and subtitle extraction form
   - Include extracted subtitles if possible
   - Recommended size: 1920x1080 or 1280x720

3. **subtitle-list.png** - Subtitle list page screenshot

   - Show the table with saved subtitles
   - Include at least 2-3 subtitle entries
   - Recommended size: 1920x1080 or 1280x720

4. **dark-mode.png** - Dark mode screenshot
   - Can be any page in dark mode
   - Show the blue/purple gradient theme
   - Recommended size: 1920x1080 or 1280x720

## How to Take Screenshots

### Option 1: Browser Screenshot (Recommended)

1. Run `npm run dev`
2. Open the application in your browser
3. Use browser DevTools (F12) → Device Toolbar to set viewport
4. Take screenshot using browser's built-in screenshot tool

### Option 2: macOS Screenshot

- **Full Screen:** `Cmd + Shift + 3`
- **Selection:** `Cmd + Shift + 4`
- **Window:** `Cmd + Shift + 4`, then press `Space`

### Option 3: Windows Screenshot

- **Full Screen:** `PrtScn` or `Win + PrtScn`
- **Selection:** `Win + Shift + S`

## Tips for Better Screenshots

- Use a clean browser window (hide bookmarks bar)
- Fill in realistic demo data
- Use high resolution (at least 1280px wide)
- Crop to show only the relevant content
- Use PNG format for better quality
- Ensure text is readable

## Image Optimization

After adding screenshots, you can optimize them:

```bash
# Install imagemin-cli (optional)
npm install -g imagemin-cli

# Optimize images
imagemin screenshots/*.png --out-dir=screenshots
```
