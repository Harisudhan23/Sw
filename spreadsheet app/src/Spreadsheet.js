import React, { useState } from "react";
import "./App.css";
import { Chart } from "react-google-charts";

const ROWS = 10;
const COLS = 5;

const Spreadsheet = () => {
  const [cells, setCells] = useState(
    Array.from({ length: ROWS }, () => Array(COLS).fill(""))
  );
  const [dragging, setDragging] = useState(null);

  const handleInputChange = (row, col, value) => {
    const newCells = [...cells];
    newCells[row][col] = value;
    setCells(newCells);
  };

  const handleDragStart = (row, col) => {
    setDragging({ row, col, value: cells[row][col] });
  };

  const handleDrop = (row, col) => {
    if (dragging) {
      const newCells = [...cells];
      newCells[row][col] = dragging.value;
      setCells(newCells);
      setDragging(null);
    }
  };

  const calculateFunction = (func, colIndex) => {
    const values = cells.map((row) => parseFloat(row[colIndex]) || 0);
    switch (func) {
      case "SUM":
        return values.reduce((sum, val) => sum + val, 0);
      case "AVERAGE":
        return values.length ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
      case "MAX":
        return Math.max(...values);
      case "MIN":
        return Math.min(...values);
      case "COUNT":
        return values.filter((val) => val !== 0).length;
      default:
        return "";
    }
  };

  const chartData = [["Column", "SUM"]];
  for (let col = 0; col < COLS; col++) {
    chartData.push([`Col ${col + 1}`, calculateFunction("SUM", col)]);
  }

  return (
    <div className="spreadsheet">
      <table>
        <thead>
          <tr>
            {Array.from({ length: COLS }, (_, colIndex) => (
              <th key={colIndex}>Col {colIndex + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cells.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  draggable
                  onDragStart={() => handleDragStart(rowIndex, colIndex)}
                  onDrop={() => handleDrop(rowIndex, colIndex)}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) =>
                      handleInputChange(rowIndex, colIndex, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
          <tr>
            {Array.from({ length: COLS }, (_, colIndex) => (
              <td key={colIndex}><strong>{calculateFunction("SUM", colIndex)}</strong></td>
            ))}
          </tr>
        </tbody>
      </table>
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="300px"
        data={chartData}
      />
    </div>
  );
};

export default Spreadsheet;