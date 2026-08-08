import { mkdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const PRIVATE_ROOT = path.join(process.cwd(), ".private_uploads");
const allowedExtensions = new Set(["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "png", "jpg", "jpeg", "webp", "gif", "zip"]);
const previewable = new Set(["pdf", "txt", "png", "jpg", "jpeg", "webp", "gif"]);

export function extensionFromName(name: string) {
  return name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
}

export function isAllowedDocument(name: string) {
  return allowedExtensions.has(extensionFromName(name));
}

export function canPreview(extension: string) {
  return previewable.has(extension.toLowerCase());
}

export async function savePrivateFile(userId: string, file: File) {
  const extension = extensionFromName(file.name);
  if (!allowedExtensions.has(extension)) {
    throw new Error("Unsupported file type");
  }
  if (file.size > 25 * 1024 * 1024) {
    throw new Error("File size must be under 25 MB in this local workspace build");
  }
  const userDir = path.join(PRIVATE_ROOT, userId);
  await mkdir(userDir, { recursive: true });
  const storageKey = `${randomUUID()}.${extension}`;
  const absolutePath = path.join(userDir, storageKey);
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, bytes);
  return { storageKey, extension, sizeBytes: bytes.length, mimeType: file.type || "application/octet-stream" };
}

export function resolvePrivatePath(userId: string, storageKey: string) {
  const safeKey = path.basename(storageKey);
  return path.join(PRIVATE_ROOT, userId, safeKey);
}

export async function readPrivateFile(userId: string, storageKey: string) {
  const absolutePath = resolvePrivatePath(userId, storageKey);
  const [buffer, info] = await Promise.all([readFile(absolutePath), stat(absolutePath)]);
  return { buffer, info };
}

export async function deletePrivateFile(userId: string, storageKey: string) {
  try {
    await unlink(resolvePrivatePath(userId, storageKey));
  } catch {
    // Metadata deletion should not fail if the object was already removed.
  }
}
