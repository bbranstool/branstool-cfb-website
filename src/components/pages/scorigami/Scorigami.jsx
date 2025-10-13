import ScorigamiStats from "./components/ScorigamiStats";
import ScorigamiTable from "./components/ScorigamiTable";
import "./Scorigami.css";
import { useEffect, useState } from "react";

function Scorigami() {
    return (
        <div className="scorigami">
            <h1 className="scorigami-title">FBS Scorigami</h1>

            <ScorigamiStats total_games={12918} total_scorigamis={1494} last_scorigami={"2025-09-13"}/>
            <ScorigamiTable maxWinScore={100} maxLoseScore={100}/>
        </div>
    );
}

export default Scorigami;
