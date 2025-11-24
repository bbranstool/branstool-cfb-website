import "./TeamCard.css"

export default function TeamCard({ theme, team }) {
  const { team_name, mascot, division, espn_id } = team;
  const darkLogoText = theme == 'dark' ? "-dark" : "";
  console.log(theme)
  const logoUrl = `http://a.espncdn.com/i/teamlogos/ncaa/500${darkLogoText}/${espn_id}.png`;
  // const logoUrl = `http://a.espncdn.com/i/teamlogos/ncaa/500/${espn_id}.png`;

  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/60?text=No+Logo";
  };

  return (
    <div className="team-card">
      <img
        className="team-logo"
        src={logoUrl}
        alt={`${team_name} logo`}
        width="60"
        height="60"
        onError={handleError}
      />
      <div className="team-info">
        <div className="team_name">{team_name}</div><div className="team-mascot">{mascot}</div>
      </div>
    </div>
  );
}
