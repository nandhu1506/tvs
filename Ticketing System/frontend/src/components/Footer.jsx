import React from 'react'

export default function Footer() {
  return (
    <div className="mt-6 py-4 text-center text-xs text-slate-400 border-t border-slate-200">
      Copyright &copy; {new Date().getFullYear()} {" "}
      <a href="#" className="text-blue-500 hover:underline font-medium">
        TVS Automobile Solutions Private Limited
      </a>
      . All rights reserved.
    </div>
  )
}
