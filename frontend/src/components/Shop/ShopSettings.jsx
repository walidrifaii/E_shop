import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../style/style";
import axios from "axios";
import { toast } from "react-toastify";
import { loadShop } from "../../redux/actions/user";



const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState(seller && seller.name);
  const [address, setAddress] = useState(seller && seller.address);
  const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
  const [description, setDescription] = useState(seller && seller.description);
  const [zipCode, setZipCode] = useState(seller && seller.zipCode);
  const dispatch = useDispatch();


  const handleImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0]; // Get the first file from the input
    setAvatar(file);

    const formData = new FormData();
    formData.append("image", file); // Append only the first file
    await axios.put(`${server}/shop/update-shop-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
        .then((response) => {
          dispatch(loadShop())
          toast.success("Avatar updated successfully");
        })
        .catch((error) => {
          toast.error(error.message);
        });

};

  const updateHandler = async (e) => {
    e.preventDefault();
    await axios.put(`${server}/shop/update-shop-info` ,{
        phoneNumber, name , address , description , zipCode 
    } , {withCredentials:true})
    .then((response) => {
      dispatch(loadShop())
      toast.success("Shop info updated successfully");
    })
    .catch((error) => {
      toast.error(error.message);
    });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center my-5">
      <div className="flex flex-col justify-center w-full 800px:w-[80%]">
        <div className="w-full flex items-center justify-center">
          <div className="relative">
            <img
              src={
                avatar ? URL.createObjectURL(avatar) : `${backend_url}/${seller?.avatar}`
              }
              className="w-[200px] h-[200px] rounded-full"
              alt=""
            />
            <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
              <input
                type="file"
                id="image"
                className=" hidden"
                onChange={handleImage}
              />
              <label htmlFor="image" className="cursor-pointer">
                <AiOutlineCamera size={20} />
              </label>
            </div>
          </div>
        </div>
        {/* shop info  */}
        <form
          aria-aria-required={true}
          className="flex flex-col items-center"
          onSubmit={updateHandler}
        >
          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Name</label>
            </div>
            <input
              type="text"
              placeholder={`${seller?.name}`}
              value={name}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Description</label>
            </div>
            <input
              type="text"
              placeholder={`${
                seller?.description
                  ? seller?.description
                  : "Enter your Shop Description"
              }`}
              value={description}

              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              onChange={(e) => setDescription(e.target.value)}
              
            />
          </div>

          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Address</label>
            </div>
            <input
              type="text"
              placeholder={`${
                seller?.address ? seller?.address : "Enter your Shop Address"
              }`}
              value={address}

              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop PhoneNumber</label>
            </div>
            <input
              type="number"
              placeholder={`${seller?.phoneNumber}`}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              onChange={(e) => setPhoneNumber(e.target.value)}
              value={phoneNumber}

            />
          </div>

          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Zip Code</label>
            </div>
            <input
              type="number"
              placeholder={`${seller?.zipCode}`}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              onChange={(e) => setZipCode(e.target.value)}
              value={zipCode}

            />
          </div>
          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <input
              type="submit"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              value="Submit"
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
