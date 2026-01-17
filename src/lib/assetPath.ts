const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const withBasePath = (src: string) => {
  if (!basePath) return src;
  if (src.startsWith(basePath)) return src;
  if (src.startsWith("/")) return `${basePath}${src}`;
  return src;
};
