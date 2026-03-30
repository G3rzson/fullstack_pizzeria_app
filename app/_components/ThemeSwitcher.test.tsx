import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeSwitcher } from "./ThemeSwitcher";

// Mock next-themes
const mockSetTheme = vi.fn();
vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({
    theme: "light",
    setTheme: mockSetTheme,
  })),
}));

import { useTheme } from "next-themes";
const mockUseTheme = useTheme as Mock;

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render spinner initially before mounted", () => {
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    render(<ThemeSwitcher />);

    // Spinner látható mount előtt
    expect(screen.getByTitle("Téma kiválasztása")).toBeInTheDocument();
  });

  it("should render correct icon for light theme", async () => {
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    const { rerender } = render(<ThemeSwitcher />);

    // Re-render után a Sun ikon jelenik meg
    rerender(<ThemeSwitcher />);

    await waitFor(() => {
      const button = screen.getByRole("button", { name: /téma kiválasztása/i });
      expect(button).toBeInTheDocument();
    });
  });

  it("should render correct icon for dark theme", async () => {
    mockUseTheme.mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
    });

    const { rerender } = render(<ThemeSwitcher />);
    rerender(<ThemeSwitcher />);

    await waitFor(() => {
      const button = screen.getByRole("button", { name: /téma kiválasztása/i });
      expect(button).toBeInTheDocument();
    });
  });

  it("should open dropdown and show theme options", async () => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    const { rerender } = render(<ThemeSwitcher />);
    rerender(<ThemeSwitcher />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /téma kiválasztása/i }),
      ).toBeInTheDocument();
    });

    const button = screen.getByRole("button", { name: /téma kiválasztása/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Világos")).toBeInTheDocument();
      expect(screen.getByText("Sötét")).toBeInTheDocument();
      expect(screen.getByText("Rendszer")).toBeInTheDocument();
    });
  });

  it("should call setTheme when selecting a theme", async () => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    const { rerender } = render(<ThemeSwitcher />);
    rerender(<ThemeSwitcher />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /téma kiválasztása/i }),
      ).toBeInTheDocument();
    });

    const button = screen.getByRole("button", { name: /téma kiválasztása/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Sötét")).toBeInTheDocument();
    });

    const darkOption = screen.getByText("Sötét");
    await user.click(darkOption);

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });
});
