import React from 'react'
import AdminHeader from "../components/layouts/AdminHeader.jsx";
import AdminSideBar from "../components/Admon/Layout/AdminSideBar.jsx";
import AllUsers from "../components/Admon/AllUsers.jsx";
const AdminDashboardUserPage = () => {
  return (
    <div>
    <AdminHeader/>
    <div className="w-full flex">
      <div className="w-[30%]">
        <AdminSideBar active={4}/>
      </div>
      <div className="w-[70%]">
        <AllUsers/>
      </div>
    </div>
  </div>
  )
}

export default AdminDashboardUserPage