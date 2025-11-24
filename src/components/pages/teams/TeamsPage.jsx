import "./TeamsPage.css";
import { useEffect, useState } from "react";
import ConferenceSection from "./components/ConferenceSection";
import loadingGif from "../../../assets/loading.gif";

export default function TeamsPage({ theme }) {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                // Try loading from cache
                const cached = localStorage.getItem("teamsData");
                const cachedTime = localStorage.getItem("teamsDataTimestamp");

                if (cached && cachedTime && isCacheValid(Number(cachedTime))) {
                    setTeams(JSON.parse(cached));
                    setLoading(false);
                    return;
                }

                // Fetch new data
                const res = await fetch("https://college-football-api.vercel.app/api/fbs_teams");
                const data = await res.json();

                // Sort all teams alphabetically
                const sortedTeams = data.sort((a, b) =>
                    a.team_name.localeCompare(b.team_name)
                );

                setTeams(sortedTeams);

                // Save to cache
                localStorage.setItem("teamsData", JSON.stringify(sortedTeams));
                localStorage.setItem("teamsDataTimestamp", Date.now().toString());
            } catch (err) {
                console.error("Error fetching team data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    if (loading) {
        return (
            <div id="loadingDiv">
                <img id="loading" src={loadingGif} alt="Loading" />
            </div>
        );
    }

    const groupedTeams = groupTeamsByConference(teams);
    const sortedGroupedTeams = Object.entries(groupedTeams).sort(([confA], [confB]) =>
        confA.localeCompare(confB)
    );

    return (
        <div className="teams-page">
            <h1 className="teams-page-title">FBS Teams</h1>
            <div className="conference-list">
                {sortedGroupedTeams.map(([conference, teams]) => (
                    <ConferenceSection
                        key={conference}
                        theme={theme}
                        name={conference}
                        teams={teams}
                    />
                ))}
            </div>
        </div>
    );
}

function groupTeamsByConference(teams) {
    const grouped = {};
    for (const team of teams) {
        if (!grouped[team.conference]) grouped[team.conference] = [];
        grouped[team.conference].push(team);
    }

    // Sort alphabetically inside each conference
    for (const conf in grouped) {
        grouped[conf].sort((a, b) => a.team_name.localeCompare(b.team_name));
    }

    return grouped;
}

// Helper: check if cached data is still fresh (< 24h old)
function isCacheValid(timestamp) {
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    return Date.now() - timestamp < ONE_DAY_MS;
    // return false;
}