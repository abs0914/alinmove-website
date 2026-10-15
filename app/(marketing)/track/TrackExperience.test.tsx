import { createRef } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PublicTrackingSuccess } from "@/lib/tracking/types";
import { TrackExperience } from "./TrackExperience";
import { TrackingResultPanel } from "./TrackingResultPanel";
import { getPublicTracking, TrackingApiError } from "./tracking-api";

vi.mock("./tracking-api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./tracking-api")>();
  return { ...actual, getPublicTracking: vi.fn() };
});

const mockedGetPublicTracking = vi.mocked(getPublicTracking);

function trackingResult(overrides: Partial<PublicTrackingSuccess> = {}): PublicTrackingSuccess {
  return {
    success: true,
    trackingNumber: "ALN-123456",
    shipmentType: "cargo",
    serviceType: "Branch to branch",
    currentStatus: {
      code: "IN_TRANSIT",
      label: "In transit",
      description: "The shipment is moving through the ALiN network.",
      timestamp: "2026-08-02T09:50:00.000Z",
      category: "moving",
      semanticColor: "info",
      terminal: false,
    },
    origin: { branchName: "ALiN Cebu", city: "Cebu City" },
    destination: { branchName: "ALiN Tacloban", city: "Tacloban City" },
    milestones: [
      {
        id: "cargo-received",
        code: "SHIPMENT_RECEIVED",
        label: "Shipment received",
        description: "The shipment was accepted by ALiN Cargo.",
        timestamp: "2026-08-01T09:00:00.000Z",
        state: "completed",
        source: "cargo",
      },
      {
        id: "cargo-transit",
        code: "IN_TRANSIT",
        label: "In transit",
        description: "The shipment is moving through the ALiN network.",
        timestamp: "2026-08-02T09:50:00.000Z",
        state: "current",
        source: "cargo",
      },
    ],
    lastMile: {
      active: false,
      status: null,
      riderAssigned: false,
      vehicleType: null,
      locationAvailable: false,
      locationFreshness: "unavailable",
      location: null,
      locationUpdatedAt: null,
      estimatedArrivalStart: null,
      estimatedArrivalEnd: null,
    },
    proofOfDelivery: null,
    lastUpdatedAt: "2026-08-02T09:50:01.000Z",
    dataFreshness: { label: "Last verified update", isLive: false },
    ...overrides,
  };
}

beforeEach(() => {
  mockedGetPublicTracking.mockReset();
  window.history.replaceState({}, "", "/track");
});

describe("TrackExperience", () => {
  it("shows a clearly inactive idle state without fake shipment data", () => {
    render(<TrackExperience />);
    expect(screen.getByRole("heading", { name: "Track every movement" })).toBeInTheDocument();
    expect(screen.queryByText("ALiN North Hub")).not.toBeInTheDocument();
    expect(screen.queryByText("35 min")).not.toBeInTheDocument();
    expect(screen.queryByText("Carlo M.")).not.toBeInTheDocument();
    expect(screen.queryByTitle(/rider location/i)).not.toBeInTheDocument();
  });

  it("submits with Enter and preserves a deep-link-safe query", async () => {
    const user = userEvent.setup();
    mockedGetPublicTracking.mockResolvedValue(trackingResult());
    render(<TrackExperience />);
    const input = screen.getByLabelText("Tracking number");
    await user.type(input, "  ALN-123456  {Enter}");
    await waitFor(() => expect(mockedGetPublicTracking).toHaveBeenCalledWith("ALN-123456", expect.any(AbortSignal)));
    expect(input).toHaveValue("  ALN-123456  ");
    expect(window.location.search).toBe("?tracking=ALN-123456");
    expect(await screen.findByRole("heading", { name: "In transit", level: 2 })).toHaveFocus();
  });

  it("submits with the primary button and prevents duplicate submission while loading", async () => {
    const user = userEvent.setup();
    mockedGetPublicTracking.mockImplementation(() => new Promise(() => undefined));
    render(<TrackExperience />);
    await user.type(screen.getByLabelText("Tracking number"), "ALN-123456");
    await user.click(screen.getByRole("button", { name: "Track package" }));
    const loadingButton = screen.getByRole("button", { name: "Finding your package…" });
    expect(loadingButton).toBeDisabled();
    fireEvent.click(loadingButton);
    expect(mockedGetPublicTracking).toHaveBeenCalledTimes(1);
  });

  it("keeps the input value and focuses an accessible not-found result", async () => {
    const user = userEvent.setup();
    mockedGetPublicTracking.mockRejectedValue(
      new TrackingApiError(
        "TRACKING_NOT_FOUND",
        "We could not find a shipment using that tracking number.",
      ),
    );
    render(<TrackExperience />);
    const input = screen.getByLabelText("Tracking number");
    await user.type(input, "ALN-999999");
    await user.click(screen.getByRole("button", { name: "Track package" }));
    const heading = await screen.findByRole("heading", { name: "We couldn't show this shipment" });
    expect(input).toHaveValue("ALN-999999");
    expect(screen.getByRole("alert")).toHaveTextContent("We could not find a shipment");
    expect(heading).toHaveFocus();
  });

  it("validates malformed input without making a request", async () => {
    const user = userEvent.setup();
    render(<TrackExperience />);
    await user.type(screen.getByLabelText("Tracking number"), "bad!");
    await user.click(screen.getByRole("button", { name: "Track package" }));
    expect(mockedGetPublicTracking).not.toHaveBeenCalled();
    expect(document.getElementById("tracking-error")).toHaveTextContent(/does not look complete/i);
    expect(screen.getByLabelText("Tracking number")).toHaveAttribute("aria-invalid", "true");
  });

  it("restores and submits a supported deep link", async () => {
    window.history.replaceState({}, "", "/track?tracking=ALN-123456");
    mockedGetPublicTracking.mockResolvedValue(trackingResult());
    render(<TrackExperience />);
    expect(await screen.findByRole("heading", { name: "In transit", level: 2 })).toBeInTheDocument();
    expect(screen.getByLabelText("Tracking number")).toHaveValue("ALN-123456");
  });
});

