import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

type ContentCollectionKey = "blog" | "events" | "activities" | "apartments" | "shops" | "products";

/**
 * Fetches collection items with English fallback.
 * If a Greek translation exists for a slug, use it; otherwise fall back to English.
 */
export async function getCollectionWithFallback<T extends ContentCollectionKey>(
  collection: T,
  locale: string,
  filter?: (entry: CollectionEntry<T>) => boolean
): Promise<CollectionEntry<T>[]> {
  const allItems = await getCollection(collection);
  const filtered = filter ? allItems.filter(filter) : allItems;

  const slugMap = new Map<string, CollectionEntry<T>>();

  for (const item of filtered) {
    const slug = item.id.replace(/^(en|el)\//, "");
    const itemLocale = item.id.startsWith("el/") ? "el" : "en";
    const existing = slugMap.get(slug);

    if (!existing) {
      slugMap.set(slug, item);
    } else {
      const existingLocale = existing.id.startsWith("el/") ? "el" : "en";
      if (itemLocale === locale) {
        slugMap.set(slug, item);
      } else if (existingLocale !== locale && itemLocale === "en") {
        slugMap.set(slug, item);
      }
    }
  }

  return Array.from(slugMap.values());
}

const localeMap: Record<string, string> = {
  en: "en-US",
  el: "el-GR",
};

export function formatDate(date: string | number | Date, locale: string = "en"): string {
  return new Date(date).toLocaleDateString(localeMap[locale] || locale, {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

import { getImage } from "astro:assets";

export async function getOptimizedImage(image: ImageMetadata) {
  const optimizedImage = await getImage({
    src: image,
    format: "webp",
    loading: "eager",
  });

  return optimizedImage;
}

export async function getMobileOptimizedImage(image: ImageMetadata, width?: number, height?: number) {
  const optimizedImage = await getImage({
    src: image,
    format: "webp",
    loading: "eager",
    width,
    height
  });

  return optimizedImage;
}

export function trimArrSlashes(arr: string[]) {
  return arr.map((str) => str.replace(/^\/+|\/+$/g, ""));
}

export function trimStringSlashes(arr: string) {
  return arr.replace(/^\/+|\/+$/g, "");
}
