import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CartImage from "./CartImage";
import { createPastaItem } from "../_testHelpers/testHelpers";

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

vi.mock("lucide-react", () => ({
  Image: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="fallback-image-icon" {...props} />
  ),
}));

vi.mock("@/lib/claudinary/generateBlurUrl", () => ({
  generateBlurUrl: vi.fn(),
}));

import { generateBlurUrl } from "@/lib/claudinary/generateBlurUrl";

describe("CartImage component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders product image with generated blur placeholder when image exists", () => {
    const imageUrl = "https://cdn.example.com/pasta.jpg";
    const itemWithImage = createPastaItem({
      id: "pasta-1",
      name: "spaghetti",
      price: 3800,
    });
    itemWithImage.product.image = { publicUrl: imageUrl };

    vi.mocked(generateBlurUrl).mockReturnValue("data:image/png;base64,abc");

    render(<CartImage item={itemWithImage} />);

    const image = screen.getByRole("img", { name: "pasta-kép" });
    expect(image).toHaveAttribute("src", imageUrl);

    expect(generateBlurUrl).toHaveBeenCalledWith(imageUrl);
    expect(screen.queryByTestId("fallback-image-icon")).not.toBeInTheDocument();
  });

  it("renders fallback icon when image is missing", () => {
    const itemWithoutImage = createPastaItem({
      id: "pasta-2",
      name: "penne",
      price: 3200,
    });

    render(<CartImage item={itemWithoutImage} />);

    expect(screen.getByTestId("fallback-image-icon")).toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: "pasta-kép" }),
    ).not.toBeInTheDocument();
    expect(generateBlurUrl).not.toHaveBeenCalled();
  });
});
