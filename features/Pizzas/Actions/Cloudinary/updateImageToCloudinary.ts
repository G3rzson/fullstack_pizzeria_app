import cloudinary from "@/lib/claudinary";
import { UploadApiResponse } from "cloudinary";

export async function updateImageToCloudinary(
  pizzaImage: File,
  publicId: string | undefined,
): Promise<UploadApiResponse> {
  const bytes = await pizzaImage.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadOptions = publicId
    ? {
        // Existing asset update: pass only public_id so Cloudinary overwrites the same resource.
        public_id: publicId,
        overwrite: true,
        invalidate: true,
      }
    : {
        // Fallback for legacy rows without image/publicId.
        folder: "pizzas",
        overwrite: true,
        invalidate: true,
      };

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) reject(error);
        else resolve(result!);
      })
      .end(buffer);
  });
  return result;
}
