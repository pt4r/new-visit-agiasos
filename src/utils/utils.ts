import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

type ContentCollectionKey = "blog" | "events" | "activities" | "apartments" | "shops" | "products";

/**
 * Fetches collection items with locale awareness.
 * For non-default locales (e.g. Greek): prefer the locale version, fall back to English.
 * For the default locale (English): only show items that have an English version.
 */
export async function getCollectionWithFallback<T extends ContentCollectionKey>(
  collection: T,
  locale: string,
  filter?: (entry: CollectionEntry<T>) => boolean
): Promise<CollectionEntry<T>[]> {
  const allItems = await getCollection(collection);
  const filtered = filter ? allItems.filter(filter) : allItems;

  const bySlug = new Map<string, { en?: CollectionEntry<T>; el?: CollectionEntry<T> }>();

  for (const item of filtered) {
    const slug = item.id.replace(/^(en|el)\//, "");
    const itemLocale = item.id.startsWith("el/") ? "el" : "en";
    const group = bySlug.get(slug) || {};
    group[itemLocale] = item;
    bySlug.set(slug, group);
  }

  const result: CollectionEntry<T>[] = [];

  for (const [, group] of bySlug) {
    if (locale === "en") {
      if (group.en) result.push(group.en);
    } else {
      const preferred = group[locale as "el"] ?? group.en;
      if (preferred) result.push(preferred);
    }
  }

  return result;
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
import type { ImageMetadata } from "astro";

interface ImageOptions {
  loading?: "eager" | "lazy";
  width?: number;
  height?: number;
}

export async function getOptimizedImage(image: ImageMetadata, opts?: ImageOptions) {
  return getImage({
    src: image,
    format: "webp",
    loading: opts?.loading ?? "eager",
    width: opts?.width,
    height: opts?.height,
  });
}

export async function getMobileOptimizedImage(image: ImageMetadata, width?: number, height?: number) {
  return getImage({
    src: image,
    format: "webp",
    loading: "lazy",
    width,
    height,
  });
}

export function resolveImagePath(src: string): string {
  if (src.startsWith("/")) return src;
  const match = src.match(/assets\/images\/products\/.+/);
  return match ? `/${match[0]}` : src;
}

export function trimArrSlashes(arr: string[]) {
  return arr.map((str) => str.replace(/^\/+|\/+$/g, ""));
}

export function trimStringSlashes(arr: string) {
  return arr.replace(/^\/+|\/+$/g, "");
}
