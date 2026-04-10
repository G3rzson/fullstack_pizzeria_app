import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

const componentMocks = vi.hoisted(() => ({
  ServerError: vi.fn(
    ({
      errorMsg,
      path,
      title,
    }: {
      errorMsg: string;
      path: string;
      title: string;
    }) => (
      <div data-testid="server-error">
        {errorMsg}|{path}|{title}
      </div>
    ),
  ),
  EmptyList: vi.fn(({ text }: { text: string }) => (
    <div data-testid="empty-list">{text}</div>
  )),
  UserListItem: vi.fn(({ userArray }: { userArray: { id: string } }) => (
    <li data-testid="user-list-item">item:{userArray.id}</li>
  )),
}));

vi.mock("../_actions/getAllUserAction", () => ({
  getAllUserAction: vi.fn(),
}));

vi.mock("@/shared/Components/ServerError", () => ({
  default: componentMocks.ServerError,
}));

vi.mock("@/shared/Components/EmptyList", () => ({
  default: componentMocks.EmptyList,
}));

vi.mock("./UserListItem", () => ({
  default: componentMocks.UserListItem,
}));

import UserList from "./UserList";
import { getAllUserAction } from "../_actions/getAllUserAction";

const mockGetAllUserAction = getAllUserAction as unknown as Mock;

const mockUser = {
  id: "u1",
  email: "test@test.com",
  username: "tester",
  role: "USER",
  isStillWorkingHere: true,
  orderAddress: null,
};

describe("UserList component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders server error when action fails", async () => {
    mockGetAllUserAction.mockResolvedValue({
      success: false,
      message: "server error",
    });

    render(await UserList());

    expect(screen.getByTestId("server-error")).toHaveTextContent(
      "server error|/dashboard|Vissza a dashboardra",
    );
    expect(componentMocks.ServerError).toHaveBeenCalledWith(
      expect.objectContaining({
        errorMsg: "server error",
        path: "/dashboard",
        title: "Vissza a dashboardra",
      }),
      undefined,
    );
  });

  it("renders empty list when there are no users", async () => {
    mockGetAllUserAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: [],
    });

    render(await UserList());

    expect(screen.getByTestId("empty-list")).toHaveTextContent(
      "Jelenleg nincs elérhető felhasználó!",
    );
    expect(screen.queryByTestId("user-list-item")).not.toBeInTheDocument();
  });

  it("renders UserListItem for each user", async () => {
    mockGetAllUserAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: [mockUser, { ...mockUser, id: "u2" }],
    });

    render(await UserList());

    const items = screen.getAllByTestId("user-list-item");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("item:u1");
    expect(items[1]).toHaveTextContent("item:u2");
  });

  it("passes correct user prop to UserListItem", async () => {
    mockGetAllUserAction.mockResolvedValue({
      success: true,
      message: "ok",
      data: [mockUser],
    });

    render(await UserList());

    expect(componentMocks.UserListItem).toHaveBeenCalledWith(
      expect.objectContaining({ userArray: mockUser }),
      undefined,
    );
  });
});
