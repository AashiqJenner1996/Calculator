// calculator.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import Calculator from "./Calculator";

describe("Calculator component", () => {
  test("starts with display 0", () => {
    render(<Calculator />);
    expect(screen.getByTestId("display")).toHaveTextContent("0");
  });

  test("adds two numbers", () => {
    render(<Calculator />);

    fireEvent.click(screen.getByTestId("btn-7"));
    fireEvent.click(screen.getByTestId("btn-plus"));
    fireEvent.click(screen.getByTestId("btn-8"));
    fireEvent.click(screen.getByTestId("btn-equals"));

    expect(screen.getByTestId("display")).toHaveTextContent("15");
  });

  test("clear resets display", () => {
    render(<Calculator />);

    fireEvent.click(screen.getByTestId("btn-9"));
    fireEvent.click(screen.getByTestId("btn-clear"));

    expect(screen.getByTestId("display")).toHaveTextContent("0");
  });
});
