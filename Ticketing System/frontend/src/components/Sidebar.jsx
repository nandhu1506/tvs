import { RiFileExcel2Fill, RiUserAddLine } from "react-icons/ri";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { MdNoteAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AddUserModal from "./AddUserModal";
import { useState } from "react";
import { ToastSuccess } from "./toastify";


export default function Sidebar({ isOpen }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);


  return (
    <div
      className={`flex flex-col pt-4 gap-3 shadow-sm border-r border-slate-200 flex-shrink-0
        bg-white transition-all duration-300
        ${isOpen ? "w-48" : "w-12"}`}
    >

      <div className="flex flex-col gap-3">
        <button onClick={() => { navigate('/addRequest') }} className="flex items-center gap-3 w-full px-2 py-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
          <MdNoteAdd size={25} />
          {isOpen && <span className="text-slate-700 font-medium">Add Request</span>}
        </button>

        <button onClick={() => { navigate('/home') }} className="flex items-center gap-3 w-full px-2 py-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
          <HiClipboardDocumentList size={25} />
          {isOpen && <span className="text-slate-700 font-medium">Ticket Lists</span>}
        </button>

        <button onClick={() => { navigate('/export') }} className="flex items-center gap-3 w-full px-2 py-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">

          <RiFileExcel2Fill size={25} color="green" />

          {isOpen && <span className="text-slate-700 font-medium">Export</span>}
        </button>
      {
        JSON.parse(sessionStorage.getItem("user"))?.role === "admin" && (
          <button onClick={() => setOpen(true)} className="flex items-center gap-3 w-full px-2 py-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <RiUserAddLine size={25} color="blue" />
            {isOpen && <span className="text-slate-700 font-medium">Add User</span>}
          </button>
        )
      }  
      <AddUserModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onUserAdded={() => {
          ToastSuccess("User added successfully!");
        }}
      />      
      </div>
    </div>
  );
}