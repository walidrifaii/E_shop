import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader';
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar';
import AllOrders from "../../components/Shop/AllOrders.jsx";
import Footer from '../../components/layouts/Footer.jsx';
import OrderDetails from '../../components/Shop/OrderDetails.jsx';

const ShopOrderDetails = () => {
  return (
    <div>
    <DashboardHeader/>
    <OrderDetails />
   <Footer/>
  </div>
  )
}

export default ShopOrderDetails