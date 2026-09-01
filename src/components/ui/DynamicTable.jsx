// import React, { useState, useMemo, useCallback } from "react";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import { Paginator } from "primereact/paginator";
// import { Skeleton } from "primereact/skeleton";
// import { Search, Download, Layers, ArrowUp, ArrowDown } from "lucide-react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { debounce } from "lodash";

// // 🎨 Per-column color palette (cycles if more columns than colors)
// const COLUMN_COLORS = [
//     "text-cyan-400",
//     "text-violet-400",
//     "text-emerald-400",
//     "text-amber-400",
//     "text-rose-400",
//     "text-sky-400",
//     "text-pink-400",
//     "text-lime-400",
// ];

// // Badge color map — use col.badgeColor or auto-pick
// const BADGE_STYLES = {
//     cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
//     violet: "bg-violet-500/15 text-violet-400 border-violet-500/30",
//     emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
//     amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
//     rose: "bg-rose-500/15 text-rose-400 border-rose-500/30",
//     sky: "bg-sky-500/15 text-sky-400 border-sky-500/30",
//     pink: "bg-pink-500/15 text-pink-400 border-pink-500/30",
//     lime: "bg-lime-500/15 text-lime-400 border-lime-500/30",
// };

// const BADGE_COLOR_KEYS = Object.keys(BADGE_STYLES);

// const DynamicTable = ({
//     title = "Premium Data",
//     data = [],
//     columns = [],
//     className = "",
//     loading = false,
//     dataKey = "id",
//     rowsPerPageOptions = [10, 25, 50],
//     lazy = false,
//     totalRecords,
//     onPageChange,
//     onSortChange,
//     onFilterChange,
// }) => {
//     const [globalFilter, setGlobalFilter] = useState("");
//     const [sortConfig, setSortConfig] = useState({ multiSortMeta: [] });
//     const [first, setFirst] = useState(0);
//     const [rows, setRows] = useState(10);

//     const debouncedGlobalFilter = useCallback(
//         debounce((value) => {
//             setGlobalFilter(value);
//             onFilterChange?.({ global: value });
//         }, 400),
//         [onFilterChange]
//     );

//     const filteredData = useMemo(() => {
//         if (lazy || !globalFilter) return data;
//         const term = globalFilter.toLowerCase();
//         return data.filter((row) =>
//             Object.values(row).some((val) =>
//                 val?.toString().toLowerCase().includes(term)
//             )
//         );
//     }, [data, globalFilter, lazy]);

//     const displayData = lazy ? data : filteredData.slice(first, first + rows);
//     const total = lazy ? (totalRecords || 0) : filteredData.length;

//     // ✅ Only show skeleton rows when loading AND no data yet
//     console.log("loading", loading, data.length );
//     const isSkeletonMode = loading && data.length === 0;
//     console.log("isSkeletonMode", isSkeletonMode);
//     console.log("key", dataKey);

//     const exportToExcel = () => {
//         const worksheet = XLSX.utils.json_to_sheet(filteredData);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
//         const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//         saveAs(new Blob([excelBuffer]), `Export_${new Date().getTime()}.xlsx`);
//     };

//     const getSortIcon = (field) => {
//         const activeSort = sortConfig.multiSortMeta?.find((s) => s.field === field);
//         if (!activeSort) return <ArrowUp size={14} className="ml-1 opacity-30" />;
//         return activeSort.order === 1
//             ? <ArrowUp size={14} className="ml-1 text-cyan-400" />
//             : <ArrowDown size={14} className="ml-1 text-cyan-400" />;
//     };

//     // 🏷️ Badge renderer
//     const renderBadge = (value, colIndex, col) => {
//         const colorKey = col.badgeColor || BADGE_COLOR_KEYS[colIndex % BADGE_COLOR_KEYS.length];
//         const style = BADGE_STYLES[colorKey] || BADGE_STYLES.cyan;
//         return (
//             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
//                 {value ?? "-"}
//             </span>
//         );
//     };

