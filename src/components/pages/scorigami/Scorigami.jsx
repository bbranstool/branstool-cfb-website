import ScorigamiStats from "./components/ScorigamiStats";
import ScorigamiTable from "./components/ScorigamiTable";
import "./Scorigami.css";
import { useEffect, useState } from "react";
import loadingGif from "../../../assets/loading.gif";


function Scorigami() {
    const [scorigamiData, setScorigamiData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTableData = async () => {

            fetch("http://localhost:3000/api/fbs_only_scorigami")
                .then(res => res.json())
                .then(data => {
                    setScorigamiData(data);
                    setIsLoading(false);
                })
                .catch(() => setIsLoading(false));

            setIsLoading(false);
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
            <ScorigamiTable scorigamiData={scorigamiData} maxWinScore={100} maxLoseScore={100} />
        </div>
    );
}

export default Scorigami;
