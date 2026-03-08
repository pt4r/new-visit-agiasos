/**
 * Converts all JPG/JPEG/PNG images to WebP in both src/assets/images/ and
 * public/assets/images/, then updates every reference across the source tree.
 *
 * Usage:
 *   node scripts/convert-images.mjs          – convert everything
 *   node scripts/convert-images.mjs --dry-run – preview without changes
 */
import sharp from "sharp";
import { readdir, readFile, writeFile, unlink, access, stat } from "fs/promises";
import { join, extname, basename, relative } from "path";
import { fileURLToPath } from "url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const DRY_RUN = process.argv.includes("--dry-run");

const IMAGE_DIRS = [
  join(ROOT, "public", "assets", "images"),
  join(ROOT, "src", "assets", "images"),
];

const SRC_DIR = join(ROOT, "src");
const PUBLIC_ADMIN = join(ROOT, "public", "admin");

const CONVERTIBLE_EXTS = new Set([".jpg", ".jpeg", ".png"]);

const SOURCE_FILE_EXTS = new Set([
  ".astro", ".md", ".mdoc", ".json", ".ts", ".tsx",
  ".js", ".jsx", ".css", ".less", ".html", ".yml", ".yaml",
]);

const WEBP_QUALITY = 80;

// ---------------------------------------------------------------------------

async function dirExists(dir) {
  try {
    return (await stat(dir)).isDirectory();
  } catch {
    return false;
  }
}

async function walk(dir) {
  const results = [];
  if (!(await dirExists(dir))) return results;

  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walk(full)));
    } else {
      results.push(full);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Phase 1 – Convert images
// ---------------------------------------------------------------------------

async function convertImages() {
  const conversions = [];

  for (const imageDir of IMAGE_DIRS) {
    const files = await walk(imageDir);
    const toConvert = files.filter((f) =>
      CONVERTIBLE_EXTS.has(extname(f).toLowerCase())
    );

    for (const filePath of toConvert) {
      const ext = extname(filePath);
      const webpPath = filePath.slice(0, -ext.length) + ".webp";

      // If a .webp already exists, just delete the original
      try {
        await access(webpPath);
        if (!DRY_RUN) await unlink(filePath);
        console.log(`  ${DRY_RUN ? "[dry-run] Would delete" : "Deleted"} (webp exists): ${relative(ROOT, filePath)}`);
        conversions.push({ oldName, newName });
        continue;
      } catch {
        /* expected – no existing webp */
      }

      const oldName = basename(filePath);
      const newName = basename(webpPath);

      if (DRY_RUN) {
        console.log(`  [dry-run] Would convert: ${oldName} -> ${newName}`);
        conversions.push({ oldName, newName });
        continue;
      }

      try {
        const fileStat = await stat(filePath);
        if (fileStat.size === 0) {
          if (!DRY_RUN) await unlink(filePath);
          console.log(`  ${DRY_RUN ? "[dry-run] Would delete" : "Deleted"} (empty file): ${relative(ROOT, filePath)}`);
          continue;
        }

        await sharp(filePath).webp({ quality: WEBP_QUALITY }).toFile(webpPath);
        await unlink(filePath);
        console.log(`  Converted: ${oldName} -> ${newName}`);
        conversions.push({ oldName, newName });
      } catch (err) {
        console.error(`  FAILED: ${oldName} – ${err.message}`);
      }
    }
  }

  return conversions;
}

// ---------------------------------------------------------------------------
// Phase 2 – Update references in source files
// ---------------------------------------------------------------------------

async function updateReferences(conversions) {
  if (conversions.length === 0) return 0;

  const sourceFiles = [
    ...(await walk(SRC_DIR)),
    ...(await walk(PUBLIC_ADMIN)),
  ].filter((f) => SOURCE_FILE_EXTS.has(extname(f).toLowerCase()));

  let updatedCount = 0;

  for (const file of sourceFiles) {
    let content = await readFile(file, "utf-8");
    let modified = false;

    for (const { oldName, newName } of conversions) {
      if (content.includes(oldName)) {
        content = content.replaceAll(oldName, newName);
        modified = true;
      }
    }

    if (modified) {
      if (!DRY_RUN) {
        await writeFile(file, content, "utf-8");
      }
      updatedCount++;
      const rel = relative(ROOT, file).replace(/\\/g, "/");
      console.log(`  ${DRY_RUN ? "[dry-run] Would update" : "Updated"}: ${rel}`);
    }
  }

  return updatedCount;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (DRY_RUN) console.log("=== DRY RUN (no files will be changed) ===\n");

  console.log("Scanning for JPG/JPEG/PNG images...\n");
  const conversions = await convertImages();

  if (conversions.length === 0) {
    console.log("\nNo images to convert – everything is already WebP.");
    return;
  }

  console.log(
    `\n${conversions.length} image(s) ${DRY_RUN ? "would be" : ""} converted. Updating references...\n`
  );
  const updatedFiles = await updateReferences(conversions);

  console.log(
    `\nDone! ${conversions.length} image(s) converted, ${updatedFiles} file(s) updated.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
