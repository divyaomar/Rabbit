import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PayPalButton from './PayPalButton';
import { useDispatch, useSelector } from 'react-redux';
import { createCheckout } from '../../redux/slices/checkoutSlice';
import axios from 'axios';

const Checkout = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {cart, loading, error} = useSelector((state) => state.cart);
    const {user} = useSelector((state) => state.auth);
    


const [checkoutId, setCheckoutId] = useState(null);
    // Add a state to hold the shipping address information.
    const [shippingAddress, setShippingAddress] = useState({
        firstName:"",
        lastName:"",
        address:"",
        city:"",
        postalCode:"",
        country:"",
        phone:"",
    })
    

    //esure cart is loaded before proceeding
    useEffect(() => {
        if(!cart || !cart.products || cart.products.length === 0){
            navigate('/');
        }
    }, [cart, navigate])
    const handleCreateCheckout= async (e)=>{
e.preventDefault();
if(cart && cart.products.length > 0){
    const res = await dispatch(createCheckout({
        checkoutItems: cart.products,
        shippingAddress,
        paymentMethod:"Paypal",
        totalPrice:cart.totalPrice,
    })
);
if(res.payload && res.payload._id){
    setCheckoutId(res.payload._id); //set checkout ID if checkout was successful;
} 
}
    }
// { paymentStatus : "paid", paymentDetails: details} ye maie replace kar diya
    const handlePaymentSuccess = async (details) => {
         // ✅ YAHAN ADD KARO
  console.log("Checkout ID:", checkoutId);
  console.log("Payment Details:", details);
        if (!checkoutId) {
  alert("Checkout not created properly");
  return;
}
try {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`, 
        {
  paymentStatus: "paid",
  paymentDetails: details
}, 
{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("userToken")}`
      }
    });
   console.log("PAY RESPONSE:", response);
   if (response.status === 200) {
      await handleFinalizedCheckout(checkoutId);
    }
    
} catch (error) {
   console.error("PAYMENT ERROR:", error.response?.data || error);
}
        

};

const handleFinalizedCheckout = async (checkoutId) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`, {}, 
            {
            headers:{
                Authorization:`Bearer ${localStorage.getItem("userToken")}`
            },
        });
         console.log("FINALIZE RESPONSE:", response); //
       navigate(`/order-confirmation`)
    } catch (error) {
      alert("Order failed after payment");
console.error("FINALIZE ERROR:", error);
        
    }
}

if(loading) return <p>Loading cart....</p>;
if(error) return <p>error cart.... {error}</p>;
if(!cart || !cart.products || cart.products.length === 0){
    return <p>Your cart is empty.</p>
}
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>


{/* left section */}
<div className="bg-white rounded-lg p-6">
    <h2 className="text-2xl uppercase mb-6">Checkout</h2>
    <form action="" className="" onSubmit={handleCreateCheckout}>
        <h3 className="text-lg mb-4">Contact Details</h3>
        <div className="mb-4">
            <label htmlFor="" className="text-gray-700">Email</label>
            <input type="email" 
             value={user? user.email : " "}
             className='w-full p-2 border rounded-lg'
             disabled
           />
        </div>
        <h3 className='text-lg mb-4'>Delivery</h3>
        <div className="mb-4 grid grid-cols-2 gap-4">
            {/* First Name */}
          
            <div className="">
                <label htmlFor="" className="block text-gray-700">First Name</label>
                <input type="text" className='w-full p-2 border rounded'
                value={shippingAddress.firstName}
                onChange={(e) => setShippingAddress({...shippingAddress, firstName:e.target.value})}
                required />
            </div>
            {/* Last Name */}
             <div className="">
                <label htmlFor="" className="block text-gray-700">Last Name</label>
                <input type="text" className='w-full p-2 border rounded'
                value={shippingAddress.lastName}
                onChange={(e) => setShippingAddress({...shippingAddress, lastName:e.target.value})}
                required />
            </div>
           
        </div>
    {/* Address */}
        <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">Address</label>
       <input type="text" 
       value={shippingAddress.address}
       onChange={(e)=>setShippingAddress({...shippingAddress, address:e.target.value})}
       className='w-full p-2 border rounded'
       required/>
        </div>
        {/* Address */}
        {/*  */}
<div className="mb-4 grid grid-cols-2 gap-4">
 
            {/* City */}
            <div className="">
                <label htmlFor="" className="block text-gray-700">City</label>
                <input type="text" className='w-full p-2 border rounded'
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({...shippingAddress, city:e.target.value})}
                required />
            </div>
            {/* Postal Code */}
             <div className="">
                <label htmlFor="" className="block text-gray-700">Postal Code</label>
                <input type="text" className='w-full p-2 border rounded'
                value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({...shippingAddress, postalCode:e.target.value})}
                required />
            </div>
        </div>


        {/* Postal code */}
        {/*  */}
         <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">Country</label>
       <input type="text" 
       value={shippingAddress.country}
       onChange={(e)=>setShippingAddress({...shippingAddress, country:e.target.value})}
       className='w-full p-2 border rounded'
       required/>
        </div>
        {/* telephone */}
         <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">Phone</label>
       <input type="text" 
       value={shippingAddress.phone}
       onChange={(e)=>setShippingAddress({...shippingAddress, phone:e.target.value})}
       className='w-full p-2 border rounded'
       required/>
        </div>
        <div className="mt-6">
            {!checkoutId ? (
                <button type='submit' className='w-full bg-black text-white py-3 rounded'>Continue to Payment</button>
            ) : (
                <div>
                    <h3 className="text-lg mb-4">Pay with Paypal</h3>
                    <PayPalButton amount={cart.totalPrice} onSuccess={handlePaymentSuccess} onError={(err)=>alert("Payment Failed. Try again")}/>
                    {/* paypal button component will be added */}
                </div>
            )}
        </div>
    </form>
    
</div>


{/* left section */}


{/* Right Section */}
<div className="bg-gray-50 p-6 rounded-lg">
    <h3 className="text-lg mb-4">Order Summary</h3>
    <div className="border-t py-4 mb-4">
        {cart.products.map((product, index) => (
            <div key={index} className='flex items-start justify-between py-2 border-b '>
<div className="flex flex-start">
    <img src={product.image} alt={product.name} className='w-20 h-24 object-cover mr-4' />
    <div className="">
        <h3 className="text-md">{product.name}</h3>
        <p className="text-gray-500">Size: {product.size}</p>
   <p className="text-gray-500">Color: {product.color}</p>
    </div>
    
</div>
<p className="text-xl">${product.price?.toLocaleString()}</p>
            </div>
        ))}
    </div>
    <div className="flex justify-between items-center text-lg mb-4">
        <p className="">Subtotal</p>
        <p className="">${cart.totalPrice?.toLocaleString()}</p>
    </div>
    <div className="flex justify-between items-center text-lg">
        <p className="">Shipping</p>
        <p className="">Free</p>
    </div>
    <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
        <p>Total</p>
        <p>${cart.totalPrice?.toLocaleString()}</p>
    </div>
</div>


    </div>
  )
}

export default Checkout
// CLient id  -  AcVL1JsWOGUjQFLtE8hD3ITolEWBKi8cWiWFwNu06hv_N0P3xcaqmRit4GcL_Ojc9PWSCQWxtFMg-no4
// secret key 1   -  
// EJNPwKDqamQCWl5MBl3eDEq1NeFiB9TGNqwr_eK6KLVgZhvA_poScY7EWHlh0mpgVUz1dyFLHrtUbINO