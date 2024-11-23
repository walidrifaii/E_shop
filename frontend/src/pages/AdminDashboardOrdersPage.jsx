import React, { useEffect } from 'react'
import AdminHeader from "../components/layouts/AdminHeader.jsx";
import AdminSideBar from "../components/Admon/Layout/AdminSideBar.jsx";
import { DataGrid } from '@material-ui/data-grid';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfAdmin } from '../redux/actions/order.js';
const AdminDashboardOrdersPage = () => {

    const dispatch = useDispatch();
    const {adminOrders , isLoading} = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(getAllOrdersOfAdmin())
        
         
     
       },[dispatch])
    const columns = [
        { field: "id", headerName: "Order Id", minWidth: 150, flex: 0.7 },
        {
          field: "status",
          headerName: "Status",
          minWidth: 130,
          flex: 0.7,
          cellClassName: (params) => {
            return params.getValue(params.id, "status") === "delivered"
              ? "greenColor"
              : "redColor";
          },
        },
        {
          field: "itemsQty",
          headerName: "Items Qty",
          type: "number",
          minWidth: 130,
          flex: 0.7,
        },
        {
          field: "total",
          headerName: "Total",
          type: "number",
          minWidth: 130,
          flex: 0.8,
        },
        {
            field: "createdAt",
            headerName: "createdAt",
            type: "number",
            minWidth: 130,
            flex: 0.8,
          },
        {
          field: " ",
          flex: 1,
          headerName: "",
          type: "number",
          sortable: false,
          renderCell: (params) => {
            return (
              <>
                <Link to={`/order/${params.id}`}>
                  <Button>
                    <AiOutlineArrowRight size={20} />
                  </Button>
                </Link>
              </>
            );
          },
        },
      ];
    
      const row = [];
      adminOrders &&
      adminOrders.forEach((item) => {
          row.push({
            id: item._id,
            itemsQty: item.cart.length,
            total: "US$" + item.totalPrice,
            status: item.status,
            createdAt: item.createdAt.slice(0,10)
          });
        });
  return (
    
    <div>
    <AdminHeader/>
    <div className="w-full flex">
      <div className="w-[30%]">
        <AdminSideBar active={2}/>
      </div>


      <div className="w-full min-h-[45vh] pt-5 flex justify-center  rounded">
      <div className="w-[97%] flex justify-center">
 
      <DataGrid
           rows={row}
           columns={columns}
           pageSize={10}
           disableSelectionOnClick
           autoHeight
         />
    
      
     
     </div>
      </div>
    </div>
  </div>
  )
}

export default AdminDashboardOrdersPage