/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
// If repo name ends with .github.io, use empty basePath (user/organization site)
// Otherwise, use repo name as basePath (project site)
const basePath =
  isProd && repoName && !repoName.endsWith('.github.io') ? `/${repoName}` : '';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
};

module.exports = nextConfig;
