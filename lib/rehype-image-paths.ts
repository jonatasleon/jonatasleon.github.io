import { visit } from 'unist-util-visit';
import type { Root } from 'hast';
import type { Plugin } from 'unified';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export function rehypeImagePaths(slug: string): Plugin<[], Root> {
  return () => {
    return async (tree: Root) => {
      const imagePromises: Promise<void>[] = [];

      visit(tree, 'element', (node) => {
        if (node.tagName === 'img' && node.properties?.src) {
          const src = node.properties.src as string;
          let imagePath = src;

          // Transform relative paths (./image.png or image.png) to absolute paths
          if (
            src.startsWith('./') ||
            (!src.startsWith('/') && !src.startsWith('http'))
          ) {
            // Remove leading ./ if present
            const imageName = src.replace(/^\.\//, '');
            // Transform to absolute path: /posts/[slug]/image.png
            imagePath = `/posts/${slug}/${imageName}`;

            // Check if WebP version exists and use it instead
            const imageNameWithoutExt = imageName.replace(
              /\.(png|jpg|jpeg)$/i,
              ''
            );
            const webpPath = `/posts/${slug}/${imageNameWithoutExt}.webp`;
            const publicWebpPath = path.join(process.cwd(), 'public', webpPath);

            if (fs.existsSync(publicWebpPath)) {
              node.properties.src = webpPath;
              imagePath = webpPath;
            } else {
              node.properties.src = imagePath;
            }
          }

          // Get image dimensions and add optimization attributes
          const imagePromise = (async () => {
            try {
              // Resolve the actual file path
              const publicPath = path.join(process.cwd(), 'public', imagePath);
              const postsPath = path.join(
                process.cwd(),
                'posts',
                slug,
                imagePath.split('/').pop() || ''
              );

              let actualImagePath: string | null = null;
              if (fs.existsSync(publicPath)) {
                actualImagePath = publicPath;
              } else if (fs.existsSync(postsPath)) {
                actualImagePath = postsPath;
              }

              if (actualImagePath) {
                const metadata = await sharp(actualImagePath).metadata();
                const { width, height } = metadata;

                if (width && height) {
                  // Add width and height to prevent layout shift
                  node.properties.width = width;
                  node.properties.height = height;

                  // Add loading="lazy" for better performance
                  node.properties.loading = 'lazy';

                  // Add decoding="async" for better performance
                  node.properties.decoding = 'async';

                  // Add sizes attribute for responsive images
                  // Assuming max-width of content is 800px (from CSS)
                  node.properties.sizes = '(max-width: 800px) 100vw, 800px';
                }
              }
            } catch (error) {
              // If we can't read the image, just continue without dimensions
              // This won't break the build
              console.warn(
                `Could not read image dimensions for ${imagePath}:`,
                error
              );
            }
          })();

          imagePromises.push(imagePromise);

          // Add alt text if missing (SEO improvement)
          if (!node.properties.alt) {
            // Use image filename without extension as alt text
            const imageName =
              (node.properties.src as string)
                .split('/')
                .pop()
                ?.replace(/\.[^/.]+$/, '') || 'Blog post image';
            node.properties.alt = imageName;
          }
        }
      });

      // Wait for all image metadata to be loaded
      await Promise.all(imagePromises);
    };
  };
}