//     return (
//         <div className={`glass-container p-2 rounded-[1.5rem] bg-black/10 text-white border border-white/20 shadow-2xl ${className}`}>

//             {/* Header */}
//             <div className="flex flex-wrap items-center justify-between p-5 gap-4">
//                 <div className="flex items-center gap-3">
//                     <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
//                         <Layers className="text-text-cyan-400" size={20} />
//                     </div>
//                     <div>
//                         <h2 className="text-lg font-semibold text-white tracking-tight">{title}</h2>
//                         <div className="flex items-center gap-1.5 leading-none">
//                             <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
//                             <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Live System</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-3 flex-1 justify-end max-w-xl">
//                     <div className="relative w-full max-w-xs group">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-cyan-400 group-focus-within:text-cyan-400 transition-colors" size={18} />
//                         <input
//                             type="text"
//                             onChange={(e) => debouncedGlobalFilter(e.target.value)}
//                             placeholder="Search records..."
//                             className="w-full bg-white/10 border border-white/20 text-white pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-cyan-500/50 transition-all text-sm"
//                         />
//                     </div>
//                     <button
//                         onClick={exportToExcel}
//                         className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-text-cyan-400 text-text-cyan-400 px-4 py-2.5 rounded-xl transition-all active:scale-95 whitespace-nowrap"
//                     >
//                         <Download size={16} />
//                         <span className="text-sm font-medium">Export</span>
//                     </button>
//                 </div>
//             </div>

//             {/* Table */}
//             <div className="mx-2 overflow-hidden rounded-xl border border-white/10 bg-black/20 whitespace-nowrap">
//                 <DataTable
//                     value={isSkeletonMode ? Array.from({ length: rows }, (_, i) => ({
//                         _id: `skeleton-${i}` // 🔥 unique id
//                     })) : displayData}
//                     dataKey={dataKey}
//                     className="custom-table"
//                     sortMode="multiple"
//                     multiSortMeta={sortConfig.multiSortMeta}
//                     onSort={(e) => setSortConfig(e)}
//                     responsiveLayout="scroll"
//                     emptyMessage={
//                         !loading && (
//                             <div className="text-center text-gray-400 py-6">
//                                 <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
//                                     <Search size={16} />
//                                 </div>
//                                 <p className="text-sm">No records found</p>
//                             </div>
//                         )
//                     }
//                 >
//                     {columns.map((col, colIndex) => {
//                         const textColor = col.color
//                             ? `text-${col.color}-400`
//                             : COLUMN_COLORS[colIndex % COLUMN_COLORS.length];

//                         return (
//                             <Column
//                                 key={colIndex}
//                                 field={col.key}
//                                 sortable={col.sortable !== false}
//                                 header={
//                                     <div className="flex items-center group cursor-pointer w-full py-1">
//                                         <span className="text-xs font-bold uppercase tracking-wider text-slate-300 group-hover:text-slate-200 transition-colors">
//                                             {col.label}
//                                         </span>
//                                         {col.sortable !== false && getSortIcon(col.key)}
//                                     </div>
//                                 }
//                                 body={(rowData, options) => {
//                                     if (isSkeletonMode) {
//                                         return <Skeleton width="70%" height="1rem" className="!bg-white/5" />;
//                                     }

//                                     // 🔥 INDEX FIRST
//                                     if (col.isIndex) {
//                                         return (
//                                             <div className="text-sm text-slate-400 font-medium">
//                                                 {first + options.rowIndex + 1}
//                                             </div>
//                                         );
//                                     }

//                                     // ✅ SINGLE value declaration
//                                     const value = col.render
//                                         ? col.render(rowData[col.key], rowData, options.rowIndex)
//                                         : rowData[col.key];

//                                     // 🏷️ Badge
//                                     if (col.isBadge) {
//                                         return (
//                                             <div className="py-1">
//                                                 {renderBadge(value, colIndex, col)}
//                                             </div>
//                                         );
//                                     }

