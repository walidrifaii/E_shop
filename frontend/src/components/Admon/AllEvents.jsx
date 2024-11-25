import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineDelete,
  AiOutlineEye,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersAdmin } from "../../redux/actions/user";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import styles from "../../style/style";
import { RxCross1 } from "react-icons/rx";
import { server } from "../../server";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const AllProducts = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${server}/event/admin-all-events`, { withCredentials: true })
      .then((res) => {
        setData(res.data.events);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "product Id", minWidth: 150, flex: 0.7 },

    {
      field: "name",
      headerName: "Name",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "price",
      headerName: "price",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "stock",
      headerName: "stock",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "Sold",
      headerName: "Sold Out",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "joinedAt",
      headerName: "joinedAt",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: " ",
      flex: 1,
      headerName: "preview",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}?isEvent=true`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "  ",
      flex: 1,
      headerName: "Delet",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: item.discountPrice,
        stock: item.stock,
        Sold: item.sold_out,
        joinedAt: item.createdAt.slice(0, 10),
      });
    });
  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[95%]">
        <h3 className="text-[20px] font-Poppins pb-2"> Latest users</h3>
        <div className="w-full min-h-[45vh] bg-white rounded">
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
  );
};

export default AllProducts;
