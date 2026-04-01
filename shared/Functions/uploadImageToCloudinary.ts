import cloudinary from "@/lib/claudinary";
import { UploadApiResponse } from "cloudinary";
import { type MenuType } from "../Types/types";

export async function uploadImageToCloudinary(
  pizzaImage: File,
  menuType: MenuType,
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
