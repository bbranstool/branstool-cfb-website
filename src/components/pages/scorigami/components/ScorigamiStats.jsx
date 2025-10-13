import "./ScorigamiStats.css";
import { useEffect, useState } from "react";

function ScorigamiStats({total_games, total_scorigamis, last_scorigami}) {
    return (
        <div className="scorigami-stats">
            <div className="stat">
                <div className="stat-value">
                    <AnimatedNumber value={total_games} />
                </div>
                <div className="stat-label">Total Games</div>
            </div>

            <div className="divider"></div>

            <div className="stat">
                <div className="stat-value">
                    <AnimatedNumber value={total_scorigamis} />
                </div>
                <div className="stat-label">Total Scorigamis</div>
            </div>

            <div className="divider"></div>

            <div className="stat">
                <div className="stat-value">
                    {last_scorigami}
                </div>
                <div className="stat-label">Last Scorigami</div>
            </div>
        </div>
    );
}

export default ScorigamiStats;

function AnimatedNumber({ value, duration = 3000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = easeOutCubic(progress);
      setCount(Math.floor(easedProgress * value));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}