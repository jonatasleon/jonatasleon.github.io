# Personal Blog

A modern, static blog built with Next.js and designed to be hosted on GitHub Pages.

## Features

- ✍️ Write blog posts in Markdown
- 🚀 Automatic deployment via GitHub Actions
- 🎨 Clean, responsive design
- 📱 Mobile-friendly
- ⚡ Fast static site generation
- 🔍 SEO-friendly

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A GitHub account

### Local Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Creating Blog Posts

1. Create a new `.md` file in the `posts/` directory
2. Add frontmatter at the top:

   ```markdown
   ---
   title: Your Post Title
   date: 2024-01-15
   excerpt: A brief description of your post (optional)
   ---
   ```

3. Write your content in Markdown below the frontmatter
4. Save the file with a `.md` extension

### Example Post

```markdown
---
title: My First Blog Post
date: 2024-01-15
excerpt: This is a sample blog post
---

# My First Blog Post

This is the content of my blog post. You can use **bold**, _italic_, and other Markdown features.

## Subheading

- List item 1
- List item 2

[Link text](https://example.com)
```

## Deployment

### Setting up GitHub Pages

1. **Push your code to GitHub:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "GitHub Actions"
   - The workflow will automatically deploy on every push to `main`

3. **Configure repository name (if needed):**
   - If your repository name is not `jonatasleon.github.io`, update the `basePath` in `next.config.js`
   - Or set the `GITHUB_REPOSITORY` environment variable in your GitHub Actions workflow

### Build for Production

To build the site locally:

```bash
npm run build
```

The static files will be generated in the `out/` directory.

## Project Structure

```plaintext
jonatasleon.github.io/
├── posts/               # Markdown blog posts
├── pages/               # Next.js pages
│   ├── index.tsx        # Home page
│   └── posts/[slug].tsx # Individual post pages
├── components/          # React components
├── lib/                 # Utility functions
├── styles/              # Global styles
├── .github/
│   └── workflows/       # GitHub Actions workflow
└── public/              # Static assets
```

## Customization

### Styling

- Global styles: Edit `styles/globals.css`
- Component styles: Edit the `<style jsx>` blocks in each component
- Layout: Modify `components/Layout.tsx`

### Configuration

- Blog title and description: Edit `pages/index.tsx`
- Site metadata: Modify `components/Layout.tsx`
- Build settings: Edit `next.config.js`

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - Frontmatter parsing
- [remark](https://remark.js.org/) - Markdown processing
- [GitHub Actions](https://github.com/features/actions) - CI/CD

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
