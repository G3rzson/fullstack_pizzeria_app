import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

vi.mock("../_actions/changePastaMenuAction", () => ({
  changePastaMenuAction: vi.fn(),
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

import ChangePastaMenuStateBtn from "./ChangePastaMenuStateBtn";
import { changePastaMenuAction } from "../_actions/changePastaMenuAction";
import { toast } from "sonner";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

const mockChangePastaMenuAction = changePastaMenuAction as Mock;
const mockToastSuccess = toast.success as Mock;
const mockToastError = toast.error as Mock;

describe("ChangePastaMenuStateBtn component", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders 'Levétel a menüről' when isAvailableOnMenu is true", () => {
    render(<ChangePastaMenuStateBtn id="t1" isAvailableOnMenu={true} />);

    expect(screen.getByTestId("modal-trigger")).toHaveTextContent(
      "Levétel a menüről",
    );
  });

  it("renders 'Hozzáadás a menühöz' when isAvailableOnMenu is false", () => {
    render(<ChangePastaMenuStateBtn id="t1" isAvailableOnMenu={false} />);

    expect(screen.getByTestId("modal-trigger")).toHaveTextContent(
      "Hozzáadás a menühöz",
    );
  });

  it("shows success toast when action succeeds", async () => {
    const user = userEvent.setup();
    mockChangePastaMenuAction.mockResolvedValue({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
    });

    render(<ChangePastaMenuStateBtn id="t1" isAvailableOnMenu={true} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockChangePastaMenuAction).toHaveBeenCalledWith("t1", true);
      expect(mockToastSuccess).toHaveBeenCalledWith(
        BACKEND_RESPONSE_MESSAGES.SUCCESS,
      );
    });
  });

  it("shows error toast when action returns failure", async () => {
    const user = userEvent.setup();
    mockChangePastaMenuAction.mockResolvedValue({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    });

    render(<ChangePastaMenuStateBtn id="t1" isAvailableOnMenu={true} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
      );
    });
  });

  it("shows server error toast when action throws", async () => {
    const user = userEvent.setup();
    mockChangePastaMenuAction.mockRejectedValue(new Error("network error"));

    render(<ChangePastaMenuStateBtn id="t1" isAvailableOnMenu={true} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
      );
    });
  });

  it("disables trigger button while action is loading", async () => {
    const user = userEvent.setup();
    mockChangePastaMenuAction.mockImplementation(() => new Promise(() => {}));

    render(<ChangePastaMenuStateBtn id="t1" isAvailableOnMenu={true} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(screen.getByTestId("modal-trigger")).toBeDisabled();
    });
  });
});
