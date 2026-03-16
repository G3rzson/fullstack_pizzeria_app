import cloudinary from "@/lib/claudinary";
import { UploadApiResponse } from "cloudinary";

export async function updateImageToCloudinary(
  pizzaImage: File,
  publicId: string | undefined,
): Promise<UploadApiResponse> {
  const bytes = await pizzaImage.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "pizzas",
          public_id: publicId || undefined, // opcionális, ha fix nevet akarsz
          overwrite: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!);
        },
      )
      .end(buffer);
  });
  return result;
}
