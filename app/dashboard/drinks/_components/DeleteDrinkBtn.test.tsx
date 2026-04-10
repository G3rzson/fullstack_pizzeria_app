import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

vi.mock("../_actions/deleteDrinkAction", () => ({
  deleteDrinkAction: vi.fn(),
}));

vi.mock("@/shared/Components/ActionModal", () => ({
  default: ({
    triggerTitle,
    description,
    action,
    disabled,
  }: {
    triggerTitle: string;
    description: string;
    action: () => void | Promise<void>;
    disabled?: boolean;
  }) => (
    <div>
      <button onClick={action} disabled={disabled} data-testid="modal-trigger">
        {triggerTitle}
      </button>
      <p data-testid="modal-description">{description}</p>
    </div>
  ),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import DeleteDrinkBtn from "./DeleteDrinkBtn";
import { deleteDrinkAction } from "../_actions/deleteDrinkAction";
import { toast } from "sonner";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

const mockDeleteDrinkAction = deleteDrinkAction as Mock;
const mockToastSuccess = toast.success as Mock;
const mockToastError = toast.error as Mock;

describe("DeleteDrinkBtn component", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders 'Ital törlése' trigger button", () => {
    render(<DeleteDrinkBtn id="d1" publicId={null} />);

    expect(screen.getByTestId("modal-trigger")).toHaveTextContent(
      "Ital törlése",
    );
  });

  it("renders confirmation description text", () => {
    render(<DeleteDrinkBtn id="d1" publicId={null} />);

    expect(screen.getByTestId("modal-description")).toHaveTextContent(
      "Biztos törölni szeretnéd az italt",
    );
  });

  it("calls deleteDrinkAction with id and null publicId on confirm", async () => {
    const user = userEvent.setup();
    mockDeleteDrinkAction.mockResolvedValue({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
    });

    render(<DeleteDrinkBtn id="d1" publicId={null} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockDeleteDrinkAction).toHaveBeenCalledWith("d1", null);
    });
  });

  it("calls deleteDrinkAction with publicId when provided", async () => {
    const user = userEvent.setup();
    mockDeleteDrinkAction.mockResolvedValue({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
    });

    render(<DeleteDrinkBtn id="d1" publicId="cloud-id" />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockDeleteDrinkAction).toHaveBeenCalledWith("d1", "cloud-id");
    });
  });

  it("shows success toast when action succeeds", async () => {
    const user = userEvent.setup();
    mockDeleteDrinkAction.mockResolvedValue({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
    });

    render(<DeleteDrinkBtn id="d1" publicId={null} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith(
        BACKEND_RESPONSE_MESSAGES.SUCCESS,
      );
    });
  });

  it("shows error toast when action returns failure", async () => {
    const user = userEvent.setup();
    mockDeleteDrinkAction.mockResolvedValue({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    });

    render(<DeleteDrinkBtn id="d1" publicId={null} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
      );
    });
  });

  it("shows server error toast when action throws", async () => {
    const user = userEvent.setup();
    mockDeleteDrinkAction.mockRejectedValue(new Error("network error"));

    render(<DeleteDrinkBtn id="d1" publicId={null} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
      );
    });
  });

  it("disables trigger button while action is loading", async () => {
    const user = userEvent.setup();
    mockDeleteDrinkAction.mockImplementation(() => new Promise(() => {}));

    render(<DeleteDrinkBtn id="d1" publicId={null} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(screen.getByTestId("modal-trigger")).toBeDisabled();
    });
  });
});
