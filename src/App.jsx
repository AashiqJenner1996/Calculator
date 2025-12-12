// src/App.jsx
import React from "react";
import Calculator from "./Calculator";

export default function App() {
  return (
    <div>
      <h1 style={{ 
        textAlign: "center", 
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 35,
        marginTop: 0,
        marginBottom: 4,
        
      }}
        >Calculator</h1>
      <Calculator />
    </div>
  );
}
