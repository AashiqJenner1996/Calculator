import React, { useEffect, useRef, useState } from "react";
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
  const [eggClosing, setEggClosing] = useState(false);

  const [asciiFrameText, setAsciiFrameText] = useState(null);
  const asciiIntervalRef = useRef(null);

  const eggAutoCloseTimeoutRef = useRef(null);
  const eggCloseAnimTimeoutRef = useRef(null);

  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  function stopAscii() {
    if (asciiIntervalRef.current) {
      clearInterval(asciiIntervalRef.current);
      asciiIntervalRef.current = null;
    }
    setAsciiFrameText(null);
  }

  function clearEggTimers() {
    if (eggAutoCloseTimeoutRef.current) {
      clearTimeout(eggAutoCloseTimeoutRef.current);
      eggAutoCloseTimeoutRef.current = null;
    }
    if (eggCloseAnimTimeoutRef.current) {
      clearTimeout(eggCloseAnimTimeoutRef.current);
      eggCloseAnimTimeoutRef.current = null;
    }
  }

  function dismissEgg(immediate = true) {
    stopAscii();
    clearEggTimers();

    if (immediate) {
      setEggClosing(false);
      setEgg(null);
      return;
    }

    setEggClosing(true);
    eggCloseAnimTimeoutRef.current = setTimeout(() => {
      setEgg(null);
      setEggClosing(false);
    }, 180);
  }

  useEffect(() => {
    return () => {
      stopAscii();
      clearEggTimers();
    };
  }, []);

  useEffect(() => {
    stopAscii();

    if (!egg?.asciiFrames?.length) return;

    const frames = egg.asciiFrames;
    const ms = egg.asciiMs ?? 90;
    const totalMs = egg.asciiTotalMs ?? 1800;

    let i = 0;
    setAsciiFrameText(frames[0]);

    asciiIntervalRef.current = setInterval(() => {
      i += 1;
      setAsciiFrameText(frames[i % frames.length]);
    }, ms);

    const stopTimer = setTimeout(stopAscii, totalMs);

    return () => {
      clearTimeout(stopTimer);
      stopAscii();
    };
  }, [egg]);

  function handleDigitClick(digit) {
    if (egg) dismissEgg(true);

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

    setDisplay((prev) => (prev === "0" ? String(digit) : prev + String(digit)));
  }

  function handleDecimalClick() {
    if (egg) dismissEgg(true);

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
    dismissEgg(true);
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
      } catch {
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
    if (egg) dismissEgg(true);
    if (display === "Error") return;
    performCalculation(nextOperator);
  }

  function handleEqualsClick() {
    if (display === "Error") return;

    const foundEgg = EasterEgg(display);

    if (foundEgg) {
      clearEggTimers();
      setEggClosing(false);
      setEgg(foundEgg);
      setDisplay(foundEgg.message ?? "");

      eggAutoCloseTimeoutRef.current = setTimeout(() => {
        setEggClosing(true);
        eggCloseAnimTimeoutRef.current = setTimeout(() => {
          setEgg(null);
          setEggClosing(false);
          setDisplay(""); // intentional bug
        }, 180);
      }, 2500);

      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
      return;
    }

    if (!operator || firstOperand === null) return;

    const fn = operatorFunctions[operator];
    if (!fn) return;

    // INTENTIONAL BUG: pass display as STRING
    const result = fn(firstOperand, display);
    setDisplay(String(result));
    setFirstOperand(result);
    setOperator(null);
    setWaitingForSecondOperand(true);
  }

  function handleUnaryOpClick(type) {
    if (egg) dismissEgg(true);
    if (display === "Error") return;

    const value = Number(display);

    // INTENTIONAL BUGS: logic swapped
    // let result;
    // if (type === "square") result = squareRoot(value);
    // else if (type === "sqrt") result = power(value);
    // else return;

    setDisplay(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  }

  function handlePercentClick() {
    if (egg) dismissEgg(true);
    if (display === "Error") return;

    if (firstOperand !== null) {
      const result = percentage(firstOperand, Number(display));
      setDisplay(String(result));
      setWaitingForSecondOperand(true);
    } else {
      setDisplay(String(percentage(Number(display), 100)));
    }
  }

  return (
    <div style={{ width: 260, margin: "0 auto", padding: "1rem" }}>
      <div
        style={{
          height: 20,
          fontSize: 40,
          overflow: "hidden",
          border: "1px solid #ccc",
          marginBottom: 8,
        }}
      >
        {display}
      </div>

      {egg && (
        <div
          style={{
            opacity: eggClosing ? 0 : 1,
            transition: "opacity 180ms",
          }}
        >
          {egg.media && <img src={egg.media} style={{ width: "100%" }} />}
          {asciiFrameText && <pre>{asciiFrameText}</pre>}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
        <button onClick={handleClear}>C</button>

        {/* LABELS SWAPPED */}
        <button onClick={() => handleUnaryOpClick("square")}>√</button>
        <button onClick={() => handleUnaryOpClick("sqrt")}>x²</button>

        <button onClick={() => handleOperatorClick("÷")}>÷</button>

        {[7, 8, 9].map((n) => (
          <button key={n} onClick={() => handleDigitClick(n)}>{n}</button>
        ))}
        <button onClick={() => handleOperatorClick("×")}>×</button>

        {[4, 5, 6].map((n) => (
          <button key={n} onClick={() => handleDigitClick(n)}>{n}</button>
        ))}
        <button onClick={() => handleOperatorClick("-")}>-</button>

        {[1, 2, 3].map((n) => (
          <button key={n} onClick={() => handleDigitClick(n)}>{n}</button>
        ))}
        <button onClick={() => handleOperatorClick("+")}>+</button>

        <button style={{ gridColumn: "span 2" }} onClick={() => handleDigitClick(0)}>0</button>
        <button onClick={handleDecimalClick}>.</button>

        {/* NO data-testid ON PURPOSE */}
        <button onClick={handlePercentClick}>%</button>

        <button style={{ gridColumn: "span 4" }} onClick={handleEqualsClick}>=</button>
      </div>
    </div>
  );
}
