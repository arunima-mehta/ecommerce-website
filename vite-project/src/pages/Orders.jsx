import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';


const Orders = () => {

  const { backendUrl, token, currency} = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderData = async () => {
    try {
      if(!token){
        setLoading(false);
        return null;
      }

      const response = await axios.post(backendUrl + '/api/order/userorders',{}, {headers:{token}});
      
      if (response.data.success) {
         let allOrdersItem = []; 
         response.data.orders.map((order)=>{ 
          order.items.map((item)=>{
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date; 
            allOrdersItem.push(item);
          })
        })
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    loadOrderData();
  }, [token]); // Add dependency array to prevent infinite re-renders

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={' ORDERS'} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      ) : !token ? (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Please Sign In
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sign in to view your order history
            </p>
          </div>
        </div>
      ) : orderData.length === 0 ? (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10H6L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Orders Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <button 
              onClick={() => window.location.href = '/collection'}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Start Shopping
            </button>
          </div>
        </div>
      ) : (
        <div>
          {
            orderData.map((item,index)=>(
              <div key={index} className='py-4 border-t border-b text-gray-700 dark:text-gray-300 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div className='flex items-start gap-6 text-sm'>
                  <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                  <div>
                    <p className='sm:text-base font-medium'>{item.name}</p>
                    <div className='flex items-center gap-3 mt-1 text-base text-gray-700 dark:text-gray-300'>
                      <p>{currency}{item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Size: {item.size}</p>
                    </div>
                    <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                    <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p> 
                  </div>
                </div>
                <div className='md:w-1/2 flex justify-between'>
                  <div className='flex items-center gap-2'>
                    <p className={`min-w-2 h-2 rounded-full ${
                      item.status === 'Order Placed' ? 'bg-green-500' :
                      item.status === 'Packing' ? 'bg-blue-500' :
                      item.status === 'Shipped' ? 'bg-yellow-500' :
                      item.status === 'Out for delivery' ? 'bg-orange-500' :
                      item.status === 'Delivered' ? 'bg-green-600' : 'bg-gray-500'
                    }`}></p>
                    <p className='text-sm md:text-base'>{item.status}</p>
                  </div>
                  <a 
                    href="/GNSS.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className='border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 inline-block'
                  >
                    Track Order
                  </a>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  )
}

export default Orders
