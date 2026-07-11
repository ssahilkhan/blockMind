/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { ApiError, apiClient } from "@/lib/api-client";

describe("ApiError", () => {
  it("creates error with status and statusText", () => {
    const error = new ApiError(404, "Not Found");
    expect(error.status).toBe(404);
    expect(error.statusText).toBe("Not Found");
    expect(error.name).toBe("ApiError");
    expect(error.message).toBe("API Error: 404 Not Found");
  });

  it("creates error with custom message", () => {
    const error = new ApiError(500, "Internal Server Error", "Custom message");
    expect(error.message).toBe("Custom message");
  });
});

describe("apiClient", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("calls fetch with correct URL", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: "healthy" }),
    });
    global.fetch = mockFetch;

    const result = await apiClient<{ status: string }>("/health");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/health",
      expect.objectContaining({ headers: { "Content-Type": "application/json" } }),
    );
    expect(result).toEqual({ status: "healthy" });
  });

  it("throws ApiError on non-ok response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: () => Promise.resolve("not found"),
    });

    await expect(apiClient("/missing")).rejects.toThrow(ApiError);
  });
});
