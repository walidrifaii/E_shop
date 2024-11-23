import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader' 
import ShopSettings from '../../components/Shop/ShopSettings.jsx' 
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar.jsx'

const ShopSettingsPage = () => {
  return (
    <div>
        <DashboardHeader />
      <div className="flex items-star justify-between w-full">
        <div className="w-[100px] 800px:w-[330px]">
            <DashboardSideBar active={11}/>
        </div>
        <ShopSettings />
        
</div>
    </div>
  )
}

export default ShopSettingsPage