/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { MessageBubble } from "@/features/ai/components/message-bubble";
import { TypingIndicator } from "@/features/ai/components/typing-indicator";
import { QuickActions } from "@/features/ai/components/quick-actions";
import type { AIMessage } from "@/features/ai/types";

const USER_MSG: AIMessage = {
  id: "msg-1",
  role: "user",
  content: "What is this transaction?",
  timestamp: 1700000000000,
};

const ASSISTANT_MSG: AIMessage = {
  id: "msg-2",
  role: "assistant",
  content: "This is a token transfer of 100 units.",
  timestamp: 1700000001000,
  quickAction: "explain",
};

describe("MessageBubble", () => {
  it("renders user message", () => {
    render(<MessageBubble message={USER_MSG} />);
    expect(screen.getByText("What is this transaction?")).toBeInTheDocument();
  });

  it("renders assistant message", () => {
    render(<MessageBubble message={ASSISTANT_MSG} />);
    expect(
      screen.getByText("This is a token transfer of 100 units."),
    ).toBeInTheDocument();
  });

  it("shows quick action label", () => {
    render(<MessageBubble message={ASSISTANT_MSG} />);
    expect(screen.getByText("[explain]")).toBeInTheDocument();
  });
});

describe("TypingIndicator", () => {
  it("renders typing animation container", () => {
    const { container } = render(<TypingIndicator />);
    const dots = container.querySelectorAll(".animate-bounce");
    expect(dots.length).toBe(3);
  });
});

describe("QuickActions", () => {
  it("renders all action buttons", () => {
    render(<QuickActions onAction={() => {}} disabled={false} />);
    expect(screen.getByText("Explain")).toBeInTheDocument();
    expect(screen.getByText("Summarize")).toBeInTheDocument();
    expect(screen.getByText("Find Risks")).toBeInTheDocument();
    expect(screen.getByText("Simplify")).toBeInTheDocument();
    expect(screen.getByText("Developer Mode")).toBeInTheDocument();
  });

  it("disables buttons when disabled", () => {
    render(<QuickActions onAction={() => {}} disabled={true} />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });
});
