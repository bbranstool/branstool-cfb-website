import React, { useEffect, useState } from "react";
import "./ScorigamiTable.css";
import { MultiGrid } from "react-virtualized";

const impossibleScores = [[0, 1], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 7]];

/**
 * Props:
 *  - maxWinScore (number) default 100  -> number of columns - 1 (0..maxWinScore)
 *  - maxLoseScore (number) default maxWinScore -> number of rows - 1 (0..maxLoseScore)
 */
function ScorigamiTable({
  scorigamiData,
  maxWinScore = 100,
  maxLoseScore = maxWinScore,
}) {
  const tableData = buildTableData(maxWinScore, maxLoseScore, scorigamiData);

  return (
    <>
      <div className="table-header">Winning Score</div>
      <div className="table-container">
        <table className="scorigami-table">
          <tbody>
            {tableData}
          </tbody>
        </table>
      </div>
    </>
  );
}

function buildTableData(maxWinScore, maxLoseScore, scorigamiData) {
  const cols = maxWinScore + 1;
  const rows = maxLoseScore + 1;

  const tableRows = []

  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      const classNames = [];
      classNames.push("score-cell");

      if (isImpossibleScore(x, y)) classNames.push("impossible-score");
      if (y > x) classNames.push("losing-score-hidden");
      if (isScorigami(x, y, scorigamiData)) classNames.push("has-happened");

      row.push(
        <td key={`${x}-${y}`} className={classNames.join(" ")}>
          <div className="hidden">{scorigamiData.total_count}</div>
        </td>
      );
    }

    tableRows.push(<tr key={y}>{row}</tr>);
  }

  return tableRows;
}

function isImpossibleScore(x, y) {
  return impossibleScores.some(([scoreX, scoreY]) =>
    (x === scoreX && y === scoreY) || (x === scoreY && y === scoreX)
  );
}

function isScorigami(x, y, scorigamiData) {
  return scorigamiData.some((scorigami) =>
    scorigami.winning_score === x && scorigami.losing_score === y
  );
}

export default ScorigamiTable;