import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BRANCHES } from "@/lib/branches";
import { BranchLocator } from "./BranchLocator";

const TEST_BRANCHES = ["pangasinan-warehouse", "cebu-warehouse", "davao-city"].map(
  (id) => BRANCHES.find((branch) => branch.id === id)!,
);

beforeEach(() => {
  window.history.replaceState({}, "", "/branches");
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe("BranchLocator", () => {
  it("searches branch fields and reports the live count", async () => {
    const user = userEvent.setup();
    render(<BranchLocator branches={TEST_BRANCHES} />);

    expect(screen.getByText("3", { selector: "span" })).toBeInTheDocument();
    await user.type(screen.getByRole("searchbox", { name: "Search branches" }), "cebu");

    expect(screen.getByText("Cebu Warehouse")).toBeInTheDocument();
    expect(screen.queryByText("Davao City")).not.toBeInTheDocument();
    expect(screen.getByText("1", { selector: "span" })).toBeInTheDocument();
    await waitFor(() => expect(window.location.search).toBe("?q=cebu"));
  });

  it("filters by island group and provides an empty-state reset", async () => {
    const user = userEvent.setup();
    render(<BranchLocator branches={TEST_BRANCHES} />);

    await user.click(screen.getByRole("button", { name: "Mindanao" }));
    expect(screen.getByText("Davao City")).toBeInTheDocument();
    expect(screen.queryByText("Cebu Warehouse")).not.toBeInTheDocument();

    await user.type(screen.getByRole("searchbox", { name: "Search branches" }), "missing");
    expect(screen.getByRole("heading", { name: "No branches found" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByText("Cebu Warehouse")).toBeInTheDocument();
  });

  it("expands contact details and exposes telephone, email, and directions actions", async () => {
    const user = userEvent.setup();
    render(<BranchLocator branches={TEST_BRANCHES} />);

    await user.click(screen.getByRole("button", { name: /Cebu Warehouse/ }));
    const card = screen.getByText("Cebu Warehouse").closest("article");
    expect(card).not.toBeNull();
    expect(within(card!).getByText(/FMC, Ouano Compound/)).toBeInTheDocument();
    expect(within(card!).getByRole("link", { name: "0917-650-6628" })).toHaveAttribute(
      "href",
      "tel:+639176506628",
    );
    expect(
      within(card!).getByRole("link", { name: "alincargoexpresscebu1@gmail.com" }),
    ).toHaveAttribute("href", "mailto:alincargoexpresscebu1@gmail.com");
    expect(within(card!).getByRole("link", { name: "Get Directions" })).toHaveAttribute(
      "href",
      expect.stringContaining("google.com/maps/dir"),
    );
  });

  it("honors query-driven initial filters", () => {
    render(
      <BranchLocator branches={TEST_BRANCHES} initialQuery="warehouse" initialRegion="Visayas" />,
    );
    expect(screen.getByText("Cebu Warehouse")).toBeInTheDocument();
    expect(screen.queryByText("Pangasinan Warehouse")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Visayas" })).toHaveAttribute("aria-pressed", "true");
  });
});
