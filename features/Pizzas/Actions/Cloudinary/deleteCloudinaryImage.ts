import cloudinary from "@/lib/claudinary";

export async function deleteCloudinaryImage(publicId: string | undefined) {
  if (!publicId) return;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary image deleted:", result);
  } catch (error) {
    console.error("Error deleting Cloudinary image:", error);
  }
}
