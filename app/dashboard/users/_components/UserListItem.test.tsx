import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

const { mockPush, mockRefresh, mockLogout } = vi.hoisted(() => {
  const mockPush = vi.fn();
  const mockRefresh = vi.fn();
  const mockLogout = vi.fn();
  return { mockPush, mockRefresh, mockLogout };
});

vi.mock("../_actions/deleteUserAction", () => ({
  deleteUserAction: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

vi.mock("@/lib/auth/useAuth", () => ({
  useAuth: () => ({ logout: mockLogout }),
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

import UserListItem from "./UserListItem";
import { deleteUserAction } from "../_actions/deleteUserAction";
import { toast } from "sonner";
import { BACKEND_RESPONSE_MESSAGES } from "@/shared/Constants/constants";

const mockDeleteUserAction = deleteUserAction as Mock;
const mockToastSuccess = toast.success as Mock;
const mockToastError = toast.error as Mock;

const baseUser = {
  id: "u1",
  email: "user@test.com",
  username: "teszt",
  role: "ADMIN" as const,
  isStillWorkingHere: true,
  orderAddress: null,
};

describe("UserListItem component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders username, email and role", () => {
    render(<UserListItem userArray={baseUser} />);

    expect(screen.getByText("teszt")).toBeInTheDocument();
    expect(screen.getByText("user@test.com")).toBeInTheDocument();
    expect(screen.getByText("ADMIN")).toBeInTheDocument();
  });

  it("renders 'Dolgozo' badge when user is active employee", () => {
    render(<UserListItem userArray={baseUser} />);

    expect(screen.getByText("Dolgozó")).toBeInTheDocument();
  });

  it("renders 'Vendeg' badge when user is not active employee", () => {
    render(
      <UserListItem
        userArray={{ ...baseUser, isStillWorkingHere: false, id: "u2" }}
      />,
    );

    expect(screen.getByText("Vendég")).toBeInTheDocument();
  });

  it("renders order address block when address exists", () => {
    render(
      <UserListItem
        userArray={{
          ...baseUser,
          orderAddress: {
            id: "a1",
            fullName: "Teszt Elek",
            phoneNumber: "+3611111111",
            postalCode: "1111",
            city: "Budapest",
            street: "Fout",
            houseNumber: "10",
            floorAndDoor: "1/2",
            isSaved: true,
          },
        }}
      />,
    );

    expect(screen.getByText("Teszt Elek")).toBeInTheDocument();
    expect(screen.getByText("Budapest")).toBeInTheDocument();
  });

  it("calls deleteUserAction with correct id", async () => {
    const user = userEvent.setup();
    mockDeleteUserAction.mockResolvedValue({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
      data: { isSelfDelete: false },
    });

    render(<UserListItem userArray={baseUser} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockDeleteUserAction).toHaveBeenCalledWith("u1");
    });
  });

  it("refreshes route when deleting another user", async () => {
    const user = userEvent.setup();
    mockDeleteUserAction.mockResolvedValue({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
      data: { isSelfDelete: false },
    });

    render(<UserListItem userArray={baseUser} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
      expect(mockLogout).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
      expect(mockToastSuccess).toHaveBeenCalledWith(
        BACKEND_RESPONSE_MESSAGES.SUCCESS,
      );
    });
  });

  it("logs out and navigates home when user deletes self", async () => {
    const user = userEvent.setup();
    mockDeleteUserAction.mockResolvedValue({
      success: true,
      message: BACKEND_RESPONSE_MESSAGES.SUCCESS,
      data: { isSelfDelete: true },
    });

    render(<UserListItem userArray={baseUser} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/");
      expect(mockRefresh).not.toHaveBeenCalled();
    });
  });

  it("shows error toast when action returns failure", async () => {
    const user = userEvent.setup();
    mockDeleteUserAction.mockResolvedValue({
      success: false,
      message: BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED,
    });

    render(<UserListItem userArray={baseUser} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        BACKEND_RESPONSE_MESSAGES.UNAUTHORIZED,
      );
    });
  });

  it("shows server error toast when action throws", async () => {
    const user = userEvent.setup();
    mockDeleteUserAction.mockRejectedValue(new Error("network error"));

    render(<UserListItem userArray={baseUser} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        BACKEND_RESPONSE_MESSAGES.SERVER_ERROR,
      );
    });
  });

  it("disables trigger button while action is loading", async () => {
    const user = userEvent.setup();
    mockDeleteUserAction.mockImplementation(() => new Promise(() => {}));

    render(<UserListItem userArray={baseUser} />);
    await user.click(screen.getByTestId("modal-trigger"));

    await waitFor(() => {
      expect(screen.getByTestId("modal-trigger")).toBeDisabled();
    });
  });
});
