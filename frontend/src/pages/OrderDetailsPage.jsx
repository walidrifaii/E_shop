import React from 'react'
import Header from '../components/layouts/Header'
import Footer from '../components/layouts/Footer'
import UserOrderDeatails from '../components/UserOrderDeatails.jsx'

const OrderDetailsPage = () => {
  return (
    <div>
        <Header />
        <UserOrderDeatails />
        <Footer /> 
    </div>
  )
}

export default OrderDetailsPage