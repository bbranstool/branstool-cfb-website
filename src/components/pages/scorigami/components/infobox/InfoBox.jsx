import "./InfoBox.css";

function formatDate(iso) {
  if (!iso) return "N/A";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString();
}

export default function InfoBox({ open = true, x, y, score, position = { left: 0, top: 0 }, onClose = () => { } }) {
  if (!open) return null;

  const total = score && score.total_count != null ? score.total_count : "0";

  const style = {
    position: "absolute",
    left: position.left,
    top: position.top,
    zIndex: 9999,
  };

  const firstGame = getFirstGame(x, y, score);
  const lastGame = getLastGame(x, y, score, total);

  return (
    <div id="infoBox" style={style}>
      <span id="infoBoxScore">Score: {x} - {y} </span>
      <span id="infoBoxClose" onClick={onClose} aria-label="Close">✕</span>
      <br />
      {firstGame}
      {lastGame}
      <a>Total games: {total}</a>
    </div>
  );
}

function getFirstGame(x, y, score) {
  const firstDate = score && score.first_date ? formatDate(score.first_date) : "N/A";
  const firstWinningTeam = score ? score.first_winning_team : "N/A";
  const firstLosingTeam = score ? score.first_losing_team : "N/A";

  return <div>First game: <b>{firstWinningTeam} {x} - {firstLosingTeam} {y}</b> | {firstDate}</div>;
}

function getLastGame(x, y, score, total) {
  if (total <= 1) {
    return <></>;
  }

  const lastDate = score && score.last_date ? formatDate(score.last_date) : "N/A";
  const lastWinningTeam = score ? score.last_winning_team : "N/A";
  const lastLosingTeam = score ? score.last_losing_team : "N/A";

  return <div>Last game: <b>{lastWinningTeam} {x} - {lastLosingTeam} {y}</b> | {lastDate}</div>;
}