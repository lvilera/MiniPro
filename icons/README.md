# App Icons

## Required Icons

For the PWA, Capacitor, and Electron apps to work properly, you need to generate icons in the following sizes:

### PWA Icons (PNG):
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## How to Generate Icons

### Option 1: Online Tools (Easiest)

1. Create a 512x512 PNG logo/icon for your app
2. Use one of these free tools:
   - **PWA Builder**: https://www.pwabuilder.com/imageGenerator
   - **Real Favicon Generator**: https://realfavicongenerator.net/
   - **App Icon Generator**: https://appicon.co/

3. Download the generated icons
4. Place them in this `/icons/` directory

### Option 2: Manual Creation

Use design tools like:
- Figma (free, web-based)
- Canva (free, web-based)
- GIMP (free, desktop)
- Photoshop (paid)

Export in all required sizes.

### Option 3: Command Line (If you have ImageMagick)

```bash
# Install ImageMagick first
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick
# Windows: https://imagemagick.org/script/download.php

# Then run from project root:
convert your-icon.png -resize 72x72 icons/icon-72x72.png
convert your-icon.png -resize 96x96 icons/icon-96x96.png
convert your-icon.png -resize 128x128 icons/icon-128x128.png
convert your-icon.png -resize 144x144 icons/icon-144x144.png
convert your-icon.png -resize 152x152 icons/icon-152x152.png
convert your-icon.png -resize 192x192 icons/icon-192x192.png
convert your-icon.png -resize 384x384 icons/icon-384x384.png
convert your-icon.png -resize 512x512 icons/icon-512x512.png
```

## Icon Design Tips

1. **Keep it simple**: Small icons need clear, simple designs
2. **Use contrasting colors**: Make sure it stands out
3. **Avoid text**: Text is hard to read at small sizes
4. **Square format**: Don't use rectangular images
5. **Test on dark backgrounds**: iOS uses dark mode
6. **Padding**: Leave ~10% padding around edges

## Current Status

🚧 **Placeholder icons needed!**

Replace these with your actual app icons before publishing.

## For Capacitor (Mobile)

iOS and Android will use these same icons automatically after running:
```bash
npm run capacitor:sync
```

## For Electron (Desktop)

The 512x512 icon will be used for:
- Windows: .exe icon
- macOS: .app icon
- Linux: .AppImage icon

Electron-builder will automatically resize as needed.
