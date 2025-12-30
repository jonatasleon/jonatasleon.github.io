const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const postsDirectory = path.join(process.cwd(), 'posts');
const publicDirectory = path.join(process.cwd(), 'public');

// Maximum width for images (content max-width is 800px, but we'll allow up to 1200px for retina displays)
const MAX_WIDTH = 1200;
const QUALITY = 85; // JPEG/WebP quality

// Ensure public directory exists
if (!fs.existsSync(publicDirectory)) {
  fs.mkdirSync(publicDirectory, { recursive: true });
}

// Get all markdown files
const markdownFiles = fs.readdirSync(postsDirectory)
  .filter(file => file.endsWith('.md'))
  .map(file => file.replace(/\.md$/, ''));

// Optimize and copy images for each post
async function optimizeAndCopyImage(sourcePath, destPath) {
  try {
    const metadata = await sharp(sourcePath).metadata();
    const { width, height, format } = metadata;
    
    // Skip SVG files (they're already optimized)
    if (format === 'svg') {
      fs.copyFileSync(sourcePath, destPath);
      return;
    }
    
    // Determine if we need to resize
    const needsResize = width > MAX_WIDTH;
    const targetWidth = needsResize ? MAX_WIDTH : width;
    
    // Create sharp instance
    let pipeline = sharp(sourcePath);
    
    // Resize if needed
    if (needsResize) {
      pipeline = pipeline.resize(targetWidth, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }
    
    // Convert to WebP for better compression (WebP supports transparency)
    const outputFormat = 'webp';
    const outputPath = destPath.replace(/\.(png|jpg|jpeg)$/i, `.${outputFormat}`);
    
    await pipeline
      .webp({ 
        quality: QUALITY,
        effort: 6 // Higher effort = better compression but slower
      })
      .toFile(outputPath);
    
    const originalSize = fs.statSync(sourcePath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
    
    console.log(`Optimized: ${path.basename(sourcePath)} -> ${path.basename(outputPath)} (${savings}% smaller)`);
  } catch (error) {
    // If optimization fails, fall back to copying the original
    console.warn(`Failed to optimize ${sourcePath}, copying original:`, error.message);
    fs.copyFileSync(sourcePath, destPath);
  }
}

// Copy images for each post
async function processImages() {
  for (const slug of markdownFiles) {
    const postImageDir = path.join(postsDirectory, slug);
    const publicImageDir = path.join(publicDirectory, 'posts', slug);

    // Check if post has an image directory
    if (fs.existsSync(postImageDir) && fs.statSync(postImageDir).isDirectory()) {
      // Ensure public/posts/[slug] directory exists
      if (!fs.existsSync(publicImageDir)) {
        fs.mkdirSync(publicImageDir, { recursive: true });
      }

      // Get all image files
      const imageFiles = fs.readdirSync(postImageDir).filter(file => 
        /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file)
      );

      // Process each image
      for (const imageFile of imageFiles) {
        const sourcePath = path.join(postImageDir, imageFile);
        const destPath = path.join(publicImageDir, imageFile);
        
        // Only process if source is newer or destination doesn't exist
        if (!fs.existsSync(destPath) || 
            fs.statSync(sourcePath).mtime > fs.statSync(destPath).mtime) {
          await optimizeAndCopyImage(sourcePath, destPath);
        }
      }
    }
  }
}

processImages()
  .then(() => {
    console.log('Finished copying and optimizing post images to public directory');
  })
  .catch((error) => {
    console.error('Error processing images:', error);
    process.exit(1);
  });

