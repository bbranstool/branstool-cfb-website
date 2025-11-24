import React, { useEffect, useState } from "react";
import "./ScorigamiTable.css";
import "./Highlight.css";
import InfoBox from "../infobox/InfoBox";

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
  teamTable = false,
}) {
  const [info, setInfo] = useState(null);
  const tableData = buildTableData(maxWinScore, maxLoseScore, scorigamiData, setInfo);
  let infoBox = <></>

  if (info) {
    infoBox = <InfoBox
      open
      x={info.x}
      y={info.y}
      score={info.score}
      position={{ left: info.left, top: info.top }}
      onClose={() => setInfo(null)}
    />
  }

  return (
    <>
      <div className="table-header">Winning Score</div>
      <div className="table-container">
        <table className="scorigami-table">
          <tbody>
            {tableData}
          </tbody>
        </table>
        {infoBox}
      </div>
    </>
  );
}

function buildTableData(maxWinScore, maxLoseScore, scorigamiData, setInfo) {
  const cols = maxWinScore + 1;
  const rows = maxLoseScore + 1;

  // small handlers that add/remove highlight class on matching headers
  const onCellEnter = (x, y) => {
    const cell = document.querySelector(`td[score="${x}-${y}"]`);
    if (cell) {
      if (cell.classList.contains("losing-score-hidden")) {
        return;
      }
    }

    const win = document.querySelector(`th[data-win="${x}"]`);
    if (win) win.classList.add("header-highlight");
    const lose = document.querySelector(`th[data-lose="${y}"]`);
    if (lose) lose.classList.add("header-highlight");

    // add 'highlight-adj' to all elements tied to this winning score and losing score
    const related = document.querySelectorAll(`[data-win="${x}"], [data-lose="${y}"]`);
    related.forEach((el) => {
      const winAttr = el.getAttribute("data-win");
      const loseAttr = el.getAttribute("data-lose");
      const winNum = parseInt(winAttr, 10);
      const loseNum = parseInt(loseAttr, 10);

      if (winNum > x || loseNum > y) {
        return;
      }

      el.classList.add("highlight-adj");
    });

    if (cell) {
      cell.classList.add("highlight");
      cell.classList.remove("highlight-adj");
    }
  };

  const onCellLeave = (x, y) => {
    const win = document.querySelector(`th[data-win="${x}"]`);
    if (win) win.classList.remove("header-highlight");
    const lose = document.querySelector(`th[data-lose="${y}"]`);
    if (lose) lose.classList.remove("header-highlight");
    const cell = document.querySelector(`td[score="${x}-${y}"]`);
    if (cell) cell.classList.remove("highlight");

    // remove 'highlight-adj' from all elements tied to this winning score and losing score
    const winElems = document.querySelectorAll(`[data-win="${x}"]`);
    winElems.forEach((el) => el.classList.remove("highlight-adj"));
    const loseElems = document.querySelectorAll(`[data-lose="${y}"]`);
    loseElems.forEach((el) => el.classList.remove("highlight-adj"));
  };

  // Build score header (0 .. maxWinScore)
  const headerCells = [];
  // top-left corner cell (empty)
  headerCells.push(<th key="losing-header" rowSpan={rows + 1} className="table-header"><div className="vertical">Losing Score</div></th>)
  headerCells.push(<th key="corner" className="score-header-corner" />);
  for (let x = 0; x < cols; x++) {
    headerCells.push(
      <th key={`winning-score-${x}`} className="score-header" data-win={x}>
        {x}
      </th>
    );
  }
  const headerRow = <tr key="header">{headerCells}</tr>;

  const bodyRows = []

  for (let y = 0; y < rows; y++) {
    const row = [];

    row.push(
      <th key={`losing-score-${y}`} className="score-row-header score-header" data-lose={y}>
        {y}
      </th>
    );

    for (let x = 0; x < cols; x++) {
      const classNames = [];
      classNames.push("score-cell");

      if (isImpossibleScore(x, y)) classNames.push("impossible-score");
      if (y > x) classNames.push("losing-score-hidden");
      if (isScorigami(x, y, scorigamiData)) classNames.push("has-happened");

      const scoreObj = getScoreData(x, y, scorigamiData);

      row.push(
        <td
          key={`${x}-${y}`}
          className={classNames.join(" ")}
          onMouseEnter={() => onCellEnter(x, y)}
          onMouseLeave={() => onCellLeave(x, y)}
          onClick={(e) => handleCellClick(setInfo, scoreObj, x, y, e)}
          score={`${x}-${y}`}
          data-win={`${x}`}
          data-lose={`${y}`}
        >
          <div className="hidden">{scoreObj.total_count}</div>
        </td>
      );
    }

    bodyRows.push(<tr key={y}>{row}</tr>);
  }

  return [headerRow, bodyRows];
}

function getScoreData(x, y, scorigamiData = []) {
  if (!Array.isArray(scorigamiData)) return {};
  return scorigamiData.find((s) => s.winning_score === x && s.losing_score === y) || {};
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

// add handler to call on cell click (use in your <td>)
function handleCellClick(setInfo, score, x, y, event) {
  const total = score && score.total_count != null ? score.total_count : 0;

  if (total == 0) {
    setInfo(null);
    return;
  }
  const rect = event.currentTarget.getBoundingClientRect();
  const infoBoxWidth = 200; // estimate width of InfoBox
  const infoBoxHeight = 120; // estimate height of InfoBox
  const margin = 8;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left, top;

  // Try placing to the right first
  if (rect.right + infoBoxWidth + margin < viewportWidth) {
    left = rect.right + window.scrollX + margin;
    top = rect.top + window.scrollY;
  }
  // Else try placing to the left
  else if (rect.left - infoBoxWidth - margin > 0) {
    left = rect.left + window.scrollX - infoBoxWidth - margin;
    top = rect.top + window.scrollY;
  }
  // Else try placing below
  else if (rect.bottom + infoBoxHeight + margin < viewportHeight) {
    left = rect.left + window.scrollX;
    top = rect.bottom + window.scrollY + margin;
  }
  // Else place above as last resort
  else {
    left = rect.left + window.scrollX;
    top = rect.top + window.scrollY - infoBoxHeight - margin;
  }

  setInfo({ x, y, score, left, top });
}

export default ScorigamiTable;