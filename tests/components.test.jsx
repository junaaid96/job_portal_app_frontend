import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SearchBar from "@/app/components/SearchBar";
import { parseTechStack } from "@/app/lib/techStack";

describe("SearchBar", () => {
  it("calls onSearch with what the user types", () => {
    const onSearch = vi.fn(); // a spy function
    render(<SearchBar onSearch={onSearch} />);
    fireEvent.change(screen.getByLabelText("Search jobs"), { target: { value: "react" } });
    expect(onSearch).toHaveBeenCalledWith("react");
  });
});

describe("parseTechStack", () => {
  it("trims and drops empty entries", () => {
    expect(parseTechStack(" React, Java , ,Go")).toEqual(["React", "Java", "Go"]);
  });
});
