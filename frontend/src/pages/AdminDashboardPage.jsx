import React from 'react'
import AdminHeader from "../components/layouts/AdminHeader.jsx";
import AdminSideBar from "../components/Admon/Layout/AdminSideBar.jsx";
import AdminDashboardMain from "../components/Admon/AdminDashboardMain.jsx";
const AdminDashboardPage = () => {
  return (
    <div>
      <AdminHeader/>
      <div className="w-full flex">
        <div className="w-[30%]">
          <AdminSideBar active={1}/>
        </div>
        <div className="w-[70%]">
          <AdminDashboardMain/>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage