import { useEffect } from 'react';
import { headTags, scriptJson, type PageMeta } from './meta';

export function usePageMeta(meta: PageMeta) {
  const key = JSON.stringify(meta);

  useEffect(() => {
    const tags = headTags(JSON.parse(key) as PageMeta);
    document.head.querySelectorAll('[data-head]').forEach(element => element.remove());
    const anchor = document.head.querySelector('link[rel="icon"]');
    for (const tag of tags) {
      const element = document.createElement(tag.tag);
      element.setAttribute('data-head', '');
      if (tag.tag === 'title') element.textContent = tag.text;
      else if (tag.tag === 'script') {
        element.setAttribute('type', 'application/ld+json');
        element.textContent = scriptJson(tag.json);
      } else for (const [name, value] of Object.entries(tag.attrs)) element.setAttribute(name, value);
      document.head.insertBefore(element, anchor);
    }
  }, [key]);
}
