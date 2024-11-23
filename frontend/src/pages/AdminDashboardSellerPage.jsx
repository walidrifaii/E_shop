import React from 'react'
import AdminHeader from "../components/layouts/AdminHeader.jsx";
import AdminSideBar from "../components/Admon/Layout/AdminSideBar.jsx";
import AllSellers from "../components/Admon/AllSellers.jsx";
const AdminDashboardSellerPage = () => {
  return (
    <div>
    <AdminHeader/>
    <div className="w-full flex">
      <div className="w-[30%]">
        <AdminSideBar active={3}/>
      </div>
      <div className="w-[70%]">
        <AllSellers/>
      </div>
    </div>
  </div>
  )
}

export default AdminDashboardSellerPage