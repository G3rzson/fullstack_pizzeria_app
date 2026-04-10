import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

vi.mock("../_actions/deletePizzaAction", () => ({
  deletePizzaAction: vi.fn(),
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

import DeletePizzaBtn from "./DeletePizzaBtn";
import { deletePizzaAction } from "../_actions/deletePizzaAction";
import { toast } from "sonner";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

const mockDeletePizzaAction = deletePizzaAction as Mock;
const mockToastSuccess = toast.success as Mock;
const mockToastError = toast.error as Mock;

describe("DeletePizzaBtn component", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders 'Pizza törlése' trigger button", () => {
    render(<DeletePizzaBtn id="p1" publicId={null} />);

    expect(screen.getByTestId("modal-trigger")).toHaveTextContent(
      "Pizza törlése",
    );
  });

  it("renders confirmation description text", () => {
    render(<DeletePizzaBtn id="p1" publicId={null} />);

    expect(screen.getByTestId("modal-description")).toHaveTextContent(
      "Biztos törölni szeretnéd a pizzát",
    );
  });

  it("calls deletePizzaAction with id and null publicId on confirm", async () => {
    const user = userEvent.setup();
    mockDeletePizzaAction.mockResolvedValue({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
    });

    render(<DeletePizzaBtn id="p1" publicId={null} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockDeletePizzaAction).toHaveBeenCalledWith("p1", null);
    });
  });

  it("calls deletePizzaAction with publicId when provided", async () => {
    const user = userEvent.setup();
    mockDeletePizzaAction.mockResolvedValue({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
    });

    render(<DeletePizzaBtn id="p1" publicId="cloud-id" />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockDeletePizzaAction).toHaveBeenCalledWith("p1", "cloud-id");
    });
  });

  it("shows success toast when action succeeds", async () => {
    const user = userEvent.setup();
    mockDeletePizzaAction.mockResolvedValue({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
    });

    render(<DeletePizzaBtn id="p1" publicId={null} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith(
        BACKEND_RESPONSE_MESSAGES.SUCCESS,
      );
    });
  });

  it("shows error toast when action returns failure", async () => {
    const user = userEvent.setup();
    mockDeletePizzaAction.mockResolvedValue({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
    });

    render(<DeletePizzaBtn id="p1" publicId={null} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
      );
    });
  });

  it("shows server error toast when action throws", async () => {
    const user = userEvent.setup();
    mockDeletePizzaAction.mockRejectedValue(new Error("network error"));

    render(<DeletePizzaBtn id="p1" publicId={null} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
      );
    });
  });

  it("disables trigger button while action is loading", async () => {
    const user = userEvent.setup();
    mockDeletePizzaAction.mockImplementation(() => new Promise(() => {}));

    render(<DeletePizzaBtn id="p1" publicId={null} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(screen.getByTestId("modal-trigger")).toBeDisabled();
    });
  });
});
