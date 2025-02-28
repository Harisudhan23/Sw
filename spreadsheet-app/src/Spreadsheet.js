import React, { useState, useEffect } from "react";
import "./App.css";

const ROWS = 10;
const COLS = 10;

const Spreadsheet = () => {
  const [cells, setCells] = useState({});

  useEffect(() => {
    const savedData = localStorage.getItem("spreadsheetData");
    if (savedData) {
      setCells(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("spreadsheetData", JSON.stringify(cells));
  }, [cells]);

  const handleChange = (row, col, value) => {
    setCells((prev) => ({
      ...prev,
      [`${row},${col}`]: value,
    }));
  };

  const computeFormula = (formula) => {
    try {
      return eval(formula.replace(/([A-Z])(\d+)/g, (_, col, row) => {
        return cells[`${parseInt(row) - 1},${col.charCodeAt(0) - 65}`] || 0;
      }));
    } catch (error) {
      return "ERROR";
    }
  };

  return (
    <table className="spreadsheet">
      <tbody>
        {[...Array(ROWS)].map((_, row) => (
          <tr key={row}>
            {[...Array(COLS)].map((_, col) => {
              const key = `${row},${col}`;
              const value = cells[key] || "";
              const displayValue = value.startsWith("=")
                ? computeFormula(value.substring(1))
                : value;

              return (
                <td key={col}>
                  <input
                    value={value}
                    onChange={(e) => handleChange(row, col, e.target.value)}
                  />
                  <span className="computed-value">{displayValue}</span>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Spreadsheet;
