import React ,{ useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch} from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import styles from '../../style/style';
import { RxCross1 } from "react-icons/rx";
import axios from 'axios';
import { server } from '../../server';
import { toast } from "react-toastify";
import { loadShop } from '../../redux/actions/user';
import { AiOutlineDelete } from 'react-icons/ai';


const WithDrawMoney = () => {
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(false); 
    const [withdrawAmount , setWithdrawAmount] = useState(null);
    const [bankInfo, setBankInfo] = useState({
      bankName: "",
      bankCountry: "",
      bankSwiftCode: "null" ,
      bankAcountNumber: "null",
      bankAccountName: "null",
      bankHolderName: "",
      bankAddress: "",
    })

    const { seller } = useSelector((state) => state.seller);
    
  
    const dispatch = useDispatch();
    useEffect(() => {

      dispatch(getAllOrdersOfShop(seller._id));
    } ,[dispatch])
  
    
    


    const handleSubmit = (e) => {
      e.preventDefault();
      const withdrawMethod = {
        bankName: bankInfo.bankName,
        bankCountry: bankInfo.bankCountry,
        bankSwiftCode: bankInfo.bankSwiftCode,
        bankAcountNumber: bankInfo.bankAcountNumber,
        bankAccountName: bankInfo.bankAccountName,
        bankHolderName: bankInfo.bankHolderName,
      }

      setPaymentMethod(false);

      

      axios.put(`${server}/shop/update-payment-methods` , {withdrawMethod} , {withCredentials:true})
      .then((res) => {
        toast.success("withDraw method add successfly")
        console.log(res.data);
        setOpen(false);
        setBankInfo({
          bankName: "",
          bankCountry: "",
          bankSwiftCode: "null" ,
          bankAcountNumber: "null",
          bankAccountName: "null",
          bankHolderName: "",
          bankAddress: "",
        })
        dispatch(loadShop())
      })
      .catch((err) => {
      
        console.log(err.response.data.message);
        
      })
    }
    const deleteHandler =  async () => {
       await axios.delete(`${server}/shop/delete-withdraw-method` , {withCredentials:true})
      .then((res) => {
         toast.success("Payment method deleted successfly")
         console.log(res.data);
         setOpen(false);
         setPaymentMethod(false);
         dispatch(loadShop())
       })
      .catch((err) => {
        console.log(err.response.data.message);
       })
     }
const error = () => {
  toast.error("No balance to withdraw")

}
const withdrawHandler = async () => {
 if(withdrawAmount < 5 || withdrawAmount >  seller?.availableBalance ){
  toast.error("Withdraw amount should be between 50 and available balance")
 }
 else{
  const amount = withdrawAmount;
  await axios.post(`${server}/withdraw/create-withdraw-request` , {amount} ,{withCredentials:true} )
  .then((res) => {
     toast.success("Withdraw request created successfly")
     console.log(res.data);
     setOpen(false);
 
  })
  .catch((err) => {
     console.log(err.response.data.message);
  })
 }
}

  return (
    <div className='w-full h-[90vh] p-8'>
       <div className="w-full bg-white h-full rounded flex items-center justify-center flex-col">
          <h5 className='text-[20px] pb-4'>Available Balance: ${seller?.availableBalance}</h5>
          <div className={`${styles.button} text-white !rounded-[4px] !h-[42px]`} 
          onClick={() => seller?.availableBalance === 0 && NaN ? error() :  setOpen(true)}
          >WithDraw</div>
       </div>
       {
        open && (
          <div className="w-full  fixed top-0 left-0 flex items-center justify-center bg-[#0000004e] h-screen z-[999]">
            <div className={`w-[95%] 800px:w-[50%] bg-white shadow rounded ${paymentMethod ? "h-[80vh] overflow-y-scroll" : "h-[unset]"} min-h-[40vh] p-3`}>
              <div className="w-full flex justify-end">
                <RxCross1 size={20}
                onClick={() => setOpen(false)} />
              </div>
              {
                paymentMethod ? (
                  <div>
                    <h3 className='text-[22px] font-Poppins text-center font-[600]'>
                      Add new paymentMethod
                    </h3>
                    <form onSubmit={handleSubmit}>
                      <div>
                        <label htmlFor="">
                          Bank Name <span className='text-red-500'>*</span>
                        </label>
                        <input type="text" name='' id='' required
                        value={bankInfo.bankName}
                        onChange={(e) => setBankInfo({...bankInfo,bankName: e.target.value})}
                        placeholder='Enter your bank name!' 
                        className={`${styles.input}`} mt-2 
                        />
                      </div>
                      <div className='pt-2'>
                        <label htmlFor="">
                          Bank  Country <span className='text-red-500'>*</span>
                        </label>
                        <input type="text" name='' id='' required 
                        value={bankInfo.bankCountry}
                       
                        onChange={(e) => setBankInfo({...bankInfo,bankCountry: e.target.value})}

                        placeholder='Enter your bank  country!' 
                        className={`${styles.input}`} mt-2 
                        />
                      </div>
                      <div className='pt-2'>
                        <label htmlFor="">
                          Bank Swift Code  <span className='text-red-500'>*</span>
                        </label>
                        <input type="number" name='' id='' required
                        value={bankInfo.bankSwiftCode}
                        onChange={(e) => setBankInfo({...bankInfo,bankSwiftCode: e.target.value})}
                        placeholder='Enter your bank  Swift Code!' 
                        className={`${styles.input}`} mt-2 
                        />
                      </div>
                      <div className='pt-2'>
                        <label htmlFor="">
                          Bank Account Number <span className='text-red-500'>*</span>
                        </label>
                        <input type="number" name='' id='' required 
                        value={bankInfo.bankAcountNumber}
                        onChange={(e) => setBankInfo({...bankInfo,bankAcountNumber: e.target.value})}
                        placeholder='Enter your bank account number!' 
                        className={`${styles.input}`} mt-2 
                        />
                      </div>
                      
                      <div className='pt-2'>
                        <label htmlFor="">
                          Bank  Holder Name <span className='text-red-500'>*</span>
                        </label>
                        <input type="text" name='' id='' required 
                        value={bankInfo.bankHolderName}
                        onChange={(e) => setBankInfo({...bankInfo,bankHolderName: e.target.value})}
                        placeholder='Enter your bank    Holder Name!' 
                        className={`${styles.input}`} mt-2 
                        />
                      </div>
                      <div className='pt-2'>
                        <label htmlFor="">
                          Bank  Address <span className='text-red-500'>*</span>
                        </label>
                        <input type="text" name='' id='' required 
                        value={bankInfo.bankAddress}
                        onChange={(e) => setBankInfo({...bankInfo,bankAddress: e.target.value})}
                        placeholder='Enter your bank  address!' 
                        className={`${styles.input}`} mt-2 
                        />
                      </div>


                      <button type='submit' className={`${styles.button} mb-3 text-white` }> Add</button>
                      
                      
                    </form>
                  </div>
                ) : (
                  <>
                   <h3 className='text-[25px] font-Poppins'>Available withdrawMethod Methods:</h3>
              {
                seller && seller?.withdrawMethod ? (
                  <div>
                    <div className="flex w-full justify-between items-center">
                     <div className="w-[50%]
                     ">
                       <h5>
                        Account Number :{" "}
                        {"*".repeat(
                          seller?.withdrawMethod?.bankAccountNumber?.length - 3
                        ) + seller?.withdrawMethod.bankAccountNumber?.slice(-3)}
                      </h5>
                      <h5>Bank Name : {seller?.withdrawMethod?.bankName}</h5>
                     </div>
                      <div className="w-[50%]">
                        <AiOutlineDelete size={25} className='cursor-pointer' onClick={() => deleteHandler()} />
                      </div>
                    </div>
                    <br />
                    <h4>Availble Balance : {seller?.availableBalance}</h4>
                    <br />
                    <div className="800px:flex w-full items-center">
                      <input
                        type="number"
                        placeholder="Amount..."
                        value={withdrawAmount}
                        onChange={(e) => {setWithdrawAmount(e.target.value)}}
                        className="800px:w-[100px] w-full border 800px:mr-3 p-1 rounded"
                      />
                      <div className={`${styles.button} !h-[42px] text-white`}
                      onClick={withdrawHandler}>
                        Withdraw
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                      <p>No payment methods added yet.</p>
                      <div className='w-full flex items-center'>
                        <div className={`${styles.button} text-[#fff] text-[18px] mt-4`} onClick={() => setPaymentMethod(true)}>
                          Add new
                        </div>
                      </div>
                  </div>
                )
              }
                  </>
                )
              }
            </div>
            
          </div>
        )
       }
    </div>
  )
}

export default WithDrawMoney