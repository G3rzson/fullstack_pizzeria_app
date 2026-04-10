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

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

vi.mock("../_actions/createPizzaAction", () => ({
  createPizzaAction: vi.fn(),
}));

vi.mock("../_actions/updatePizzaAction", () => ({
  updatePizzaAction: vi.fn(),
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: mockPush })),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import PizzaForm from "./PizzaForm";
import { createPizzaAction } from "../_actions/createPizzaAction";
import { updatePizzaAction } from "../_actions/updatePizzaAction";
import { toast } from "sonner";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import type { AdminPizzaDtoType } from "@/shared/Types/types";

const mockCreatePizzaAction = createPizzaAction as Mock;
const mockUpdatePizzaAction = updatePizzaAction as Mock;
const mockToastSuccess = toast.success as Mock;
const mockToastError = toast.error as Mock;

const existingPizza: AdminPizzaDtoType = {
  id: "p1",
  pizzaName: "margherita",
  pizzaPrice32: 2000,
  pizzaPrice45: 3000,
  pizzaDescription: "classic",
  isAvailableOnMenu: true,
  image: null,
};

describe("PizzaForm component", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("create mode (no pizzaObject)", () => {
    it("renders 'Új pizza' title", () => {
      render(<PizzaForm />);

      expect(screen.getByText("Új pizza")).toBeInTheDocument();
    });

    it("renders 'Pizza létrehozása' submit button", () => {
      render(<PizzaForm />);

      expect(
        screen.getByRole("button", { name: "Pizza létrehozása" }),
      ).toBeInTheDocument();
    });

    it("calls createPizzaAction and redirects on success", async () => {
      const user = userEvent.setup();
      mockCreatePizzaAction.mockResolvedValue({
        success: true,
        message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
      });

      render(<PizzaForm />);

      await user.type(screen.getByLabelText(/pizza neve/i), "margherita");
      await user.type(screen.getByLabelText(/32 cm-es pizza ára/i), "2000");
      await user.type(screen.getByLabelText(/45 cm-es pizza ára/i), "3000");
      await user.type(screen.getByLabelText(/pizza leírása/i), "classic");
      await user.click(
        screen.getByRole("button", { name: "Pizza létrehozása" }),
      );

      await waitFor(() => {
        expect(mockCreatePizzaAction).toHaveBeenCalled();
        expect(mockToastSuccess).toHaveBeenCalledWith(
          BACKEND_RESPONSE_MESSAGES.SUCCESS,
        );
        expect(mockPush).toHaveBeenCalledWith("/dashboard/pizzas");
      });
    });

    it("shows error toast on create failure", async () => {
      const user = userEvent.setup();
      mockCreatePizzaAction.mockResolvedValue({
        success: false,
        message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
      });

      render(<PizzaForm />);

      await user.type(screen.getByLabelText(/pizza neve/i), "margherita");
      await user.type(screen.getByLabelText(/32 cm-es pizza ára/i), "2000");
      await user.type(screen.getByLabelText(/45 cm-es pizza ára/i), "3000");
      await user.type(screen.getByLabelText(/pizza leírása/i), "classic");
      await user.click(
        screen.getByRole("button", { name: "Pizza létrehozása" }),
      );

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
        );
        expect(mockPush).not.toHaveBeenCalled();
      });
    });
  });

  describe("edit mode (pizzaObject provided)", () => {
    it("renders 'Pizza szerkesztése' title", () => {
      render(<PizzaForm pizzaObject={existingPizza} />);

      expect(screen.getByText("Pizza szerkesztése")).toBeInTheDocument();
    });

    it("renders 'Pizza frissítése' submit button", () => {
      render(<PizzaForm pizzaObject={existingPizza} />);

      expect(
        screen.getByRole("button", { name: "Pizza frissítése" }),
      ).toBeInTheDocument();
    });

    it("populates form fields with existing pizza values", async () => {
      render(<PizzaForm pizzaObject={existingPizza} />);

      await waitFor(() => {
        expect(screen.getByLabelText(/pizza neve/i)).toHaveValue("margherita");
        expect(screen.getByLabelText(/32 cm-es pizza ára/i)).toHaveValue(2000);
        expect(screen.getByLabelText(/45 cm-es pizza ára/i)).toHaveValue(3000);
        expect(screen.getByLabelText(/pizza leírása/i)).toHaveValue("classic");
      });
    });

    it("calls updatePizzaAction and redirects on success", async () => {
      const user = userEvent.setup();
      mockUpdatePizzaAction.mockResolvedValue({
        success: true,
        message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
      });

      render(<PizzaForm pizzaObject={existingPizza} />);

      await user.click(
        screen.getByRole("button", { name: "Pizza frissítése" }),
      );

      await waitFor(() => {
        expect(mockUpdatePizzaAction).toHaveBeenCalledWith(
          "p1",
          expect.any(Object),
        );
        expect(mockToastSuccess).toHaveBeenCalledWith(
          BACKEND_RESPONSE_MESSAGES.SUCCESS,
        );
        expect(mockPush).toHaveBeenCalledWith("/dashboard/pizzas");
      });
    });

    it("shows error toast on update failure", async () => {
      const user = userEvent.setup();
      mockUpdatePizzaAction.mockResolvedValue({
        success: false,
        message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
      });

      render(<PizzaForm pizzaObject={existingPizza} />);

      await user.click(
        screen.getByRole("button", { name: "Pizza frissítése" }),
      );

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
        );
        expect(mockPush).not.toHaveBeenCalled();
      });
    });
  });
});
