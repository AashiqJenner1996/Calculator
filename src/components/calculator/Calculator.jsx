import React, { useState } from "react";
import {
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  percentage,
  EasterEgg,
} from "../../logic";

const operatorFunctions = {
  "+": add,
  "-": subtract,
  "×": multiply,
  "÷": divide,
};

export default function Calculator() {
  const [egg, setEgg] = useState(null);
  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [eggClosing, setEggClosing] = useState(false);

  function handleDigitClick(digit) {
    if (display === "Error") {
      setDisplay(String(digit));
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
      return;
    }

    if (waitingForSecondOperand) {
      setDisplay(String(digit));
      setWaitingForSecondOperand(false);
      return;
    }

    setDisplay((prev) => {
      if (prev === "0") return String(digit);
      return prev + String(digit);
    });
  }

  function handleDecimalClick() {
    if (display === "Error") {
      setDisplay("0.");
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
      return;
    }

    setDisplay((prev) => {
      if (waitingForSecondOperand) {
        setWaitingForSecondOperand(false);
        return "0.";
      }
      if (prev.includes(".")) return prev;
      return prev + ".";
    });
  }

  function handleClear() {
    setEggClosing(false);
    setEgg(null);
    setDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  }

  function performCalculation(nextOperator) {
    const inputValue = Number(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const fn = operatorFunctions[operator];
      if (!fn) return;

      try {
        const result = fn(firstOperand, inputValue);
        setDisplay(String(result));
        setFirstOperand(result);
      } catch (err) {
        setDisplay("Error");
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
        return;
      }
    }

    setOperator(nextOperator);
    setWaitingForSecondOperand(nextOperator !== null);
  }

  function handleOperatorClick(nextOperator) {
    if (display === "Error") return;
    performCalculation(nextOperator);
  }

  function handleEqualsClick() {
    if (display === "Error") return;

    let egg;
    try {
      egg = EasterEgg(display);
    } catch (err) {
      setDisplay("Error");
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
      return;
    }

    if (egg) {
      setDisplay(egg.message);
      setEgg(egg);
      setTimeout(() => {
        setEggClosing(true);
        setTimeout(() => {
          setEgg(null);
          setEggClosing(false);
          setDisplay(""); // known bug
        }, 180);
      }, 2500);
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
      return;
    }

    if (!operator || firstOperand === null) return;

    const inputValue = display;
    const fn = operatorFunctions[operator];
    if (!fn) return;

    try {
      const result = fn(firstOperand, inputValue);
      setDisplay(String(result));
      setFirstOperand(result);
      setOperator(null);
      setWaitingForSecondOperand(true);
    } catch (err) {
      setDisplay("Error");
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
    }
  }

  function handleUnaryOpClick(type) {
    if (display === "Error") return;

    const value = Number(display);

    try {
      let result;
      if (type === "square") result = power(value);
      else if (type === "sqrt") result = squareRoot(value);
      else return;

      setDisplay(String(result));
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
    } catch (err) {
      setDisplay("Error");
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
    }
  }

  function handlePercentClick() {
    if (display === "Error") return;

    if (firstOperand !== null) {
      const percentValue = Number(display);
      try {
        const result = percentage(firstOperand, percentValue);
        setDisplay(String(result));
        setWaitingForSecondOperand(true);
      } catch (err) {
        setDisplay("Error");
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
      }
    } else {
      try {
        const result = percentage(Number(display), 100);
        setDisplay(String(result));
      } catch (err) {
        setDisplay("Error");
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
      }
    }
  }

  return (
    <div
      data-testid="calculator"
      style={{
        width: 260,
        margin: "0 auto",
        padding: "1rem",
        borderRadius: 8,
        border: "1px solid #ddd",
        fontFamily: "Arial, Helvetica, sans-serif",
        flexWrap: "wrap",
        wordWrap: "break-word",
      }}
    >
      <div
        data-testid="display"
        style={{
          height: 20,
          marginBottom: "0.5rem",
          padding: "0.5rem",
          borderRadius: 4,
          border: "1px solid #ccc",
          textAlign: "left",
          fontSize: 40,
          background: "#f9f9f9",
          overflow: "hidden",
          wordBreak: "break-all",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        {display}
      </div>

      {egg && (
        <div data-testid="egg" style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          <img data-testid="egg-image" src={egg.media} style={{ width: "100%" }} />
        </div>
      )}

      <div
        data-testid="keypad"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.5rem",
        }}
      >
        <button data-testid="btn-clear" onClick={handleClear}>C</button>
        <button data-testid="btn-square" onClick={() => handleUnaryOpClick("square")}>√</button>
        <button data-testid="btn-sqrt" onClick={() => handleUnaryOpClick("sqrt")}>x²</button>
        <button data-testid="btn-divide" onClick={() => handleOperatorClick("÷")}>÷</button>

        <button data-testid="btn-7" onClick={() => handleDigitClick(7)}>7</button>
        <button data-testid="btn-8" onClick={() => handleDigitClick(8)}>8</button>
        <button data-testid="btn-9" onClick={() => handleDigitClick(9)}>9</button>
        <button data-testid="btn-multiply" onClick={() => handleOperatorClick("×")}>×</button>

        <button data-testid="btn-4" onClick={() => handleDigitClick(4)}>4</button>
        <button data-testid="btn-5" onClick={() => handleDigitClick(5)}>5</button>
        <button data-testid="btn-6" onClick={() => handleDigitClick(6)}>6</button>
        <button data-testid="btn-minus" onClick={() => handleOperatorClick("-")}>-</button>

        <button data-testid="btn-1" onClick={() => handleDigitClick(1)}>1</button>
        <button data-testid="btn-2" onClick={() => handleDigitClick(2)}>2</button>
        <button data-testid="btn-3" onClick={() => handleDigitClick(3)}>3</button>
        <button data-testid="btn-plus" onClick={() => handleOperatorClick("+")}>+</button>

        <button
          data-testid="btn-0"
          onClick={() => handleDigitClick(0)}
          style={{ gridColumn: "span 2" }}
        >
          0
        </button>

        <button data-testid="btn-decimal" onClick={handleDecimalClick}>.</button>
        <button data-testid="btn-percent" onClick={handlePercentClick}>%</button>

        <button
          data-testid="btn-equals"
          onClick={handleEqualsClick}
          style={{ gridColumn: "span 4", marginTop: "0.5rem" }}
        >
          =
        </button>
      </div>
    </div>
  );
}