describe("TrackingResultPanel", () => {
  it("renders a customer-facing success timeline without raw status codes or a Cargo map", () => {
    render(
      <TrackingResultPanel
        state={{ kind: "success", data: trackingResult() }}
        headingRef={createRef()}
        onRetry={vi.fn()}
      />,
    );
    expect(screen.getByRole("heading", { name: "Shipment journey" })).toBeInTheDocument();
    expect(screen.getByText("Shipment received")).toBeInTheDocument();
    expect(screen.queryByText("IN_TRANSIT")).not.toBeInTheDocument();
    expect(screen.queryByTitle(/rider location/i)).not.toBeInTheDocument();
  });

  it("renders verified fresh active rider location behavior", async () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY", "restricted-test-key");
    const data = trackingResult({
      shipmentType: "combined",
      lastMile: {
        active: true,
        status: { code: "OUT_FOR_DELIVERY", label: "Out for delivery" },
        riderAssigned: true,
        vehicleType: "Motorcycle",
        locationAvailable: true,
        locationFreshness: "fresh",
        location: { latitude: 10.3157, longitude: 123.8854 },
        locationUpdatedAt: "2026-08-02T09:59:00.000Z",
        estimatedArrivalStart: null,
        estimatedArrivalEnd: null,
      },
      dataFreshness: { label: "Last verified update", isLive: true },
    });
    render(
      <TrackingResultPanel state={{ kind: "success", data }} headingRef={createRef()} onRetry={vi.fn()} />,
    );
    expect(await screen.findByTitle("Latest verified rider location")).toBeInTheDocument();
  });

  it("uses delayed-location text instead of a live map", () => {
    const data = trackingResult({
      lastMile: {
        active: true,
        status: { code: "OUT_FOR_DELIVERY", label: "Out for delivery" },
        riderAssigned: true,
        vehicleType: null,
        locationAvailable: false,
        locationFreshness: "delayed",
        location: null,
        locationUpdatedAt: "2026-08-02T09:20:00.000Z",
        estimatedArrivalStart: null,
        estimatedArrivalEnd: null,
      },
    });
    render(
      <TrackingResultPanel state={{ kind: "success", data }} headingRef={createRef()} onRetry={vi.fn()} />,
    );
    expect(screen.getByText(/Rider location update is delayed/i)).toBeInTheDocument();
    expect(screen.queryByTitle("Latest verified rider location")).not.toBeInTheDocument();
  });

  it("shows POD only when the backend supplies it", () => {
    const delivered = trackingResult({
      currentStatus: {
        code: "DELIVERED",
        label: "Delivered",
        description: "The shipment has been delivered.",
        timestamp: "2026-08-02T09:55:00.000Z",
        category: "delivered",
        semanticColor: "success",
        terminal: true,
      },
      proofOfDelivery: {
        deliveredAt: "2026-08-02T09:55:00.000Z",
        receivedBy: "M•••• R••••",
        mediaUrl: "https://storage.example/pod?signed=true",
        mediaExpiresAt: "2026-08-02T11:00:00.000Z",
      },
    });
    const { rerender } = render(
      <TrackingResultPanel state={{ kind: "success", data: trackingResult() }} headingRef={createRef()} onRetry={vi.fn()} />,
    );
    expect(screen.queryByRole("link", { name: /View proof of delivery/i })).not.toBeInTheDocument();
    rerender(
      <TrackingResultPanel state={{ kind: "success", data: delivered }} headingRef={createRef()} onRetry={vi.fn()} />,
    );
    expect(screen.getByRole("link", { name: /View proof of delivery/i })).toHaveAttribute(
      "href",
      "https://storage.example/pod?signed=true",
    );
  });
});
