/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SuggestionCard } from "@/features/copilot/components/suggestion-card";
import { FilterBar } from "@/features/copilot/components/filter-bar";
import { QuickActionButtons } from "@/features/copilot/components/quick-action-buttons";
import { ConversationList } from "@/features/copilot/components/conversation-list";
import type { CopilotSuggestion, CopilotConversation } from "@/features/copilot/types";

function makeSuggestion(overrides: Partial<CopilotSuggestion> = {}): CopilotSuggestion {
  return {
    id: "sug-1",
    workspace: "global",
    category: "security",
    severity: "critical",
    title: "Reentrancy detected",
    description: "Function foo() is vulnerable to reentrancy attacks",
    source: "contract-analyzer",
    timestamp: Date.now(),
    ...overrides,
  };
}

function makeConversation(overrides: Partial<CopilotConversation> = {}): CopilotConversation {
  return {
    id: "conv-1",
    sessionId: "session-1",
    title: "Test conversation",
    messages: [],
    isPinned: false,
    isBookmarked: false,
    tags: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  };
}

describe("SuggestionCard", () => {
  it("renders title and description", () => {
    const s = makeSuggestion();
    render(<SuggestionCard suggestion={s} />);
    expect(screen.getByText("Reentrancy detected")).toBeInTheDocument();
    expect(screen.getByText(/vulnerable to reentrancy/)).toBeInTheDocument();
  });

  it("renders uppercase severity badge", () => {
    const s = makeSuggestion({ severity: "warning" });
    render(<SuggestionCard suggestion={s} />);
    expect(screen.getByText("WARNING")).toBeInTheDocument();
  });

  it("renders category label (capitalized)", () => {
    const s = makeSuggestion({ category: "gas" });
    render(<SuggestionCard suggestion={s} />);
    expect(screen.getByText("Gas")).toBeInTheDocument();
  });
});

describe("FilterBar", () => {
  it("renders severity filter buttons (uppercase)", () => {
    render(
      <FilterBar
        filterSeverity={null}
        filterCategory={null}
        onSetFilterSeverity={jest.fn()}
        onSetFilterCategory={jest.fn()}
      />,
    );
    expect(screen.getByText("CRITICAL")).toBeInTheDocument();
    expect(screen.getByText("WARNING")).toBeInTheDocument();
    expect(screen.getByText("SUGGESTION")).toBeInTheDocument();
    expect(screen.getByText("INFO")).toBeInTheDocument();
  });

  it("calls onSetFilterSeverity when severity button clicked", () => {
    const onSet = jest.fn();
    render(
      <FilterBar
        filterSeverity={null}
        filterCategory={null}
        onSetFilterSeverity={onSet}
        onSetFilterCategory={jest.fn()}
      />,
    );
    fireEvent.click(screen.getByText("CRITICAL"));
    expect(onSet).toHaveBeenCalledWith("critical");
  });

  it("deselects when clicking same severity", () => {
    const onSet = jest.fn();
    render(
      <FilterBar
        filterSeverity="critical"
        filterCategory={null}
        onSetFilterSeverity={onSet}
        onSetFilterCategory={jest.fn()}
      />,
    );
    fireEvent.click(screen.getByText("CRITICAL"));
    expect(onSet).toHaveBeenCalledWith(null);
  });

  it("renders category filter buttons", () => {
    render(
      <FilterBar
        filterSeverity={null}
        filterCategory={null}
        onSetFilterSeverity={jest.fn()}
        onSetFilterCategory={jest.fn()}
      />,
    );
    expect(screen.getByText("Security")).toBeInTheDocument();
    expect(screen.getByText("Gas")).toBeInTheDocument();
  });

  it("calls onSetFilterCategory when category button clicked", () => {
    const onSet = jest.fn();
    render(
      <FilterBar
        filterSeverity={null}
        filterCategory={null}
        onSetFilterSeverity={jest.fn()}
        onSetFilterCategory={onSet}
      />,
    );
    fireEvent.click(screen.getByText("Security"));
    expect(onSet).toHaveBeenCalledWith("security");
  });
});

describe("QuickActionButtons", () => {
  it("renders all action buttons for global workspace", () => {
    render(
      <QuickActionButtons
        workspace="global"
        onAction={jest.fn()}
        isDisabled={false}
      />,
    );
    expect(screen.getByText("Explain Code")).toBeInTheDocument();
    expect(screen.getByText("Optimize Gas")).toBeInTheDocument();
    expect(screen.getByText("Review Security")).toBeInTheDocument();
    expect(screen.getByText("Summarize Changes")).toBeInTheDocument();
    expect(screen.getByText("Generate Docs")).toBeInTheDocument();
    expect(screen.getByText("Audit Notes")).toBeInTheDocument();
  });

  it("calls onAction with action type when button clicked", () => {
    const onAction = jest.fn();
    render(
      <QuickActionButtons
        workspace="global"
        onAction={onAction}
        isDisabled={false}
      />,
    );
    fireEvent.click(screen.getByText("Explain Code"));
    expect(onAction).toHaveBeenCalledWith("explain");
  });

  it("filters actions for contract workspace", () => {
    render(
      <QuickActionButtons
        workspace="contract"
        onAction={jest.fn()}
        isDisabled={false}
      />,
    );
    expect(screen.getByText("Explain Code")).toBeInTheDocument();
    expect(screen.getByText("Optimize Gas")).toBeInTheDocument();
    expect(screen.getByText("Audit Notes")).toBeInTheDocument();
    expect(screen.queryByText("Summarize Changes")).not.toBeInTheDocument();
  });
});

describe("ConversationList", () => {
  it("renders empty state when no conversations", () => {
    render(
      <ConversationList
        conversations={[]}
        activeId={null}
        onSelect={jest.fn()}
        onPin={jest.fn()}
        onBookmark={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(screen.getByText("No conversations yet.")).toBeInTheDocument();
  });

  it("renders conversations", () => {
    const conv = makeConversation({ tags: ["contract"] });
    render(
      <ConversationList
        conversations={[conv]}
        activeId={null}
        onSelect={jest.fn()}
        onPin={jest.fn()}
        onBookmark={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    expect(screen.getByText("Test conversation")).toBeInTheDocument();
  });

  it("calls onSelect when conversation clicked", () => {
    const onSelect = jest.fn();
    const conv = makeConversation();
    render(
      <ConversationList
        conversations={[conv]}
        activeId={null}
        onSelect={onSelect}
        onPin={jest.fn()}
        onBookmark={jest.fn()}
        onDelete={jest.fn()}
      />,
    );
    fireEvent.click(screen.getByText("Test conversation"));
    expect(onSelect).toHaveBeenCalledWith("conv-1");
  });
});
