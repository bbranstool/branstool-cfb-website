import ScorigamiStats from "./components/ScorigamiStats";
import ScorigamiTable from "./components/table/ScorigamiTable";
import "./Scorigami.css";
import { useEffect, useState } from "react";
import loadingGif from "../../../assets/loading.gif";


function Scorigami() {
    const [scorigamiData, setScorigamiData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTableData = async () => {
            setIsLoading(true);
            
            try {
                const results = await fetch("https://college-football-api.vercel.app/api/fbs_only_scorigami");
                const data = await results.json();
                setScorigamiData(data);
            } catch (error) {
                console.error("Failed to load table data:", error);
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchTableData();
    }, []);

    if (isLoading) {
        return (
            <div id="loadingTableDiv">
                <img id="loadingTable" src={loadingGif} alt="Loading" />
            </div>
        );
    }

    const uniqueScores = scorigamiData.length;
    const totalGames = scorigamiData.reduce((sum, score) => sum + score.total_count, 0);
    const maxWinScore = scorigamiData.reduce((maxWin, score) => Math.max(maxWin, score.winning_score), 0);

    // Get the most recent last_date
    const mostRecentDate = scorigamiData.length > 0
        ? new Date(Math.max(...scorigamiData.map(score => new Date(score.first_date).getTime())))
        : null;

    return (
        <div className="scorigami">
            <h1 className="scorigami-title">FBS Scorigami</h1>

            <ScorigamiStats
                total_games={totalGames}
                total_scorigamis={uniqueScores}
                last_scorigami={mostRecentDate ? mostRecentDate.toISOString().slice(0, 10) : "N/A"} />
            <ScorigamiTable scorigamiData={scorigamiData} maxWinScore={maxWinScore} maxLoseScore={maxWinScore} />
        </div>
    );
}

export default Scorigami;
