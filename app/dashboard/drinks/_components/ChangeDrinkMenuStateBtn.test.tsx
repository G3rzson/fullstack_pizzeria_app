import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

vi.mock("../_actions/changeDrinkMenuAction", () => ({
  changeDrinkMenuAction: vi.fn(),
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

import ChangeDrinkMenuStateBtn from "./ChangeDrinkMenuStateBtn";
import { changeDrinkMenuAction } from "../_actions/changeDrinkMenuAction";
import { toast } from "sonner";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

const mockChangeDrinkMenuAction = changeDrinkMenuAction as Mock;
const mockToastSuccess = toast.success as Mock;
const mockToastError = toast.error as Mock;

describe("ChangeDrinkMenuStateBtn component", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders 'Levétel a menüről' when isAvailableOnMenu is true", () => {
    render(<ChangeDrinkMenuStateBtn id="d1" isAvailableOnMenu={true} />);

    expect(screen.getByTestId("modal-trigger")).toHaveTextContent(
      "Levétel a menüről",
    );
  });

  it("renders 'Hozzáadás a menühöz' when isAvailableOnMenu is false", () => {
    render(<ChangeDrinkMenuStateBtn id="d1" isAvailableOnMenu={false} />);

    expect(screen.getByTestId("modal-trigger")).toHaveTextContent(
      "Hozzáadás a menühöz",
    );
  });

  it("shows success toast when action succeeds", async () => {
    const user = userEvent.setup();
    mockChangeDrinkMenuAction.mockResolvedValue({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
    });

    render(<ChangeDrinkMenuStateBtn id="d1" isAvailableOnMenu={true} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockChangeDrinkMenuAction).toHaveBeenCalledWith("d1", true);
      expect(mockToastSuccess).toHaveBeenCalledWith(
        BACKEND_RESPONSE_MESSAGES.SUCCESS,
      );
    });
  });

  it("shows error toast when action returns failure", async () => {
    const user = userEvent.setup();
    mockChangeDrinkMenuAction.mockResolvedValue({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    });

    render(<ChangeDrinkMenuStateBtn id="d1" isAvailableOnMenu={true} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
      );
    });
  });

  it("shows server error toast when action throws", async () => {
    const user = userEvent.setup();
    mockChangeDrinkMenuAction.mockRejectedValue(new Error("network error"));

    render(<ChangeDrinkMenuStateBtn id="d1" isAvailableOnMenu={true} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
      );
    });
  });

  it("disables trigger button while action is loading", async () => {
    const user = userEvent.setup();
    mockChangeDrinkMenuAction.mockImplementation(() => new Promise(() => {}));

    render(<ChangeDrinkMenuStateBtn id="d1" isAvailableOnMenu={true} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(screen.getByTestId("modal-trigger")).toBeDisabled();
    });
  });
});
