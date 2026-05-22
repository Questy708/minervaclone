import React, { useState } from "react";
import {
  Search,
  Sparkles,
  Award,
  HelpCircle,
  ArrowUpRight,
  BookOpen,
  Layers,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { CORNERSTONE_HCS } from "../data";
import { HCCecept } from "../types";

export default function OutcomeIndex() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | "Formal" | "Empirical" | "Multimodal" | "Social"
  >("All");
  const [selectedHC, setSelectedHC] = useState<HCCecept | null>(null);

  const getDistributionData = (hc: HCCecept) => {
    const seed = hc.code.length + hc.description.length;
    return [
      { score: "1", students: (seed * 3) % 5 },
      { score: "2", students: ((seed * 7) % 8) + 2 },
      { score: "3", students: ((seed * 11) % 15) + 5 },
      { score: "4", students: ((seed * 13) % 20) + 8 },
      { score: "5", students: ((seed * 17) % 18) + 4 },
    ];
  };

  const filteredHCs = CORNERSTONE_HCS.filter((hc) => {
    const matchesSearch =
      hc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || hc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-grow bg-[#F3F4F6] text-[#334155] min-h-screen flex flex-col font-sans select-none">
      {/* Mini-Header Header */}
      <header className="px-8 py-4 bg-white border-b border-slate-200 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-orange-600 font-bold">
            OUTCOME INDEX ENGINE
          </span>
          <h1 className="text-lg font-bold text-slate-900 font-serif">
            Habits of Mind & Foundational Concepts (HCs) Catalog
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter HCs (e.g., #analogies)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-64 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-505 focus:ring-indigo-500 bg-slate-50 text-slate-800"
            />
          </div>

          <div className="flex rounded-lg border border-slate-250 bg-slate-50 p-0.5 text-xs font-semibold">
            {["All", "Formal", "Empirical", "Multimodal", "Social"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`px-3 py-1.5 rounded-md transition ${selectedCategory === cat ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
                >
                  {cat}
                </button>
              ),
            )}
          </div>
        </div>
      </header>

      {/* Grid containing list and details */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Left List Pane */}
        <div className="lg:col-span-2 flex flex-col space-y-4 overflow-y-auto max-h-[580px] pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredHCs.map((hc, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedHC(hc)}
                className={`bg-white border p-4 rounded-xl cursor-pointer hover:border-indigo-500 hover:shadow-xs transition duration-150 flex flex-col justify-between ${selectedHC?.code === hc.code ? "border-indigo-600 ring-1 ring-indigo-500/15" : "border-slate-200"}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-700">
                      {hc.code}
                    </span>
                    <span
                      className={`text-[8.5px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                        hc.category === "Formal"
                          ? "bg-purple-50 text-purple-700"
                          : hc.category === "Empirical"
                            ? "bg-blue-50 text-blue-700"
                            : hc.category === "Social"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      {hc.category}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                    {hc.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-3 pt-2 border-t border-slate-100">
                  <span>
                    Score Weight:{" "}
                    <strong className="text-slate-600 font-sans">
                      {hc.weight}
                    </strong>
                  </span>
                  <span>
                    Instances Evaluated:{" "}
                    <strong className="text-slate-600 font-sans">
                      {hc.count}
                    </strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Details Pane */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between h-[650px] lg:h-auto">
          {selectedHC ? (
            <div className="space-y-6 flex-grow flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[14.5px] font-bold text-indigo-700">
                    {selectedHC.code}
                  </span>
                  <span
                    className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                      selectedHC.category === "Formal"
                        ? "bg-purple-100 text-purple-700"
                        : selectedHC.category === "Empirical"
                          ? "bg-blue-100 text-blue-700"
                          : selectedHC.category === "Social"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {selectedHC.category}
                  </span>
                </div>

                <div className="border-t border-slate-150 pt-4 space-y-3.5">
                  <div>
                    <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Concept Objective Summary
                    </h4>
                    <p className="text-[12px] leading-relaxed font-semibold text-slate-700 mt-1">
                      {selectedHC.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 text-xs">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                      <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wide block">
                        Weight Scale
                      </span>
                      <span className="text-sm font-bold text-slate-800 font-serif block mt-0.5">
                        {selectedHC.weight} index
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                      <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wide block">
                        Classroom Runs
                      </span>
                      <span className="text-sm font-bold text-slate-800 font-serif block mt-0.5">
                        {selectedHC.count} tagged
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-150">
                    <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-4">
                      Student Score Distribution
                    </h4>
                    <div className="h-48 w-full -ml-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getDistributionData(selectedHC)}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E2E8F0"
                          />
                          <XAxis
                            dataKey="score"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fontSize: 10,
                              fill: "#64748B",
                              fontWeight: 600,
                            }}
                            dy={10}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#94A3B8" }}
                          />
                          <Tooltip
                            cursor={{ fill: "#F1F5F9" }}
                            contentStyle={{
                              borderRadius: "8px",
                              border: "1px solid #E2E8F0",
                              fontSize: "11px",
                              fontWeight: 600,
                              color: "#334155",
                            }}
                          />
                          <Bar
                            dataKey="students"
                            fill="#6366F1"
                            radius={[4, 4, 0, 0]}
                            barSize={24}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#EEF2FF] p-4 rounded-xl border border-indigo-150 text-xs text-indigo-650 space-y-2 leading-relaxed text-indigo-900">
                <div className="flex items-center space-x-1.5 font-bold">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Curriculum Outcome Reference</span>
                </div>
                <p className="text-[10.5px]">
                  Use the syntax{" "}
                  <code className="font-mono font-bold text-indigo-700 bg-white/60 px-1 rounded">
                    {selectedHC.code}
                  </code>{" "}
                  in the chat input or dialog boxes inside classrooms to trigger
                  context evaluation trackers!
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Layers className="w-12 h-12 text-slate-350 stroke-1 mb-3 animate-pulse" />
              <h3 className="text-xs font-bold text-slate-600 font-mono uppercase tracking-wider">
                Explore Outcomes
              </h3>
              <p className="text-[11px] leading-relaxed max-w-xs mt-1">
                Click on any Habit of Mind (#analogies, #constraints, or
                #dataviz) to analyze details, curriculum parameters, or category
                classifications.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
