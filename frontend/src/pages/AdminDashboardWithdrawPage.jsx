import React from 'react'
import AdminHeader from "../components/layouts/AdminHeader.jsx";
import AdminSideBar from "../components/Admon/Layout/AdminSideBar.jsx";
import AllWithdraw from "../components/Admon/AllWithdraw.jsx";
const AdminDashboardEventsPage = () => {
  return (
    <div>
    <AdminHeader/>
    <div className="w-full flex">
      <div className="w-[30%]">
        <AdminSideBar active={7}/>
      </div>
      <div className="w-[70%]">
        <AllWithdraw />
      </div>
    </div>
  </div>
  )
}

export default AdminDashboardEventsPage