//                                     // 🟢 Default text
//                                     return (
//                                         <div className={`text-sm font-medium py-1 ${textColor}`}>
//                                             {value ?? "-"}
//                                         </div>
//                                     );
//                                 }}
//                             />
//                         );
//                     })}
//                 </DataTable>
//             </div>

//             {/* Paginator */}
//             <div className="p-4 mt-2">
//                 <Paginator
//                     first={first}
//                     rows={rows}
//                     totalRecords={total}
//                     rowsPerPageOptions={rowsPerPageOptions}
//                     onPageChange={(e) => {
//                         setFirst(e.first);
//                         setRows(e.rows);
//                         onPageChange?.(e);
//                     }}
//                     template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
//                     className="custom-paginator"
//                 />
//             </div>

//             <style>{`
//         .p-sortable-column-icon { display: none !important; }

//         .custom-table .p-datatable-thead > tr > th {
//           background: rgba(255,255,255,0.05) !important;
//           border-bottom: 1px solid rgba(255,255,255,0.07) !important;
//           padding: 0.85rem 1rem !important;
//         }
//         .custom-table .p-datatable-tbody > tr {
//           background: transparent !important;
//           transition: background 0.2s;
//         }
//         .custom-table .p-datatable-tbody > tr:hover {
//           background: rgba(255,255,255,0.03) !important;
//         }
//         .custom-table .p-datatable-tbody > tr > td {
//           border-bottom: 1px solid rgba(255,255,255,0.03) !important;
//           padding: 0.75rem 1rem !important;
//         }
//         .custom-paginator {
//           background: transparent !important;
//           border: none !important;
//           padding: 0 !important;
//           display: flex !important;
//           align-items: center !important;
//           justify-content: center !important;
//           gap: 8px;
//         }
//         .custom-paginator .p-paginator-page,
//         .custom-paginator .p-link {
//           background: rgba(255,255,255,0.03) !important;
//           color: #94a3b8 !important;
//           border-radius: 10px !important;
//           min-width: 2.2rem !important;
//           height: 2.2rem !important;
//           border: 1px solid rgba(255,255,255,0.05) !important;
//           transition: 0.3s;
//         }
//         .custom-paginator .p-paginator-page.p-highlight {
//           background: rgba(6,182,212,0.2) !important;
//           color: #22d3ee !important;
//           border-color: rgba(34,211,238,0.3) !important;
//         }
//         .p-dropdown {
//           background: rgba(255,255,255,0.05) !important;
//           border: 1px solid rgba(255,255,255,0.1) !important;
//           border-radius: 10px !important;
//           padding: 2px 5px !important;
//         }
//         .p-dropdown-label { color: white !important; font-size: 13px !important; }
//         .p-dropdown-trigger { color: #94a3b8 !important; }
//       `}</style>
//         </div>
//     );
// };

// export default DynamicTable;
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Skeleton } from "primereact/skeleton";
import { ArrowDown, ArrowUp, Download, Layers, Search } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { debounce } from "lodash";

const COLUMN_COLORS = [
  "text-slate-700",
  "text-indigo-600",
  "text-purple-600",
  "text-emerald-600",
  "text-amber-600",
  "text-rose-600",
  "text-sky-600",
  "text-pink-600",
];

const BADGE_STYLES = {
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  sky: "border-sky-200 bg-sky-50 text-sky-700",
  pink: "border-pink-200 bg-pink-50 text-pink-700",
  lime: "border-lime-200 bg-lime-50 text-lime-700",
};

const BADGE_COLOR_KEYS = Object.keys(BADGE_STYLES);

