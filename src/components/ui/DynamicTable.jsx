import React, { useState, useMemo, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Skeleton } from "primereact/skeleton";
import { Search, Download, Layers, ArrowUp, ArrowDown } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { debounce } from "lodash";

// 🎨 Per-column color palette (cycles if more columns than colors)
const COLUMN_COLORS = [
    "text-cyan-400",
    "text-violet-400",
    "text-emerald-400",
    "text-amber-400",
    "text-rose-400",
    "text-sky-400",
    "text-pink-400",
    "text-lime-400",
];

// Badge color map — use col.badgeColor or auto-pick
const BADGE_STYLES = {
    cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    violet: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    rose: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    sky: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    pink: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    lime: "bg-lime-500/15 text-lime-400 border-lime-500/30",
};

const BADGE_COLOR_KEYS = Object.keys(BADGE_STYLES);

const DynamicTable = ({
    title = "Premium Data",
    data = [],
    columns = [],
    className = "",
    loading = false,
    dataKey = "id",
    rowsPerPageOptions = [10, 25, 50],
    lazy = false,
    totalRecords,
    onPageChange,
    onSortChange,
    onFilterChange,
}) => {
    const [globalFilter, setGlobalFilter] = useState("");
    const [sortConfig, setSortConfig] = useState({ multiSortMeta: [] });
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);

    const debouncedGlobalFilter = useCallback(
        debounce((value) => {
            setGlobalFilter(value);
            onFilterChange?.({ global: value });
        }, 400),
        [onFilterChange]
    );

    const filteredData = useMemo(() => {
        if (lazy || !globalFilter) return data;
        const term = globalFilter.toLowerCase();
        return data.filter((row) =>
            Object.values(row).some((val) =>
                val?.toString().toLowerCase().includes(term)
            )
        );
    }, [data, globalFilter, lazy]);

    const displayData = lazy ? data : filteredData.slice(first, first + rows);
    const total = lazy ? (totalRecords || 0) : filteredData.length;

    // ✅ Only show skeleton rows when loading AND no data yet
    console.log("loading", loading, data.length );
    const isSkeletonMode = loading && data.length === 0;
    console.log("isSkeletonMode", isSkeletonMode);
    console.log("key", dataKey);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([excelBuffer]), `Export_${new Date().getTime()}.xlsx`);
    };

    const getSortIcon = (field) => {
        const activeSort = sortConfig.multiSortMeta?.find((s) => s.field === field);
        if (!activeSort) return <ArrowUp size={14} className="ml-1 opacity-30" />;
        return activeSort.order === 1
            ? <ArrowUp size={14} className="ml-1 text-cyan-400" />
            : <ArrowDown size={14} className="ml-1 text-cyan-400" />;
    };

    // 🏷️ Badge renderer
    const renderBadge = (value, colIndex, col) => {
        const colorKey = col.badgeColor || BADGE_COLOR_KEYS[colIndex % BADGE_COLOR_KEYS.length];
        const style = BADGE_STYLES[colorKey] || BADGE_STYLES.cyan;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
                {value ?? "-"}
            </span>
        );
    };

    return (
        <div className={`glass-container p-2 rounded-[1.5rem] bg-black/10 text-white border border-white/20 shadow-2xl ${className}`}>

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between p-5 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                        <Layers className="text-text-cyan-400" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white tracking-tight">{title}</h2>
                        <div className="flex items-center gap-1.5 leading-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Live System</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-1 justify-end max-w-xl">
                    <div className="relative w-full max-w-xs group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-cyan-400 group-focus-within:text-cyan-400 transition-colors" size={18} />
                        <input
                            type="text"
                            onChange={(e) => debouncedGlobalFilter(e.target.value)}
                            placeholder="Search records..."
                            className="w-full bg-white/10 border border-white/20 text-white pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-cyan-500/50 transition-all text-sm"
                        />
                    </div>
                    <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-text-cyan-400 text-text-cyan-400 px-4 py-2.5 rounded-xl transition-all active:scale-95 whitespace-nowrap"
                    >
                        <Download size={16} />
                        <span className="text-sm font-medium">Export</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="mx-2 overflow-hidden rounded-xl border border-white/10 bg-black/20 whitespace-nowrap">
                <DataTable
                    value={isSkeletonMode ? Array.from({ length: rows }, (_, i) => ({
                        _id: `skeleton-${i}` // 🔥 unique id
                    })) : displayData}
                    dataKey={dataKey}
                    className="custom-table"
                    sortMode="multiple"
                    multiSortMeta={sortConfig.multiSortMeta}
                    onSort={(e) => setSortConfig(e)}
                    responsiveLayout="scroll"
                    emptyMessage={
                        !loading && (
                            <div className="text-center text-gray-400 py-6">
                                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <Search size={16} />
                                </div>
                                <p className="text-sm">No records found</p>
                            </div>
                        )
                    }
                >
                    {columns.map((col, colIndex) => {
                        const textColor = col.color
                            ? `text-${col.color}-400`
                            : COLUMN_COLORS[colIndex % COLUMN_COLORS.length];
                        
                        

                        return (
                            <Column
                                key={colIndex}
                                field={col.key}
                                sortable={col.sortable !== false}
                                header={
                                    <div className="flex items-center group cursor-pointer w-full py-1">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 group-hover:text-slate-200 transition-colors">
                                            {col.label}
                                        </span>
                                        {col.sortable !== false && getSortIcon(col.key)}
                                    </div>
                                }
                                body={(rowData, options) => {
                                    if (isSkeletonMode) {
                                        return <Skeleton width="70%" height="1rem" className="!bg-white/5" />;
                                    }

                                    // 🔥 INDEX FIRST
                                    if (col.isIndex) {
                                        return (
                                            <div className="text-sm text-slate-400 font-medium">
                                                {first + options.rowIndex + 1}
                                            </div>
                                        );
                                    }

                                    // ✅ SINGLE value declaration
                                    const value = col.render
                                        ? col.render(rowData[col.key], rowData, options.rowIndex)
                                        : rowData[col.key];

                                    // 🏷️ Badge
                                    if (col.isBadge) {
                                        return (
                                            <div className="py-1">
                                                {renderBadge(value, colIndex, col)}
                                            </div>
                                        );
                                    }

                                    // 🟢 Default text
                                    return (
                                        <div className={`text-sm font-medium py-1 ${textColor}`}>
                                            {value ?? "-"}
                                        </div>
                                    );
                                }}
                            />
                        );
                    })}
                </DataTable>
            </div>

            {/* Paginator */}
            <div className="p-4 mt-2">
                <Paginator
                    first={first}
                    rows={rows}
                    totalRecords={total}
                    rowsPerPageOptions={rowsPerPageOptions}
                    onPageChange={(e) => {
                        setFirst(e.first);
                        setRows(e.rows);
                        onPageChange?.(e);
                    }}
                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    className="custom-paginator"
                />
            </div>

            <style>{`
        .p-sortable-column-icon { display: none !important; }

        .custom-table .p-datatable-thead > tr > th {
          background: rgba(255,255,255,0.05) !important;
          border-bottom: 1px solid rgba(255,255,255,0.07) !important;
          padding: 0.85rem 1rem !important;
        }
        .custom-table .p-datatable-tbody > tr {
          background: transparent !important;
          transition: background 0.2s;
        }
        .custom-table .p-datatable-tbody > tr:hover {
          background: rgba(255,255,255,0.03) !important;
        }
        .custom-table .p-datatable-tbody > tr > td {
          border-bottom: 1px solid rgba(255,255,255,0.03) !important;
          padding: 0.75rem 1rem !important;
        }
        .custom-paginator {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px;
        }
        .custom-paginator .p-paginator-page,
        .custom-paginator .p-link {
          background: rgba(255,255,255,0.03) !important;
          color: #94a3b8 !important;
          border-radius: 10px !important;
          min-width: 2.2rem !important;
          height: 2.2rem !important;
          border: 1px solid rgba(255,255,255,0.05) !important;
          transition: 0.3s;
        }
        .custom-paginator .p-paginator-page.p-highlight {
          background: rgba(6,182,212,0.2) !important;
          color: #22d3ee !important;
          border-color: rgba(34,211,238,0.3) !important;
        }
        .p-dropdown {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 10px !important;
          padding: 2px 5px !important;
        }
        .p-dropdown-label { color: white !important; font-size: 13px !important; }
        .p-dropdown-trigger { color: #94a3b8 !important; }
      `}</style>
        </div>
    );
};

export default DynamicTable;