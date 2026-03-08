import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const blogsCollection = defineCollection({
	loader: glob({
		pattern: "**/[^_]*.{md,mdx}",
		base: "./src/content/blog",
	}),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string().default(""),
			author: z.string(),
			date: z.coerce.date(),
			tags: z.array(z.string()).default([]),
			image: z.string().optional(),
			imageAlt: z.string().default(""),
		}),
});

const eventsCollection = defineCollection({
	loader: glob({
		pattern: "**/[^_]*.{md,mdx}",
		base: "./src/content/events",
	}),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string().default(""),
			date: z.coerce.date(),
			tags: z.array(z.string()).default([]),
			image: z.string().optional(),
			imageAlt: z.string().default(""),
		}),
});

const activitiesCollection = defineCollection({
	loader: glob({
		pattern: "**/[^_]*.{md,mdx}",
		base: "./src/content/activities",
	}),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string().default(""),
			date: z.coerce.date().optional().nullable(),
			tags: z.array(z.string()).default([]),
			image: z.string().optional(),
			imageAlt: z.string().default(""),
		}),
});

const apartmentsCollection = defineCollection({
	loader: glob({
		pattern: "**/[^_]*.{md,mdx}",
		base: "./src/content/apartments",
	}),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string().default(""),
			type: z.string().default("rent"),
			address: z
				.object({
					lineOne: z.string().optional(),
					city: z.string().optional(),
					zip: z.string().optional(),
					mapLink: z.string().optional(),
				})
				.optional(),
			date: z.coerce.date().optional().nullable(),
			tags: z.array(z.string()).default([]),
			image: z.string().optional(),
			imageAlt: z.string().default(""),
		}),
});

const shopsCollection = defineCollection({
	loader: glob({
		pattern: "**/[^_]*.{md,mdx}",
		base: "./src/content/shops",
	}),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string().default(""),
			address: z
				.object({
					lineOne: z.string().optional(),
					lineTwo: z.string().optional(),
					city: z.string().optional(),
					zip: z.string().optional(),
					mapLink: z.string().optional(),
				})
				.optional(),
			contact: z
				.object({
					phone: z.string().optional(),
					email: z.string().optional(),
					website: z.string().optional(),
					facebook: z.string().optional(),
					instagram: z.string().optional(),
				})
				.optional(),
			tags: z.array(z.string()).default([]),
			image: z.string().optional(),
			imageAlt: z.string().default(""),
		}),
});

const productsCollection = defineCollection({
	loader: glob({
		pattern: "**/[^_]*.{md,mdx}",
		base: "./src/content/products",
	}),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string().default(""),
			price: z.number(),
			compareAtPrice: z.number().optional().nullable(),
			stripePriceId: z.string(),
			available: z.boolean().default(true),
			images: z.array(z.string()).default([]),
			image: z.string().optional(),
			imageAlt: z.string().default(""),
		}),
});

const poisCollection = defineCollection({
	loader: glob({
		pattern: "**/[^_]*.{md,mdx}",
		base: "./src/content/pois",
	}),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string().default(""),
			excerpt: z.string().default(""),
			primaryImage: z.string().optional(),
			galleryImages: z.array(z.string()).default([]),
			mapLat: z.string().default(""),
			mapLng: z.string().default(""),
			tags: z.array(z.string()).default([]),
		}),
});

const professionsCollection = defineCollection({
	loader: glob({
		pattern: "**/[^_]*.{md,mdx}",
		base: "./src/content/professions",
	}),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string().default(""),
			excerpt: z.string().default(""),
			primaryImage: z.string().optional(),
			galleryImages: z.array(z.string()).default([]),
			mapLat: z.string().default(""),
			mapLng: z.string().default(""),
		}),
});

export const collections = {
	blog: blogsCollection,
	events: eventsCollection,
	activities: activitiesCollection,
	apartments: apartmentsCollection,
	shops: shopsCollection,
	products: productsCollection,
	pois: poisCollection,
	professions: professionsCollection,
};
