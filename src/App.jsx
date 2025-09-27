import React, { useState, useEffect, useCallback, useRef } from "react";

function App() {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [rooms, setRooms] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState("");

  // Number/score formatters
  const nf = new Intl.NumberFormat("en-PK");
  const fmtInt = (n) => (typeof n === "number" ? nf.format(n) : n ?? "-");
  const fmtPKR = (n) => (typeof n === "number" ? nf.format(n) : n ?? "-");
  const fmtScore = (s) => (typeof s === "number" ? s.toFixed(3) : s ?? "-");

  // Abort controllers to prevent race conditions on fast re-requests
  const statsCtrlRef = useRef(null);
  const roomsCtrlRef = useRef(null);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError("");
    // Abort previous stats request if any
    if (statsCtrlRef.current) statsCtrlRef.current.abort();
    const ctrl = new AbortController();
    statsCtrlRef.current = ctrl;
    try {
      const res = await fetch(`/stats`, { signal: ctrl.signal });
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (e) {
      if (e.name !== "AbortError") setStatsError(e.message);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    return () => {
      if (statsCtrlRef.current) statsCtrlRef.current.abort();
      if (roomsCtrlRef.current) roomsCtrlRef.current.abort();
    };
  }, [fetchStats]);

  const searchRooms = useCallback(async () => {
    if (!searchText.trim()) {
      setRoomsError("Enter a query to search rooms");
      return;
    }
    setRoomsLoading(true);
    setRoomsError("");
    setRooms([]);
    setAppliedFilters(null);
    // Abort previous rooms search if any
    if (roomsCtrlRef.current) roomsCtrlRef.current.abort();
    const ctrl = new AbortController();
    roomsCtrlRef.current = ctrl;
    try {
      const res = await fetch(`/rooms/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_text: searchText }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error("Failed to search rooms");
      const data = await res.json();
      setRooms(data.rooms || []);
      setAppliedFilters(data.applied_filters || null);
    } catch (e) {
      if (e.name !== "AbortError") setRoomsError(e.message);
    } finally {
      setRoomsLoading(false);
    }
  }, [searchText]);

  const onRoomsSubmit = useCallback((e) => {
    e.preventDefault();
    if (!roomsLoading) {
      searchRooms();
    }
  }, [roomsLoading, searchRooms]);

  return (
    <div className="p-6 font-sans bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🎯 Room Matcher AI</h1>

      <section className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-xl font-semibold">📊 Dataset Stats</h2>
          <button
            onClick={fetchStats}
            className="text-sm bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
            disabled={statsLoading}
            title="Refresh stats"
          >
            {statsLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        {statsError && <p className="text-red-600 text-sm mb-2">{statsError}</p>}
        {stats ? (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded shadow p-4">
              <h3 className="font-semibold mb-2">Totals</h3>
              <div className="flex gap-6 text-sm">
                <div>
                  <div className="text-gray-500">Profiles</div>
                  <div className="text-lg font-bold">{fmtInt(stats.profiles_count)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Listings</div>
                  <div className="text-lg font-bold">{fmtInt(stats.listings_count)}</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-gray-500 text-sm mb-1">Rent (PKR)</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-500">Min:</span> <span className="font-mono">{fmtPKR(stats.rent_min)}</span></div>
                  <div><span className="text-gray-500">25%:</span> <span className="font-mono">{fmtPKR(stats.rent_25p)}</span></div>
                  <div><span className="text-gray-500">Median:</span> <span className="font-mono">{fmtPKR(stats.rent_median)}</span></div>
                  <div><span className="text-gray-500">75%:</span> <span className="font-mono">{fmtPKR(stats.rent_75p)}</span></div>
                  <div><span className="text-gray-500">Max:</span> <span className="font-mono">{fmtPKR(stats.rent_max)}</span></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h3 className="font-semibold mb-2">Profiles by City</h3>
              <ul className="text-sm list-disc ml-5 space-y-1 max-h-48 overflow-auto">
                {Object.entries(stats.profiles_by_city || {}).map(([city, count]) => (
                  <li key={city} className="flex justify-between">
                    <span>{city}</span>
                    <span className="font-mono">{fmtInt(count)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h3 className="font-semibold mb-2">Listings by City</h3>
              <ul className="text-sm list-disc ml-5 space-y-1 max-h-48 overflow-auto">
                {Object.entries(stats.listings_by_city || {}).map(([city, count]) => (
                  <li key={city} className="flex justify-between">
                    <span>{city}</span>
                    <span className="font-mono">{fmtInt(count)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-sm">{statsLoading ? "Loading stats..." : "Stats not available."}</p>
        )}
      </section>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">🏠 Search Rooms (Free Text)</h2>
        <form onSubmit={onRoomsSubmit} className="flex items-start gap-2">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Describe your need (e.g., 'Need room in Lahore G-11, budget 20k')"
            className="border p-2 rounded w-full md:w-2/3"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            disabled={roomsLoading}
          >
            {roomsLoading ? "Searching..." : "Search"}
          </button>
        </form>
        {roomsError && <p className="text-red-600 text-sm mt-2">{roomsError}</p>}
        {appliedFilters && (
          <div className="mt-3 text-sm text-gray-700">
            <span className="mr-2">Applied Filters:</span>
            <span className="inline-flex items-center gap-1 bg-gray-200 rounded px-2 py-0.5 mr-2">
              <span className="text-gray-600">City</span>
              <span className="font-mono">{appliedFilters.city ?? "-"}</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-gray-200 rounded px-2 py-0.5 mr-2">
              <span className="text-gray-600">Budget</span>
              <span className="font-mono">{appliedFilters.budget_min ?? "-"} - {appliedFilters.budget_max ?? "-"}</span>
            </span>
          </div>
        )}
        {rooms.length > 0 && (
          <div className="mt-4 space-y-3">
            {rooms.map((r) => (
              <div key={r.listing_id} className="bg-white rounded shadow p-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold">{r.city} — {r.area}</h3>
                  <div className="text-sm text-gray-600">Score: <span className="font-mono">{fmtScore(r.score)}</span></div>
                </div>
                <div className="mt-1 text-sm text-gray-700">
                  <div className="mb-1">Listing: <span className="font-mono">{r.listing_id}</span></div>
                  <div>Rent: <span className="font-mono">{fmtPKR(r.monthly_rent_PKR)}</span> PKR</div>
                </div>
                {Array.isArray(r.amenities) && r.amenities.length > 0 && (
                  <ul className="mt-2 text-sm list-disc ml-5 space-y-0.5">
                    {r.amenities.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      
    </div>
  );
}

export default App;
