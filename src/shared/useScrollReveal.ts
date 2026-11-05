import { useEffect, type RefObject } from 'react';

const revealSelector = '.reveal, .section-heading, .category-tile, .campaign';

const revealAll = (root: HTMLElement) => {
  root
    .querySelectorAll<HTMLElement>(revealSelector)
    .forEach((element) => element.classList.add('is-visible'));
};

/**
 * Observes editorial content owned by React, including children added after an
 * API response or catalog update. The visibility fallback protects content in
 * older browsers and for visitors who prefer reduced motion.
 */
export function useScrollReveal(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      revealAll(root);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    const observed = new WeakSet<HTMLElement>();
    const observe = (element: HTMLElement) => {
      if (observed.has(element) || element.classList.contains('is-visible'))
        return;
      observed.add(element);
      observer.observe(element);
    };
    const observeWithin = (node: ParentNode) => {
      if (node instanceof HTMLElement && node.matches(revealSelector))
        observe(node);
      node.querySelectorAll<HTMLElement>(revealSelector).forEach(observe);
    };

    observeWithin(root);
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) observeWithin(node);
        });
      });
    });
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, [rootRef]);
}
