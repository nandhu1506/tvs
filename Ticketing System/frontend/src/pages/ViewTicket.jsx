import { useEffect, useState } from "react";
import CommonLayout from "../components/CommonLayout";
import { useParams } from "react-router-dom";
import { getTicketAPI, getUsersAPI, sendReplyAPI, updateTicketAPI } from "../../services/allAPI";
import { serverURL } from "../../config";




export default function ViewTicket() {
  const [attachments, setAttachments] = useState([]);
  const [users, setUsers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [replyText, setReplyText] = useState();
  const [currentStatus, setCurrentStatus] = useState(ticket?.status || "");
  const [closedBy, setClosedBy] = useState(ticket?.closed_by || "");
  const { id } = useParams();

  const StatusPill = ({ status }) => {
    const colors = {
      Assigned: "bg-amber-100 text-amber-700 border-amber-200",
      Cancelled: "bg-red-100 text-red-700 border-red-200",
      Closed: "bg-green-100 text-red-green border-green-200",
      "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
      "Need Clarification": "bg-red-100 text-red-700 border-red-200"
    };
    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colors[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
        {status}
      </span>
    );
  };

  const PriorityPill = ({ priority }) => {
    const colors = {
      Medium: "bg-orange-100 text-orange-700",
      Highest:"bg-red-400 text-red-700",
      High: "bg-red-300 text-red-700",
      Low: "bg-green-100 text-green-700",
      Critical: "bg-red-800 text-red-300",
    };
    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors[priority] || "bg-gray-100 text-gray-600"}`}>
        {priority}
      </span>
    );
  }

  const status = ["Assigned", "In Progress", "Closed", "Need Clarification", "Cancelled"]

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  const formatDateTime = (date) => {
    const d = new Date(date);

    return {
      date: d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      time: d.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  };

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await getTicketAPI(id);

        if (res.status !== 200) {
          throw new Error(res.data?.message || "Error fetching ticket");
        }

        setTicket(res.data);
      } catch (err) {
        console.error("Error fetching ticket:", err);
      }
    };

    fetchTicket();
  }, [id]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsersAPI();
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (ticket) {
      setCurrentStatus(ticket.status || "");
      setClosedBy(ticket.closed_by || "");
    }
  }, [ticket]);


  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);

    try {
      const payload = { status: newStatus };
      if (newStatus === "Closed") {
        payload.closed_at = new Date().toISOString();
      } else {
        payload.closed_at = null;
      }
      await updateTicketAPI(ticket.id, payload);
      setTicket((prev) => ({
        ...prev,
        status: newStatus,
        closed_at: payload.closed_at,
      }));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleClosedByChange = async (e) => {
    const user = e.target.value;
    setClosedBy(user);

    try {
      await updateTicketAPI(ticket.id, { closed_by: user });

      setTicket((prev) => ({
        ...prev,
        closed_by: user,
      }));
    } catch (err) {
      console.error("Error updating Closed By:", err);
    }
  };


  const handleSendReply = async () => {
    if (!replyText.trim()) {
      ToastWarning("Reply cannot be empty");
      return;
    }

    if (sending) return;
    setSending(true);
    try {
      const formData = new FormData();

      formData.append("message", replyText);
      formData.append("ticketId", ticket.id);
      formData.append("subject", ticket.subject);

      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      await sendReplyAPI(formData);

    } catch (err) {
      console.error(err);
      ToastError("Failed to send reply");
    } finally {
      setSending(false)
    }
  };


  const formatted = ticket?.date ? formatDateTime(ticket.date) : null;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-sm">
      <CommonLayout>
        <div className="flex min-h-[calc(100vh-56px)]">
          <main className="flex-1 p-6 overflow-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" className="w-5 h-5">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h1 className="text-base font-bold text-slate-800">
                  {ticket?.subject}
                  <span className="text-blue-600">Ticket No:# {ticket?.id}</span>
                </h1>
              </div>

            </div>
            <div className="grid grid-cols-12 gap-5">

              <div className="col-span-4">
                <div className="bg-white min-h-[600px] rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
                    <h2 className="font-bold text-slate-700 text-sm tracking-wide">Call Information</h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {[
                      { label: "Call No", value: ticket?.id, highlight: true },
                      { label: "Call Date", value: formatted ? `${formatted.date}, ${formatted.time}` : "-" },
                      { label: "Raised By", value: ticket?.outlet },
                      { label: "Contact Person", value: ticket?.customer_name },
                      { label: "Contact No", value: ticket?.contact_number },
                      { label: "Alternate Contact No", value: ticket?.alternate_contact },
                      { label: "Alternate Contact Person", value: ticket?.alternate_customer_name },
                    ].map(({ label, value, highlight }) => (
                      <div key={label} className="px-5 py-3 flex flex-col gap-0.5">
                        <span className="text-xs text-slate-400 font-medium">{label}:</span>
                        <span className={`text-sm font-semibold ${highlight ? "text-blue-600" : "text-slate-700"}`}>{value}</span>
                      </div>
                    ))}
                    <div className="px-5 py-3 flex flex-col gap-0.5">
                      <span className="text-xs text-slate-400 font-medium">Call Status:</span>
                      <StatusPill status={ticket?.status} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-4">
                <div className="bg-white min-h-[600px] rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
                    <h2 className="font-bold text-slate-700 text-sm tracking-wide">Other Information</h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    <div className="px-5 py-3 flex flex-col gap-0.5">
                      <span className="text-xs text-slate-400 font-medium">Source:</span>
                      <span className="text-sm font-semibold text-slate-700">{ticket?.source}</span>
                    </div>
                    <div className="px-5 py-3 flex flex-col gap-0.5">
                      <span className="text-xs text-slate-400 font-medium">Priority:</span>
                      <PriorityPill priority={ticket?.priority} />
                    </div>
                    <div className="px-5 py-3 flex flex-col gap-0.5">
                      <span className="text-xs text-slate-400 font-medium">Category:</span>
                      <span className="text-sm font-semibold text-slate-700">{ticket?.category}</span>
                    </div>
                    <div className="px-5 py-3 flex flex-col gap-0.5">
                      <span className="text-xs text-slate-400 font-medium">Assigned To:</span>
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-md">{ticket?.assigned_to ? ticket.assigned_to : "Not Assigned"}</span>
                        {ticket?.assignedTo ? `at ${ticket.assignedAt}` : ""}
                      </div>
                    </div>

                    <div className="px-5 py-3 flex flex-col gap-1.5">
                      <span className="text-xs text-slate-400 font-medium">Issue Message:</span>
                      <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-lg p-3 border border-slate-100 max-h-72 overflow-auto">
                        {ticket?.issue_message}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-4 flex flex-col gap-5">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
                    <h2 className="font-bold text-slate-700 text-sm tracking-wide">Reply</h2>
                  </div>


                  <textarea
                    className="flex-1 p-4 text-xs text-slate-700 leading-relaxed resize-none focus:outline-none min-h-[280px]"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />



                  <div className="px-4 py-3 border-t border-slate-100 flex justify-end">
                    {submitted ? (
                      <span className="text-xs text-green-600 font-semibold">✓ Message sent successfully</span>
                    ) : (
                      <button onClick={handleSendReply} disabled={sending} className={`text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow-sm transition-colors ${sending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}>
                        {sending ? "Sending..." : "Send Reply"}
                      </button>
                    )}
                  </div>
                </div>


                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
                    <h2 className="font-bold text-slate-700 text-sm tracking-wide">Attachments</h2>
                  </div>
                  <div className="p-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded shadow-sm transition-colors">
                        Choose files
                      </span>
                      <span className="text-xs text-slate-400">
                        {attachments.length === 0 ? "No file chosen" : `${attachments.length} file(s) chosen`}
                      </span>
                      <input type="file" multiple className="hidden" onChange={handleFileChange} />
                    </label>
                    {attachments.length > 0 && (
                      <div className="mt-3 flex flex-col gap-1.5">
                        {attachments.map((f, i) => (
                          <div key={i} className="flex items-center justify-between text-xs bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                            <span className="text-slate-600 truncate max-w-[160px]">{f.name}</span>
                            <button onClick={() => setAttachments((a) => a.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 ml-2">✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>


                <select
                  value={currentStatus}
                  onChange={handleStatusChange}
                  className="w-full rounded-xl appearance-none px-4 py-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                >
                  {status.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>


                <select
                  value={closedBy}
                  onChange={handleClosedByChange}
                  disabled={currentStatus !== "Closed"}
                  className={`w-full rounded-xl appearance-none px-4 py-3 text-sm ${currentStatus === "Closed" ? "text-slate-700" : "text-slate-400"
                    } bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer`}
                >
                  <option value="">Closed by</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.username}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
            </div>


            <div className="mt-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-700">Correspondence</h2>
                </div>

                <div className="p-6">
                  <div className="border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
                    <div className="flex">


                      <div className="w-44 shrink-0 bg-slate-50 border-r border-slate-200 px-5 py-5 flex flex-col gap-1">
                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-md self-start mb-1">
                          {ticket?.assigned_to || "Not Assigned"}
                        </span>

                        <span className="text-xs font-semibold text-slate-700">
                          {formatted?.date || "-"}
                        </span>

                        <span className="text-xs text-slate-400">
                          {formatted?.time || "-"}
                        </span>

                        <span className="mt-2">
                          <StatusPill status={ticket?.status} />
                        </span>
                      </div>


                      <div className="flex-1 px-8 py-6 flex flex-col gap-4">


                        <h3 className="text-xl font-bold text-slate-700">
                          {ticket?.subject}
                        </h3>


                        <div className="text-sm text-slate-600 bg-slate-50 border rounded-lg p-4 whitespace-pre-wrap">
                          {ticket?.issue_message}
                        </div>
                        

                        {ticket?.attachments?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-slate-500 mb-2">
                              Attachments:
                            </p>
                            <div className="flex gap-3 flex-wrap">
                              {ticket.attachments.map((file) => (
                                <a
                                  key={file.id}
                                  href={`${serverURL}${file.file_path}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <img
                                    src={`${serverURL}${file.file_path}`}
                                    alt={file.file_name}
                                    className="w-24 h-24 object-cover rounded border hover:scale-105 transition"
                                  />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </main>
        </div>
      </CommonLayout>
    </div>
  );
}