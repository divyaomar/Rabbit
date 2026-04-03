 import React from 'react';
 import {PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js"
 
 const PayPalButton = ({amount, onError, onSuccess}) => {
   return (
     
<PayPalScriptProvider options={{"client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID}}>

    <PayPalButtons style={{layout:"vertical"}}
createOrder={(data, actions) => {
    return actions.order.create({
purchase_units:[{amount: {value: parseFloat(amount).toFixed(2)} }]
    })
}}
onApprove={(data, actions)=>{
    return actions.order.capture().then((details) => {
      
        onSuccess(details);
    });
}}
onError={onError}
/> 
</PayPalScriptProvider>


     
   )
 }
 
 export default PayPalButton
 //sb-luwjk49053468@personal.example.com
 //7q7N!7dX
