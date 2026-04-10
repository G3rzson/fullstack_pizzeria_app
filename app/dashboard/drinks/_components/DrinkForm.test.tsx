import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest";

// Polyfill ResizeObserver for Radix UI Checkbox in jsdom
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

vi.mock("../_actions/createDrinkAction", () => ({
  createDrinkAction: vi.fn(),
}));

vi.mock("../_actions/updateDrinkAction", () => ({
  updateDrinkAction: vi.fn(),
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: mockPush })),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import DrinkForm from "./DrinkForm";
import { createDrinkAction } from "../_actions/createDrinkAction";
import { updateDrinkAction } from "../_actions/updateDrinkAction";
import { toast } from "sonner";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import type { AdminDrinkDtoType } from "@/shared/Types/types";

const mockCreateDrinkAction = createDrinkAction as Mock;
const mockUpdateDrinkAction = updateDrinkAction as Mock;
const mockToastSuccess = toast.success as Mock;
const mockToastError = toast.error as Mock;

const existingDrink: AdminDrinkDtoType = {
  id: "d1",
  drinkName: "cola",
  drinkPrice: 500,
  isAvailableOnMenu: true,
  image: null,
};

describe("DrinkForm component", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("create mode (no drinkObject)", () => {
    it("renders 'Új ital' title", () => {
      render(<DrinkForm />);

      expect(screen.getByText("Új ital")).toBeInTheDocument();
    });

    it("renders 'Ital létrehozása' submit button", () => {
      render(<DrinkForm />);

      expect(
        screen.getByRole("button", { name: "Ital létrehozása" }),
      ).toBeInTheDocument();
    });

    it("disables submit button during submission", async () => {
      const user = userEvent.setup();
      mockCreateDrinkAction.mockImplementation(() => new Promise(() => {}));

      render(<DrinkForm />);

      await user.type(screen.getByLabelText(/ital neve/i), "cola");
      await user.type(screen.getByLabelText(/ital ára/i), "500");
      await user.click(
        screen.getByRole("button", { name: "Ital létrehozása" }),
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /loading|létrehozása/i }),
        ).toBeDisabled();
      });
    });

    it("calls createDrinkAction and redirects on success", async () => {
      const user = userEvent.setup();
      mockCreateDrinkAction.mockResolvedValue({
        success: true,
        message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
      });

      render(<DrinkForm />);

      await user.type(screen.getByLabelText(/ital neve/i), "cola");
      await user.type(screen.getByLabelText(/ital ára/i), "500");
      await user.click(
        screen.getByRole("button", { name: "Ital létrehozása" }),
      );

      await waitFor(() => {
        expect(mockCreateDrinkAction).toHaveBeenCalled();
        expect(mockToastSuccess).toHaveBeenCalledWith(
          BACKEND_RESPONSE_MESSAGES.SUCCESS,
        );
        expect(mockPush).toHaveBeenCalledWith("/dashboard/drinks");
      });
    });

    it("shows error toast on create failure", async () => {
      const user = userEvent.setup();
      mockCreateDrinkAction.mockResolvedValue({
        success: false,
        message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
      });

      render(<DrinkForm />);

      await user.type(screen.getByLabelText(/ital neve/i), "cola");
      await user.type(screen.getByLabelText(/ital ára/i), "500");
      await user.click(
        screen.getByRole("button", { name: "Ital létrehozása" }),
      );

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
        );
        expect(mockPush).not.toHaveBeenCalled();
      });
    });
  });

  describe("edit mode (drinkObject provided)", () => {
    it("renders 'Ital szerkesztése' title", () => {
      render(<DrinkForm drinkObject={existingDrink} />);

      expect(screen.getByText("Ital szerkesztése")).toBeInTheDocument();
    });

    it("renders 'Ital frissítése' submit button", () => {
      render(<DrinkForm drinkObject={existingDrink} />);

      expect(
        screen.getByRole("button", { name: "Ital frissítése" }),
      ).toBeInTheDocument();
    });

    it("populates form fields with existing drink values", async () => {
      render(<DrinkForm drinkObject={existingDrink} />);

      await waitFor(() => {
        expect(screen.getByLabelText(/ital neve/i)).toHaveValue("cola");
        expect(screen.getByLabelText(/ital ára/i)).toHaveValue(500);
      });
    });

    it("calls updateDrinkAction and redirects on success", async () => {
      const user = userEvent.setup();
      mockUpdateDrinkAction.mockResolvedValue({
        success: true,
        message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
      });

      render(<DrinkForm drinkObject={existingDrink} />);

      await user.click(screen.getByRole("button", { name: "Ital frissítése" }));

      await waitFor(() => {
        expect(mockUpdateDrinkAction).toHaveBeenCalledWith(
          "d1",
          expect.any(Object),
        );
        expect(mockToastSuccess).toHaveBeenCalledWith(
          BACKEND_RESPONSE_MESSAGES.SUCCESS,
        );
        expect(mockPush).toHaveBeenCalledWith("/dashboard/drinks");
      });
    });

    it("shows error toast on update failure", async () => {
      const user = userEvent.setup();
      mockUpdateDrinkAction.mockResolvedValue({
        success: false,
        message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
      });

      render(<DrinkForm drinkObject={existingDrink} />);

      await user.click(screen.getByRole("button", { name: "Ital frissítése" }));

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
        );
        expect(mockPush).not.toHaveBeenCalled();
      });
    });
  });
});
