import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeSwitcher } from "./ThemeSwitcher";

// Mock next-themes dependency
vi.mock("next-themes", () => ({
  useTheme: vi.fn(),
}));

// Import the mocked useTheme function
import { useTheme } from "next-themes";

// Typecast the mocked useTheme function to Mock
const mockUseTheme = useTheme as unknown as Mock;

describe("ThemeSwitcher component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state when mount effect is suppressed", async () => {
    vi.resetModules();

    vi.doMock("react", async (importOriginal) => {
      const actual = await importOriginal<typeof import("react")>();
      return {
        ...actual,
        useEffect: vi.fn(),
      };
    });

    vi.doMock("next-themes", () => ({
      useTheme: () => ({
        theme: "light",
        setTheme: vi.fn(),
        themes: ["light", "dark", "system"],
        forcedTheme: undefined,
        resolvedTheme: "light",
        systemTheme: "light",
      }),
    }));

    const { ThemeSwitcher: ThemeSwitcherWithSuppressedEffect } =
      await import("./ThemeSwitcher");

    render(<ThemeSwitcherWithSuppressedEffect />);

    expect(
      screen.getByRole("button", {
        name: /loading theme/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: /aktív téma:/i,
      }),
    ).not.toBeInTheDocument();

    vi.doUnmock("react");
    vi.doUnmock("next-themes");
    vi.resetModules();
  });

  it("renders active theme button with current theme aria-label", async () => {
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: vi.fn(),
      themes: ["light", "dark", "system"],
      forcedTheme: undefined,
      resolvedTheme: "light",
      systemTheme: "light",
    });

    render(<ThemeSwitcher />);

    const activeThemeButton = await screen.findByRole("button", {
      name: /aktív téma:\s*világos/i,
    });

    expect(activeThemeButton).toBeInTheDocument();
  });

  it("calls setTheme when user selects another theme", async () => {
    const user = userEvent.setup();
    const setTheme = vi.fn();

    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme,
      themes: ["light", "dark", "system"],
      forcedTheme: undefined,
      resolvedTheme: "light",
      systemTheme: "light",
    });

    render(<ThemeSwitcher />);

    const activeThemeButton = await screen.findByRole("button", {
      name: /aktív téma:\s*világos/i,
    });
    await user.click(activeThemeButton);

    const darkOption = await screen.findByText("Sötét");
    await user.click(darkOption);

    expect(setTheme).toHaveBeenCalledWith("dark");
  });
});
