const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "/Gleaming").replace(/\/$/, "");

export function assetUrl(fileName: string): string {
  return `${basePath}/${fileName}`;
}
