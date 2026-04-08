import { useEffect, useRef, useState } from "react";
import { IconHome } from "../components/Icons";
import CommonLayout from "../components/CommonLayout";
import { addRequestAPI } from "../../services/allAPI";
import { useNavigate } from "react-router-dom";
import {  ToastError, ToastSuccess, ToastWarning } from "../components/toastify";

export default function AddRequest() {

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    project: "",
    outlet: "",
    customerName: "",
    contactNumber: "",
    emailId: "",
    altContactNo: "",
    altCustomerName: "",
    subject: "",
    source: "",
    priority: "",
    category: "",
    company: "",
    issueMessage: "",
  });
  const [images, setImages] = useState([]);
  const fileInputRef = useRef();

  const today = new Date().toLocaleString();

  const Source = ["Mail", "Application", "Call", "Others"];

  const Priority = ["Critical", "Highest", "High", "Medium", "Low"]

  const Category = ["Bug", "CodeChange", "Change Request", "Service Request", "Incident Request"]

  const Company = ["MYTVS", "COCO", "MFCS", "SMPL", "FOCO", "TVSFCCC", "KI-CV", "Kitara", "Moeving", "Others"]

  const navigate = useNavigate()

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img));
    };
  }, [images]);


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 3) {
      ToastWarning("You can upload maximum 3 images");
      return;
    }

    const validFiles = files.filter(
  (file) =>
    file.type.startsWith("image/") &&
    !images.some((img) => img.name === file.name)
);


    setImages((prev) => [...prev, ...validFiles]);
    e.target.value = null;
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
    fileInputRef.current.value = null;
    }
  };
  
  const handleSubmit = async () => {

    if (!form.project || !form.outlet || !form.customerName || !form.contactNumber || !form.emailId || !form.subject || !form.issueMessage){
        ToastWarning("Please fill all required fields");
        return;
      }
      
      if (!/^\d{10}$/.test(form.contactNumber)) {
    ToastWarning("Enter valid 10-digit contact number");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailId)) {
    ToastWarning("Enter valid email address");
    return;
  }
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    images.forEach((img) => { 
      formData.append("attachments", img);
    });

    try {
      
      setLoading(true);

      const res = await addRequestAPI(formData);

      if (res.status === 201) {
        ToastSuccess("Ticket created successfully");
        console.log(res.data);
        setForm({
          project: "",
          outlet: "",
          customerName: "",
          contactNumber: "",
          emailId: "",
          altContactNo: "",
          altCustomerName: "",
          subject: "",
          source: "",
          priority: "",
          category: "",
          company: "",
          issueMessage: "",
        });

        setImages([]);
        navigate('/home')
      } else {
        ToastError(res.data.message || "Failed to create ticket");
      }
    } catch (err) {
      console.error(err);
      ToastError(err?.response?.data?.message || "Something went wrong");
    }finally{
      setLoading(false)
    }
  };

  


  return (
    <div className="min-h-screen bg-slate-100 text-sm flex flex-col">
      <CommonLayout>
        <div className="flex flex-1">
          <main className="flex-1 p-8 overflow-auto">
            <div className="flex justify-between mb-6">
              <h1 className="text-xl font-bold">Request to Fix Issue</h1>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <IconHome />
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border shadow-sm">

              <div className="grid grid-cols-12 gap-6 mb-6">

                {/* DATE */}
                <div className="col-span-3">
                  <p className="text-xs mb-1">Today date :</p>
                  <input
                    value={today}
                    readOnly
                    className="w-full border-b py-1 text-sm bg-transparent"
                  />
                </div>

                {/* Project, Outlet */}
                <div className="col-span-3 flex gap-3">
                  <select
                    value={form.project}
                    onChange={(e) =>
                      setForm({ ...form, project: e.target.value })
                    }
                    className="w-full border-b py-1 text-sm"
                  >
                    <option value="">Select Project </option>
                    <option >Project 1</option>
                    <option >Project 2</option>
                    <option >Project 3</option>
                    <option >Project 4</option>
                  </select>

                  <select
                    value={form.outlet}
                    onChange={(e) =>
                      setForm({ ...form, outlet: e.target.value })
                    }
                    className="w-full border-b py-1 text-sm"
                  >
                    <option value="">Select Outlet</option>
                    <option>Outlet 1</option>
                    <option>Outlet 2</option>
                    <option>Outlet 3</option>
                    <option>Outlet 4</option>
                  </select>
                </div>

                {/* Customer */}
                <div className="col-span-3">
                  <label className="text-xs">Customer Name <span className="text-red-500">*</span></label>
                  <input
                    value={form.customerName}
                    onChange={(e) =>
                      setForm({ ...form, customerName: e.target.value })
                    }
                    className="w-full border-b py-1 text-sm"
                  />
                </div>

                {/* Contact */}
                <div className="col-span-3">
                  <label className="text-xs">Contact Number <span className="text-red-500">*</span></label>
                  <input
                    value={form.contactNumber}
                    onChange={(e) =>
                      setForm({ ...form, contactNumber: e.target.value })
                    }
                    className="w-full border-b py-1 text-sm"
                  />
                </div>
              </div>

            {/* Email */}
              <div className="grid grid-cols-12 gap-6 mb-6">
                <div className="col-span-3">
                  <label>Email <span className="text-red-500">*</span></label>
                  <input
                    value={form.emailId}
                    onChange={(e) =>
                      setForm({ ...form, emailId: e.target.value })
                    }
                    className="w-full border-b py-1"
                  />
                </div>

                <div className="col-span-3">
                  <label>Alt Contact </label>
                  <input
                    value={form.altContactNo}
                    onChange={(e) =>
                      setForm({ ...form, altContactNo: e.target.value })
                    }
                    className="w-full border-b py-1"
                  />
                </div>

                <div className="col-span-3">
                  <label>Alt Name </label>
                  <input
                    value={form.altCustomerName}
                    onChange={(e) =>
                      setForm({ ...form, altCustomerName: e.target.value })
                    }
                    className="w-full border-b py-1"
                  />
                </div>

                <div className="col-span-3">
                  <label>Subject <span className="text-red-500">*</span></label>
                  <input
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    className="w-full border-b py-1"
                  />
                </div>
              </div>

            {/* source,category,company */}
              <div className="grid grid-cols-12 gap-6 mb-6">
                <select className="col-span-3 border-b py-1"
                  value={form.source}
                  onChange={(e) =>
                    setForm({ ...form, source: e.target.value })
                  }>
                  <option value="">Select Source</option>
                  {Source.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <select className="col-span-3 border-b py-1"
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }>
                  <option value="">Select Priority</option>
                  {Priority.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                <select className="col-span-3 border-b py-1"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }>
                  <option value="" >Select Category</option>
                  {Category.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <select className="col-span-3 border-b py-1"
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }>
                  <option value="" >Select Company</option>
                  {Company.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}

                </select>
              </div>

              {/* Text Area */}
              <textarea
                value={form.issueMessage}
                onChange={(e) =>
                  setForm({ ...form, issueMessage: e.target.value })
                }
                className="border p-4 min-h-[150px] w-full"
                placeholder="Describe the issue..."
              />

              <div className="mb-6">
                <label className="text-xs">Add Image Attachments</label>

                <input
                  ref={fileInputRef}
                  type="file"
                  name="attachments"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="block mt-2 text-sm border border-gray-300 rounded-lg p-2 w-full cursor-pointer file:bg-blue-500 file:text-white file:border-0 file:px-3 file:py-1 file:rounded-md"
                />
                {/* PREVIEW */}
                <div className="flex gap-4 mt-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded border"
                      />

                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              
              <div className="flex gap-3">
                <button onClick={handleSubmit} disabled={loading} className={`px-4 py-2 rounded text-white font-semibold ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
                  {loading ? "Submitting..." : "Submit"}
                </button>
                <button
                  onClick={() => {
                    setForm({
                      project: "",
                      outlet: "",
                      customerName: "",
                      contactNumber: "",
                      emailId: "",
                      altContactNo: "",
                      altCustomerName: "",
                      subject: "",
                      source: "",
                      priority: "",
                      category: "",
                      company: "",
                      issueMessage: "",
                    });
                    setImages([]);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = null;
                    }
                  }}
                  className="bg-gray-200 px-6 py-2 rounded"
                >
                  Reset
                </button>
              </div>

            </div>
          </main>
        </div>
      </CommonLayout>
    </div>
  );
}