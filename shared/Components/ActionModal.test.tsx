import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ActionModal from "./ActionModal";

describe("ActionModal component", () => {
  it("opens the modal and calls the action on confirmation", async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockResolvedValue(undefined);

    render(
      <ActionModal
        triggerTitle="Törlés"
        description="Biztosan törölni szeretnéd?"
        action={action}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Törlés" }));

    expect(screen.getByText("Biztosan törölni szeretnéd?")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Igen" }));

    await waitFor(() => {
      expect(action).toHaveBeenCalledTimes(1);
    });
  });

  it("disables the trigger and action buttons when disabled is true", async () => {
    const user = userEvent.setup();

    render(
      <ActionModal
        triggerTitle="Törlés"
        description="Biztosan törölni szeretnéd?"
        action={vi.fn()}
        disabled
      />,
    );

    const trigger = screen.getByRole("button", { name: "Törlés" });
    expect(trigger).toBeDisabled();

    await user.click(trigger);

    expect(
      screen.queryByText("Biztosan törölni szeretnéd?"),
    ).not.toBeInTheDocument();
  });
});
