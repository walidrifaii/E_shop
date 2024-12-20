import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersAdmin } from "../../redux/actions/user";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import styles from "../../style/style";
import { RxCross1 } from "react-icons/rx";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllUsers = () => {
  const { users } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllUsersAdmin());
  }, []);

  const handleDeleted = async (id) => {
    await axios
      .delete(`${server}/user/delete-user/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
      });
    dispatch(getAllUsersAdmin());
  };
  const columns = [
    { field: "id", headerName: "user Id", minWidth: 150, flex: 0.7 },

    {
      field: "name",
      headerName: "Name",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "role",
      headerName: "Role",
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
      headerName: "Deleted User",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => setUserId(params._id) || setOpen(true)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  users &&
    users.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
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
        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpen(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
                Are you sure you wanna delete this user?
              </h3>
              <div className="w-full flex items-center justify-center">
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}
                  onClick={() => setOpen(false)}
                >
                  cancel
                </div>
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] ml-4`}
                  onClick={handleDeleted(userId) || setOpen(false)}
                >
                  confirm
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
