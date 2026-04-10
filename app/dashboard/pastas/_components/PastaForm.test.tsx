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

vi.mock("../_actions/createPastaAction", () => ({
  createPastaAction: vi.fn(),
}));

vi.mock("../_actions/updatePastaAction", () => ({
  updatePastaAction: vi.fn(),
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: mockPush })),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import PastaForm from "./PastaForm";
import { createPastaAction } from "../_actions/createPastaAction";
import { updatePastaAction } from "../_actions/updatePastaAction";
import { toast } from "sonner";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";
import type { AdminPastaDtoType } from "@/shared/Types/types";

const mockCreatePastaAction = createPastaAction as Mock;
const mockUpdatePastaAction = updatePastaAction as Mock;
const mockToastSuccess = toast.success as Mock;
const mockToastError = toast.error as Mock;

const existingPasta: AdminPastaDtoType = {
  id: "t1",
  pastaName: "carbonara",
  pastaPrice: 2800,
  pastaDescription: "classic creamy",
  isAvailableOnMenu: true,
  image: null,
};

describe("PastaForm component", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("create mode (no pastaObject)", () => {
    it("renders 'Új tészta' title", () => {
      render(<PastaForm />);

      expect(screen.getByText("Új tészta")).toBeInTheDocument();
    });

    it("renders 'Tészta létrehozása' submit button", () => {
      render(<PastaForm />);

      expect(
        screen.getByRole("button", { name: "Tészta létrehozása" }),
      ).toBeInTheDocument();
    });

    it("calls createPastaAction and redirects on success", async () => {
      const user = userEvent.setup();
      mockCreatePastaAction.mockResolvedValue({
        success: true,
        message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
      });

      render(<PastaForm />);

      await user.type(screen.getByLabelText(/tészta neve/i), "carbonara");
      await user.type(screen.getByLabelText(/tészta ára/i), "2800");
      await user.type(
        screen.getByLabelText(/tészta leírása/i),
        "classic creamy",
      );
      await user.click(
        screen.getByRole("button", { name: "Tészta létrehozása" }),
      );

      await waitFor(() => {
        expect(mockCreatePastaAction).toHaveBeenCalled();
        expect(mockToastSuccess).toHaveBeenCalledWith(
          BACKEND_RESPONSE_MESSAGES.SUCCESS,
        );
        expect(mockPush).toHaveBeenCalledWith("/dashboard/pastas");
      });
    });

    it("shows error toast on create failure", async () => {
      const user = userEvent.setup();
      mockCreatePastaAction.mockResolvedValue({
        success: false,
        message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
      });

      render(<PastaForm />);

      await user.type(screen.getByLabelText(/tészta neve/i), "carbonara");
      await user.type(screen.getByLabelText(/tészta ára/i), "2800");
      await user.type(
        screen.getByLabelText(/tészta leírása/i),
        "classic creamy",
      );
      await user.click(
        screen.getByRole("button", { name: "Tészta létrehozása" }),
      );

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
        );
        expect(mockPush).not.toHaveBeenCalled();
      });
    });
  });

  describe("edit mode (pastaObject provided)", () => {
    it("renders 'Tészta szerkesztése' title", () => {
      render(<PastaForm pastaObject={existingPasta} />);

      expect(screen.getByText("Tészta szerkesztése")).toBeInTheDocument();
    });

    it("renders 'Tészta frissítése' submit button", () => {
      render(<PastaForm pastaObject={existingPasta} />);

      expect(
        screen.getByRole("button", { name: "Tészta frissítése" }),
      ).toBeInTheDocument();
    });

    it("populates form fields with existing pasta values", async () => {
      render(<PastaForm pastaObject={existingPasta} />);

      await waitFor(() => {
        expect(screen.getByLabelText(/tészta neve/i)).toHaveValue("carbonara");
        expect(screen.getByLabelText(/tészta ára/i)).toHaveValue(2800);
        expect(screen.getByLabelText(/tészta leírása/i)).toHaveValue(
          "classic creamy",
        );
      });
    });

    it("calls updatePastaAction and redirects on success", async () => {
      const user = userEvent.setup();
      mockUpdatePastaAction.mockResolvedValue({
        success: true,
        message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
      });

      render(<PastaForm pastaObject={existingPasta} />);

      await user.click(
        screen.getByRole("button", { name: "Tészta frissítése" }),
      );

      await waitFor(() => {
        expect(mockUpdatePastaAction).toHaveBeenCalledWith(
          "t1",
          expect.any(Object),
        );
        expect(mockToastSuccess).toHaveBeenCalledWith(
          BACKEND_RESPONSE_MESSAGES.SUCCESS,
        );
        expect(mockPush).toHaveBeenCalledWith("/dashboard/pastas");
      });
    });

    it("shows error toast on update failure", async () => {
      const user = userEvent.setup();
      mockUpdatePastaAction.mockResolvedValue({
        success: false,
        message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
      });

      render(<PastaForm pastaObject={existingPasta} />);

      await user.click(
        screen.getByRole("button", { name: "Tészta frissítése" }),
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
