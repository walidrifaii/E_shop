import React from 'react'
import AdminHeader from "../components/layouts/AdminHeader.jsx";
import AdminSideBar from "../components/Admon/Layout/AdminSideBar.jsx";
import AllEvents from "../components/Admon/AllEvents.jsx";
const AdminDashboardEventsPage = () => {
  return (
    <div>
    <AdminHeader/>
    <div className="w-full flex">
      <div className="w-[30%]">
        <AdminSideBar active={6}/>
      </div>
      <div className="w-[70%]">
        <AllEvents/>
      </div>
    </div>
  </div>
  )
}

export default AdminDashboardEventsPage