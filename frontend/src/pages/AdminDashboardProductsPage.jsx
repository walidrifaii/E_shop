import React from 'react'
import AdminHeader from "../components/layouts/AdminHeader.jsx";
import AdminSideBar from "../components/Admon/Layout/AdminSideBar.jsx";
import AllProducts from "../components/Admon/AllProducts.jsx";
const AdminDashboardProductsPage = () => {
  return (
    <div>
    <AdminHeader/>
    <div className="w-full flex">
      <div className="w-[30%]">
        <AdminSideBar active={5}/>
      </div>
      <div className="w-[70%]">
        <AllProducts/>
      </div>
    </div>
  </div>
  )
}

export default AdminDashboardProductsPage