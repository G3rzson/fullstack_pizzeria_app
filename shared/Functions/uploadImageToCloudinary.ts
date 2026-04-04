import cloudinary from "@/lib/claudinary";
import { UploadApiResponse } from "cloudinary";

export async function uploadImageToCloudinary(
  pizzaImage: File,
  menuType: "pizzas" | "pastas" | "drinks",
): Promise<UploadApiResponse> {
  const bytes = await pizzaImage.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: menuType,
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
