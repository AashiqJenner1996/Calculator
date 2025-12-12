import React, { useState } from "react";
import {
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  EasterEgg,
  percentage,
} from "./calculatorLogic";


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
      if (prev === "0") {
        return String(digit);
      }
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
      if (prev.includes(".")) {
        return prev;
      }
      return prev + ".";
    });
  }

  function handleClear() {
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
    // Only wait for a new number if we actually pressed another operator
    setWaitingForSecondOperand(nextOperator !== null);
  }

  function handleOperatorClick(nextOperator) {
    if (display === "Error") return;
    performCalculation(nextOperator);
  }

  function handleEqualsClick() {
    if (display === "Error") return;

    // 1. Easter egg first
    let egg;
    try {
      egg = EasterEgg(display);
    } catch (err) {
      // If EasterEgg logic throws, show Error and reset
      setDisplay("Error");
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
      return;
    }

    if (egg) {
      setDisplay(egg.message);
      setEgg(egg);
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
      return;
    }

    // 2. Normal equals behaviour
    if (!operator || firstOperand === null) {
      // Nothing to calculate, just leave display as is
      return;
    }

    const inputValue = display; 
    const fn = operatorFunctions[operator];

    if (!fn) return;

    try {
      const result = fn(firstOperand, inputValue);
      setDisplay(String(result));
      setFirstOperand(result);
      setOperator(null);
      setWaitingForSecondOperand(true); // next digit starts a new number
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
      if (type === "square") {
        result = power(value);
      } else if (type === "sqrt") {
        result = squareRoot(value);
      } else {
        return;
      }

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
      style={{
        width: 260,
        margin: "1rem auto",
        padding: "1rem",
        borderRadius: 8,
        border: "1px solid #ddd",
        fontFamily: "system-ui, sans-serif",
        flexWrap: 'wrap',
        wordWrap: 'break-word',
      }}
    >
      <div
        style={{
          height: 20,  // reduced display size for bug production
          marginBottom: "0.5rem",
          padding: "0.5rem",
          borderRadius: 4,
          border: "1px solid #ccc",
          textAlign: "left",
          fontSize: 30, // increased font size for bug production
          background: "#f9f9f9",
          overflow: "hidden",
          wordBreak: "break-all",
        }}
      >
        {display}
      </div>
         {egg && (
  <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
    <img src={egg.media} style={{ width: "100%" }} />
  </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.5rem",
        }}
      >
        <button onClick={handleClear}>C</button>
        <button onClick={() => handleUnaryOpClick("square")}>√</button> {/* swapped square and square root button image */}
        <button onClick={() => handleUnaryOpClick("sqrt")}>x²</button> {/* swapped square and square root button image */}
        <button onClick={() => handleOperatorClick("÷")}>÷</button>

        <button onClick={() => handleDigitClick(7)}>7</button>
        <button onClick={() => handleDigitClick(8)}>8</button>
        <button onClick={() => handleDigitClick(9)}>9</button>
        <button onClick={() => handleOperatorClick("×")}>×</button>

        <button onClick={() => handleDigitClick(4)}>4</button>
        <button onClick={() => handleDigitClick("5")}>5</button> {/* CHanged button to a string */}
        <button onClick={() => handleDigitClick(6)}>6</button> 
        <button onClick={() => handleOperatorClick("-")}>-</button>

        <button onClick={() => handleDigitClick(1)}>1</button>
        <button onClick={() => handleDigitClick(2)}>2</button>
        <button onClick={() => handleDigitClick(3)}>3</button>
        <button onClick={() => handleOperatorClick("+")}>+</button>

        <button
          onClick={() => handleDigitClick(0)}
          style={{ gridColumn: "span 2" }}
        >
          0
        </button>
        <button onClick={handleDecimalClick}>.</button>
        <button onClick={handlePercentClick}>%</button>

        <button
          onClick={handleEqualsClick}
          style={{ gridColumn: "span 4", marginTop: "0.5rem" }}
        >
          =
        </button>
      </div>
    </div>
  );
}
