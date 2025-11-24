import React, { useMemo, useState, useEffect } from "react";
import "./GameTable.css";

function safeDateValue(item) {
    // prefer first_date, fallback to date or null
    return item?.first_date ?? item?.date ?? null;
}

function parseDate(iso) {
    if (!iso) return null;
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(iso) {
    const d = parseDate(iso);
    if (!d) return "N/A";
    // using toLocaleDateString for friendly display; adjust second arg for locale
    return d.toLocaleDateString();
}

export default function GameTable({ data = [], initialPageSize = 20 }) {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(initialPageSize);

    // 1) Sort data by date desc (most recent first)
    const sorted = useMemo(() => {
        if (!Array.isArray(data)) return [];
        return [...data].sort((a, b) => {
            const da = parseDate(safeDateValue(a));
            const db = parseDate(safeDateValue(b));
            // if both missing, keep original order
            if (!da && !db) return 0;
            if (!da) return 1;
            if (!db) return -1;
            return db - da; // descending (most recent first)
        });
    }, [data]);

    const total = sorted.length;
    const pageCount = Math.max(1, Math.ceil(total / pageSize));

    // 2) clamp page when pageSize or total changes (in effect, not during render)
    useEffect(() => {
        if (page > pageCount - 1) {
            setPage(pageCount - 1);
        }
        // If page is negative for any reason, clamp to 0
        if (page < 0) setPage(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageCount, page]); // intentionally only on pageCount/page changes

    // 3) compute current rows (sliced from sorted)
    const currentRows = useMemo(() => {
        if (!Array.isArray(sorted)) return [];
        const start = page * pageSize;
        return sorted.slice(start, start + pageSize);
    }, [sorted, page, pageSize]);

    // small helpers for pager button handlers
    const goFirst = () => setPage(0);
    const goPrev = () => setPage((p) => Math.max(0, p - 1));
    const goNext = () => setPage((p) => Math.min(pageCount - 1, p + 1));
    const goLast = () => setPage(pageCount - 1);

    return (
        <div className="game-table-wrap">
            <div className="game-table-scroll" role="region" aria-label="Games list">
                <table className="game-table" role="table" aria-label="Games">
                    <thead>
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Winning Score</th>
                            <th scope="col">Losing Score</th>
                            <th scope="col">Winning Team</th>
                            <th scope="col">Losing Team</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((r, i) => {
                            // prefer a stable id if present, else fallback to a composite key
                            const id = r.id ?? r.game_id ?? `${r.first_date ?? "d"}-${r.winning_score}-${r.losing_score}-${i}`;
                            return (
                                <tr key={id}>
                                    <td>{formatDate(safeDateValue(r))}</td>
                                    <td>{r.winning_score ?? "—"}</td>
                                    <td>{r.losing_score ?? "—"}</td>
                                    <td>{r.first_winning_team ?? r.winning_team ?? "N/A"}</td>
                                    <td>{r.first_losing_team ?? r.losing_team ?? "N/A"}</td>
                                </tr>
                            );
                        })}

                        {currentRows.length === 0 && (
                            <tr className="no-rows">
                                <td colSpan={5} className="no-rows-cell">
                                    No rows
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="game-table-controls" role="toolbar" aria-label="Game table controls">
                <div className="game-table-info" aria-live="polite">
                    Showing {total === 0 ? 0 : page * pageSize + 1}-
                    {Math.min(total, (page + 1) * pageSize)} of {total}
                </div>

                <div className="game-table-pager" role="navigation" aria-label="Pagination">
                    <button onClick={goFirst} disabled={page === 0} aria-label="First page">
                        «
                    </button>
                    <button onClick={goPrev} disabled={page === 0} aria-label="Previous page">
                        ‹
                    </button>

                    <span className="page-indicator" aria-live="polite">
                        Page {page + 1} / {pageCount}
                    </span>

                    <button onClick={goNext} disabled={page >= pageCount - 1} aria-label="Next page">
                        ›
                    </button>
                    <button onClick={goLast} disabled={page >= pageCount - 1} aria-label="Last page">
                        »
                    </button>
                </div>

                <div className="game-table-page-size">
                    <label>
                        Rows:
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                const next = Number(e.target.value) || 50;
                                setPageSize(next);
                                setPage(0); // jump to first page on page size change
                            }}
                        >
                            {[10, 25, 50, 100].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>
        </div>
    );
}
