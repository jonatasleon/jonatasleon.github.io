import { visit } from 'unist-util-visit';
import type { Root } from 'hast';
import type { Plugin } from 'unified';

export function rehypeImagePaths(slug: string): Plugin<[], Root> {
  return () => {
    return (tree: Root) => {
      visit(tree, 'element', (node) => {
        if (node.tagName === 'img' && node.properties?.src) {
          const src = node.properties.src as string;
          // Transform relative paths (./image.png or image.png) to absolute paths
          if (src.startsWith('./') || (!src.startsWith('/') && !src.startsWith('http'))) {
            // Remove leading ./ if present
            const imageName = src.replace(/^\.\//, '');
            // Transform to absolute path: /posts/[slug]/image.png
            node.properties.src = `/posts/${slug}/${imageName}`;
          }
        }
      });
    };
  };
}

