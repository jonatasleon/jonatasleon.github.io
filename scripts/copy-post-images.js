const fs = require('fs');
const path = require('path');

const postsDirectory = path.join(process.cwd(), 'posts');
const publicDirectory = path.join(process.cwd(), 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDirectory)) {
  fs.mkdirSync(publicDirectory, { recursive: true });
}

// Get all markdown files
const markdownFiles = fs.readdirSync(postsDirectory)
  .filter(file => file.endsWith('.md'))
  .map(file => file.replace(/\.md$/, ''));

// Copy images for each post
markdownFiles.forEach(slug => {
  const postImageDir = path.join(postsDirectory, slug);
  const publicImageDir = path.join(publicDirectory, 'posts', slug);

  // Check if post has an image directory
  if (fs.existsSync(postImageDir) && fs.statSync(postImageDir).isDirectory()) {
    // Ensure public/posts/[slug] directory exists
    if (!fs.existsSync(publicImageDir)) {
      fs.mkdirSync(publicImageDir, { recursive: true });
    }

    // Copy all image files
    const imageFiles = fs.readdirSync(postImageDir).filter(file => 
      /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file)
    );

    imageFiles.forEach(imageFile => {
      const sourcePath = path.join(postImageDir, imageFile);
      const destPath = path.join(publicImageDir, imageFile);
      
      // Only copy if source is newer or destination doesn't exist
      if (!fs.existsSync(destPath) || 
          fs.statSync(sourcePath).mtime > fs.statSync(destPath).mtime) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied: ${sourcePath} -> ${destPath}`);
      }
    });
  }
});

console.log('Finished copying post images to public directory');

