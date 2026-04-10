import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LogoutButton } from "./LogoutButton";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/lib/auth/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/lib/cart/useCart", () => ({
  useCart: vi.fn(),
}));

vi.mock("@/lib/localStorage/localStorage", () => ({
  clearLocalStorage: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/useAuth";
import { useCart } from "@/lib/cart/useCart";
import { clearLocalStorage } from "@/lib/localStorage/localStorage";
import { toast } from "sonner";

const mockUseRouter = useRouter as unknown as Mock;
const mockUseAuth = useAuth as unknown as Mock;
const mockUseCart = useCart as unknown as Mock;

describe("LogoutButton component", () => {
  const push = vi.fn();
  const logout = vi.fn();
  const setCartItems = vi.fn();
  const onBeforeLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseRouter.mockReturnValue({ push });
    mockUseAuth.mockReturnValue({ logout });
    mockUseCart.mockReturnValue({ setCartItems });
    onBeforeLogout.mockReset();

    vi.stubGlobal("fetch", vi.fn());
  });

  describe("successful logout", () => {
    it("fetches /auth/logout, shows success toast, calls logout, and redirects", async () => {
      const user = userEvent.setup();

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ message: "Sikeres kijelentkezés" }),
      } as unknown as Response);

      render(<LogoutButton onBeforeLogout={onBeforeLogout} />);
      await user.click(screen.getByRole("button", { name: /kijelentkezés/i }));

      expect(onBeforeLogout).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith("/auth/logout", { method: "POST" });
      expect(toast.success).toHaveBeenCalledWith("Sikeres kijelentkezés");
      expect(clearLocalStorage).toHaveBeenCalledTimes(1);
      expect(setCartItems).toHaveBeenCalledWith([]);
      expect(logout).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith("/");
    });
  });

  describe("failed logout", () => {
    it("logs error and shows error toast when response is not ok", async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);

      vi.mocked(fetch).mockResolvedValue({
        ok: false,
      } as unknown as Response);

      render(<LogoutButton />);
      await user.click(screen.getByRole("button", { name: /kijelentkezés/i }));

      expect(consoleErrorSpy).toHaveBeenCalledWith("Logout failed");
      expect(toast.error).toHaveBeenCalledWith(
        "Hiba történt a kijelentkezés során",
      );
      expect(clearLocalStorage).not.toHaveBeenCalled();
      expect(setCartItems).not.toHaveBeenCalled();
      expect(logout).not.toHaveBeenCalled();
      expect(push).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("does not redirect on failed logout", async () => {
      const user = userEvent.setup();

      vi.mocked(fetch).mockResolvedValue({
        ok: false,
      } as unknown as Response);

      render(<LogoutButton />);
      await user.click(screen.getByRole("button", { name: /kijelentkezés/i }));

      expect(push).not.toHaveBeenCalled();
      expect(logout).not.toHaveBeenCalled();
    });

    it("handles fetch exception gracefully", async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);

      vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

      render(<LogoutButton onBeforeLogout={onBeforeLogout} />);

      await user.click(screen.getByRole("button", { name: /kijelentkezés/i }));

      expect(onBeforeLogout).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith("/auth/logout", { method: "POST" });
      expect(consoleErrorSpy).toHaveBeenCalledWith("Logout failed");
      expect(toast.error).toHaveBeenCalledWith(
        "Hiba történt a kijelentkezés során",
      );
      expect(clearLocalStorage).not.toHaveBeenCalled();
      expect(setCartItems).not.toHaveBeenCalled();
      expect(logout).not.toHaveBeenCalled();
      expect(push).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("button rendering", () => {
    it("renders with default text", () => {
      render(<LogoutButton />);
      expect(
        screen.getByRole("button", { name: /kijelentkezés/i }),
      ).toBeInTheDocument();
    });

    it("renders with variant outline by default", () => {
      render(<LogoutButton />);
      const button = screen.getByRole("button");
      expect(button.className).toContain("outline");
    });

    it("renders as submit-safe button with expected layout classes", () => {
      render(<LogoutButton />);
      const button = screen.getByRole("button", { name: /kijelentkezés/i });

      expect(button).toHaveAttribute("type", "button");
      expect(button).toHaveClass("w-full");
      expect(button).toHaveClass("cursor-pointer");
    });
  });
});
