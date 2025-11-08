import TeamCard from "./TeamCard";
import "./ConferenceSection.css"

export default function ConferenceSection({ theme, name, teams }) {
  return (
    <div className="conference-section">
      <h2 className="conference-name">{name}</h2>
      <div className="team-list">
        {teams.map((team) => (
          <TeamCard key={team.espn_id} theme={theme} team={team} />
        ))}
      </div>
    </div>
  );
}