const DynamicTable = ({
  title = "Data Table",
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
  const [sortConfig, setSortConfig] = useState({
    multiSortMeta: [],
  });
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const debouncedGlobalFilter = useMemo(
    () =>
      debounce((value) => {
        setGlobalFilter(value);
        onFilterChange?.({ global: value });
      }, 400),
    [onFilterChange],
  );

  useEffect(() => {
    return () => {
      debouncedGlobalFilter.cancel();
    };
  }, [debouncedGlobalFilter]);

  const filteredData = useMemo(() => {
    if (lazy || !globalFilter.trim()) {
      return data;
    }

    const searchTerm = globalFilter.toLowerCase().trim();

    return data.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm),
      ),
    );
  }, [data, globalFilter, lazy]);

  const displayData = lazy ? data : filteredData.slice(first, first + rows);

  const total = lazy ? totalRecords || 0 : filteredData.length;

  const isSkeletonMode = loading && data.length === 0;

  const exportToExcel = () => {
    const exportData = filteredData.map((row) => {
      const formattedRow = {};

      columns.forEach((column) => {
        if (column.isIndex) return;

        const value = column.render
          ? column.render(row[column.key], row)
          : row[column.key];

        formattedRow[column.label] = value ?? "-";
      });

      return formattedRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([excelBuffer], {
        type: "application/octet-stream",
      }),
      `Export_${Date.now()}.xlsx`,
    );
  };

  const getSortIcon = (field) => {
    const activeSort = sortConfig.multiSortMeta?.find(
      (sort) => sort.field === field,
    );

    if (!activeSort) {
      return <ArrowUp size={13} className="ml-1 text-slate-300 opacity-70" />;
    }

    return activeSort.order === 1 ? (
      <ArrowUp size={13} className="ml-1 text-indigo-600" />
    ) : (
      <ArrowDown size={13} className="ml-1 text-indigo-600" />
    );
  };

  const renderBadge = (value, columnIndex, column) => {
    const colorKey =
      column.badgeColor ||
      BADGE_COLOR_KEYS[columnIndex % BADGE_COLOR_KEYS.length];

    const style = BADGE_STYLES[colorKey] || BADGE_STYLES.cyan;

    return (
      <span
        className={`
          inline-flex items-center rounded-full border
          px-2.5 py-1 text-xs font-semibold
          ${style}
        `}
      >
        {value ?? "-"}
      </span>
    );
  };

  return (
    <div
      className={`
        overflow-hidden rounded-2xl border border-slate-100
        bg-white text-slate-700 shadow-sm
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-2.5">
            <Layers className="text-indigo-600" size={20} />
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-800">
              {title}
            </h2>

            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#22c55e]" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Live System
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-1 items-center justify-end gap-3 sm:max-w-xl">
          {/* Search */}
          <div className="group relative w-full max-w-xs">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
              size={17}
            />

            <input
              type="text"
              onChange={(event) => debouncedGlobalFilter(event.target.value)}
              placeholder="Search records..."
              className="
                w-full rounded-xl border border-slate-200
                bg-slate-50 py-2.5 pl-10 pr-4 text-sm
                text-slate-700 outline-none transition-all
                placeholder:text-slate-400
                focus:border-indigo-300 focus:bg-white
                focus:ring-4 focus:ring-indigo-50
              "
            />
          </div>

          {/* Export */}
          <button
            type="button"
            onClick={exportToExcel}
            className="
              flex items-center gap-2 whitespace-nowrap
              rounded-xl border border-indigo-200
              bg-indigo-50 px-4 py-2.5
              text-indigo-600 transition-all
              hover:bg-indigo-100 active:scale-95
            "
          >
            <Download size={16} />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mx-3 overflow-hidden rounded-xl border border-slate-100">
        <DataTable
          value={
            isSkeletonMode
              ? Array.from({ length: rows }, (_, index) => ({
                  _id: `skeleton-${index}`,
                }))
              : displayData
          }
          dataKey={dataKey}
          className="custom-table"
          sortMode="multiple"
          multiSortMeta={sortConfig.multiSortMeta}
          onSort={(event) => {
            setSortConfig(event);
            onSortChange?.(event);
          }}
          responsiveLayout="scroll"
          emptyMessage={
            !loading && (
              <div className="py-10 text-center text-slate-400">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
                  <Search size={16} />
                </div>

                <p className="text-sm">No records found</p>
              </div>
            )
          }
        >
          {columns.map((column, columnIndex) => {
            const textColor = column.color
              ? `text-${column.color}-600`
              : COLUMN_COLORS[columnIndex % COLUMN_COLORS.length];

            return (
              <Column
                key={column.key || columnIndex}
                field={column.key}
                sortable={column.sortable !== false}
                header={
                  <div className="group flex w-full cursor-pointer items-center py-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors group-hover:text-indigo-600">
                      {column.label}
                    </span>

                    {column.sortable !== false && getSortIcon(column.key)}
                  </div>
                }
                body={(rowData, options) => {
                  if (isSkeletonMode) {
                    return (
                      <Skeleton
                        width="70%"
                        height="1rem"
                        className="!bg-slate-100"
                      />
                    );
                  }

                  if (column.isIndex) {
                    return (
                      <div className="text-sm font-medium text-slate-400">
                        {first + options.rowIndex + 1}
                      </div>
                    );
                  }

                  const value = column.render
                    ? column.render(
                        rowData[column.key],
                        rowData,
                        options.rowIndex,
                      )
                    : rowData[column.key];

                  if (column.isBadge) {
                    return (
                      <div className="py-1">
                        {renderBadge(value, columnIndex, column)}
                      </div>
                    );
                  }

                  return (
                    <div
                      className={`
                        break-words py-1 text-sm font-medium
                        ${textColor}
                      `}
                    >
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
      <div className="mt-2 p-4">
        <Paginator
          first={first}
          rows={rows}
          totalRecords={total}
          rowsPerPageOptions={rowsPerPageOptions}
          onPageChange={(event) => {
            setFirst(event.first);
            setRows(event.rows);
            onPageChange?.(event);
          }}
          template="
            FirstPageLink
            PrevPageLink
            PageLinks
            NextPageLink
            LastPageLink
            RowsPerPageDropdown
          "
          className="custom-paginator"
        />
      </div>

      <style>{`
        .custom-table .p-datatable-thead > tr > th {
          background: #f8fafc !important;
          border-bottom: 1px solid #e2e8f0 !important;
          color: #475569 !important;
          padding: 0.9rem 1rem !important;
        }

        .custom-table .p-datatable-tbody > tr {
          background: #ffffff !important;
          transition: background-color 0.2s ease;
        }

        .custom-table .p-datatable-tbody > tr:hover {
          background: #f8fafc !important;
        }

        .custom-table .p-datatable-tbody > tr > td {
          border-bottom: 1px solid #f1f5f9 !important;
          padding: 0.85rem 1rem !important;
          color: #475569 !important;
        }

        .custom-table .p-datatable-tbody > tr:last-child > td {
          border-bottom: none !important;
        }

        .custom-paginator {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-wrap: wrap;
          gap: 8px;
        }

        .custom-paginator .p-paginator-page,
        .custom-paginator .p-link {
          background: #ffffff !important;
          color: #64748b !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 10px !important;
          min-width: 2.2rem !important;
          height: 2.2rem !important;
          transition: all 0.2s ease;
        }

        .custom-paginator .p-paginator-page:hover,
        .custom-paginator .p-link:hover {
          background: #eef2ff !important;
          border-color: #c7d2fe !important;
          color: #4f46e5 !important;
        }

        .custom-paginator .p-paginator-page.p-highlight {
          background: linear-gradient(
            135deg,
            #4f46e5,
            #9333ea
          ) !important;
          border-color: transparent !important;
          color: #ffffff !important;
        }

        .p-dropdown {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 10px !important;
          padding: 2px 5px !important;
        }

        .p-dropdown:hover {
          border-color: #c7d2fe !important;
        }

        .p-dropdown-label {
          color: #475569 !important;
          font-size: 13px !important;
        }

        .p-dropdown-trigger {
          color: #64748b !important;
        }

        .p-sortable-column-icon {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default DynamicTable;
