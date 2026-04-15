import { useEffect, useState } from "react";
import CommonLayout from "../components/CommonLayout";
import { exportTicketsAPI, getProjectsAPI } from "../../services/allAPI";
import { ToastWarning } from "../components/toastify";
import { serverURL } from "../../config";

export default function ExportStatement() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState("");
  const [loading, setLoading] = useState(false);
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    getProjectsAPI()
      .then(res => setProjects(res.data.projects || []))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
  if (toDate && fromDate && toDate < fromDate) {
    setToDate("");
  }
  }, [fromDate]);

  useEffect(() => {
    const fetchMinDate = async () => {
      try {
        const res = await fetch(`${serverURL}/min-date`);
        const data = await res.json();
        const formatted = new Date(data.minDate)
          .toISOString()
          .split("T")[0];

        setMinDate(formatted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMinDate();
  }, []);
 
  const handleDownload = async () => {
  if (!fromDate || !toDate || !project) {
    ToastWarning("All fields required");
    return;
  }

  setLoading(true);

  try {
    const res = await exportTicketsAPI(fromDate, toDate, project);

    const contentType = res.headers["content-type"];

    if (contentType && contentType.includes("application/json")) {
      const data = await res.data;
      ToastWarning(data.message || "No tickets found");
      return;
    }

    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `tickets_${project}_${fromDate}_to_${toDate}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error(err);
    ToastError(err.response?.data?.message || "Download failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <CommonLayout>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-5">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-700">Ticket Statement</h2>
        </div>

        <div className="px-6 py-5 flex flex-wrap items-end gap-6">
          <div className="flex flex-col w-56">
            <label className="text-xs font-semibold text-slate-600 mb-1">
              <span className="text-red-500">*</span> From date :
            </label>
            <input
              type="date"
              min={minDate}
              max={new Date().toISOString().split("T")[0]}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border-b-2 border-slate-200 focus:border-blue-500 outline-none py-1 text-sm"
            />
          </div>

          <div className="flex flex-col w-56">
            <label className="text-xs font-semibold text-slate-600 mb-1">
              <span className="text-red-500">*</span> To date :
            </label>
            <input
              type="date"
              value={toDate}
              min={fromDate || minDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setToDate(e.target.value)}
              className="border-b-2 border-slate-200 focus:border-blue-500 outline-none py-1 text-sm"
            />
          </div>
          <div className="flex flex-col w-56">
            <label className="text-xs font-semibold text-slate-600 mb-1">
              <span className="text-red-500">*</span> Project :
            </label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="border-b-2 border-slate-200 focus:border-blue-500 outline-none py-1 text-sm bg-transparent"
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="ml-auto">
            <button
              onClick={handleDownload}
              disabled={loading}
              className={`text-white text-sm px-5 py-2 rounded-md shadow-sm flex items-center gap-2
    ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}

              {loading ? "Downloading..." : "Download Excel"}
            </button>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}