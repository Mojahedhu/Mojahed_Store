import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || "dq50cghzf",
  api_key: process.env.CLOUDINARY_API_KEY || "236573625374868",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "p2kM2KBXvcQMJj7vZZqQUZhXOnk",
});

/**
 * List all images in a folder (optional)
 * @param folder string - folder name like "products/"
 */

export const listAllImage = async (folder?: string): Promise<string[]> => {
  try {
    let allImages = [];
    let nextCursor: string | undefined;
    do {
      const res = await cloudinary.api.resources({
        type: "upload",
        prefix: `${folder}/images`,
        max_results: 100,
        next_cursor: nextCursor,
      });
      allImages.push(...res.resources);
      nextCursor = res.next_cursor;
    } while (nextCursor);
    return allImages;
  } catch (error) {
    const caError = error as Error;
    console.log(caError);
    throw new Error(caError.message || String(error));
  }
};
