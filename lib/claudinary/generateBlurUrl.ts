export function generateBlurUrl(publicUrl: string): string {
  if (!publicUrl || !publicUrl.includes("cloudinary.com")) {
    return publicUrl;
  }

  // Split the URL at '/upload/' to insert transformations
  const parts = publicUrl.split("/upload/");

  if (parts.length !== 2) {
    return publicUrl;
  }

  // Add blur transformations: small size, low quality, blur effect
  // w_10 = width 10px (very small for fast loading)
  // q_10 = quality 10% (minimal quality for placeholder)
  // e_blur:1000 = strong blur effect
  // f_auto = auto format selection
  const transformations = "w_10,q_10,e_blur:1000,f_auto";

  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
}
