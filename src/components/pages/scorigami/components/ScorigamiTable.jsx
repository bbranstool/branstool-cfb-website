import React from "react";
import "./ScorigamiTable.css";

const impossibleScores = [[0, 1], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 7]];

/**
 * Props:
 *  - maxWinScore (number) default 12  -> number of columns - 1 (0..maxWinScore)
 *  - maxLoseScore (number) default 12 -> number of rows - 1 (0..maxLoseScore)
 */
export default function ScorigamiTable({
  maxWinScore = 100,
  maxLoseScore = maxWinScore,
}) {
  const cols = maxWinScore + 1;
  const rows = maxLoseScore + 1;

  const tableRows = [];

  for (let y = 0; y < rows; y++) {
    const cells = [];
    for (let x = 0; x < cols; x++) {
      let classNames = ["score"];

      if (impossibleScores.some(score => score[0] == x && score[1] == y || score[1] == x && score[0] == y)) {
        classNames.push("impossible");
      }

      if (y > x) {
        classNames.push("losing");
      }

      cells.push(
        <td key={x} >
          <div className={classNames.join(' ')}>
            <div className="count hidden">
              0
            </div>
          </div>
        </td>
      );
    }

    tableRows.push(
      <tr key={y} className={`losing-score-row-${y}`}>{cells}</tr>
    );
  }

  return (
    <div className="scorigami-table-container">
      <table className="scorigami-table">
        <tbody>
          <tr>
            <td className="axis-label" colSpan={cols + 2}>Winning Team Score</td>
            <td className="axis-label" rowSpan={rows + 3}>
              <div className="vertical-text">Losing Team Score</div>
            </td>
          </tr>
          {buildWinningScoreHeaders({ maxWinScore })}
          {tableRows}
        </tbody>
      </table>
    </div>
  );
}

function buildWinningScoreHeaders({ maxWinScore }) {
  const headers = [];
  for (let x = 0; x <= maxWinScore; x++) {
    headers.push(<th key={x}>{x}</th>);
  }

  return (
    <tr key={-1} className="table-winning-score-header">
      {headers}
    </tr>
  );
}