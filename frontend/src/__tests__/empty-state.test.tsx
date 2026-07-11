/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/common/empty-state";

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState title="No data found" />);
    expect(screen.getByText("No data found")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <EmptyState title="No data" description="There is nothing to show" />,
    );
    expect(screen.getByText("There is nothing to show")).toBeInTheDocument();
  });

  it("renders action button when provided", () => {
    const onClick = jest.fn();
    render(
      <EmptyState
        title="Empty"
        action={{ label: "Refresh", onClick }}
      />,
    );
    const button = screen.getByText("Refresh");
    expect(button).toBeInTheDocument();
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
