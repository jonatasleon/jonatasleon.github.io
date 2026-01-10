const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const siteUrl = 'https://jonatasleon.com';
const postsDirectory = path.join(process.cwd(), 'posts');
const publicDirectory = path.join(process.cwd(), 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDirectory)) {
  fs.mkdirSync(publicDirectory, { recursive: true });
}

// Generate sitemap.xml
function generateSitemap() {
  const posts = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const filePath = path.join(postsDirectory, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);

      // Handle different date formats
      let dateString = '';
      if (data.date) {
        if (data.date instanceof Date) {
          dateString = data.date.toISOString().split('T')[0];
        } else {
          dateString = String(data.date).split(' ')[0]; // Get date part only
        }
      } else {
        dateString = new Date().toISOString().split('T')[0];
      }

      return {
        slug: file.replace(/\.md$/, ''),
        date: dateString,
      };
    })
    .sort((a, b) => {
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return 0;
    });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${posts
  .map((post) => {
    // post.date is already formatted as YYYY-MM-DD
    return `  <url>
    <loc>${siteUrl}/posts/${post.slug}/</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(publicDirectory, 'sitemap.xml'), sitemap);
  console.log('✓ Generated sitemap.xml');
}

// Generate robots.txt
function generateRobotsTxt() {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

  fs.writeFileSync(path.join(publicDirectory, 'robots.txt'), robotsTxt);
  console.log('✓ Generated robots.txt');
}

// Run generators
try {
  generateSitemap();
  generateRobotsTxt();
  console.log('✓ SEO files generated successfully!');
} catch (error) {
  console.error('Error generating SEO files:', error);
  process.exit(1);
}
