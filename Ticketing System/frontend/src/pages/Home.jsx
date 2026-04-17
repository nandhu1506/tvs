import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CommonLayout from "../components/CommonLayout";
import { IconClose, IconSearch } from "../components/Icons";
import { getAllTicketsAPI } from "../../services/allAPI";


export default function Home() {

  const [loading, setLoading] = useState(true);
  const [statusList, setStatusList] = useState([]);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [searchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [projects, setProjects] = useState([]);
  const statusFilter = searchParams.get("status") || "";
  const projectFilter = searchParams.get("project") || "";
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const StatusPill = ({ status }) => {
    const colors = {
      Assigned: "bg-amber-100 text-amber-700 border-amber-200",
      Cancelled: "bg-red-100 text-red-700 border-red-200",
      Closed: "bg-green-100 text-green-700 border-green-200",
      "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
      "Need Clarification": "bg-red-100 text-red-700 border-red-200"
    };
    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colors[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
        {status}
      </span>
    );
  };

  const handleResetFilters = () => {
    navigate("?page=1");
  };

  const handleParams = (page) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);
    return `?${params.toString()}`;
  };

  const handleUpdateFilters = ({ status, project, page = 1 }) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", page);

    if (status !== undefined) {
      status ? params.set("status", status) : params.delete("status");
    }

    if (project !== undefined) {
      project ? params.set("project", project) : params.delete("project");
    }

    navigate(`?${params.toString()}`);
  };

  const TableHeaders = [
    "Project",
    "Call Ref No / Ticket No",
    "Call Date",
    "Call Raised Person",
    "Subject",
    "Assigned To",
    "Status",
    "Actions",
  ];

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await getAllTicketsAPI({
        page: currentPage,
        limit: 10,
        status: statusFilter,
        project: projectFilter,
      });

      if (res.status !== 200) return;
      const responseData = res.data;
      if (!responseData || !responseData.data) {
        console.error("Invalid API response:", responseData);
        return;
      }
      const formatted = responseData.data.map((t) => {
        const dateObj = new Date(t.created_at);
        return {
          id: t.id,
          project: t.project,
          subject: t.subject,
          status: t.status,
          callRaisedPerson: t.outlet,
          assignedTo: t.assigned_to,
          callDate: dateObj.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          callTime: dateObj.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      });
      setTickets(formatted);
      setTotalPages(responseData.totalPages);
      setStatusList(responseData.filters?.status || []);
      setProjects(responseData.filters?.projects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [currentPage, statusFilter, projectFilter]);

  useEffect(() => {
    if (!searchParams.get("page")) {
      navigate("?page=1", { replace: true });
    }
  }, []);


  return (
    <CommonLayout>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-4">
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-slate-100">
          <Link
            to={"/addRequest"}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold px-5 py-2 rounded-lg shadow-sm transition-all"
          >
            + ADD
          </Link>
          <select
            value={statusFilter}
            onChange={(e) => handleUpdateFilters({ status: e.target.value })}
            className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg pl-4 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
          >
            <option value="">-- Select Status --</option>
            {statusList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={projectFilter}
            onChange={(e) => handleUpdateFilters({ project: e.target.value })}
            className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg pl-4 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
          >
            <option value="">-- Select Project --</option>
            {projects.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <button
            onClick={handleResetFilters}
            className="bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-300">
            Reset
          </button>
        </div>
      </div>


      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center border-collapse">
          <thead>
            <tr className="bg-blue-600">
              {TableHeaders.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white whitespace-nowrap first:rounded-none"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={8} className="px-4 py-6">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </td>
                </tr>
              ))
            ) :
              tickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    No records match the selected filters.
                  </td>
                </tr>
              ) : (
                tickets.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-b border-slate-100 hover:bg-blue-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">
                        {row.project}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-800 font-semibold hover:underline underline-offset-2"
                      >
                        {row.id}
                      </a>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-700">{row.callDate}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{row.callTime}</div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-medium text-slate-700">
                      {row.callRaisedPerson}
                    </td>
                    <td className="px-4 py-3.5 max-w-xs text-slate-600 leading-relaxed">{row.subject}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {row.assignedTo ? (
                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-md">
                          {row.assignedTo}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusPill status={row.status} />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => navigate(`/viewticket/${row.id}`)}
                          className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-90 text-white flex items-center justify-center shadow-sm transition-all"
                        >
                          <IconSearch />
                        </button>
                        {row.status === "Open" && (
                          <button className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 active:scale-90 text-white flex items-center justify-center shadow-sm transition-all">
                            <IconClose />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-2">
          <button
            onClick={() => navigate(handleParams(Math.max(currentPage - 1, 1)))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>

          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-2 py-1 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => navigate(handleParams(page))}
                className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => navigate(handleParams(Math.min(currentPage + 1, totalPages)))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </CommonLayout>
  );
}