'use client';
import useBookRoom from '@/hooks/useBookRoom';
import {Elements} from "@stripe/react-stripe-js"
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import RoomCard from '../room/RoomCard';
import RoomPaymentForm from './RoomPaymentForm';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const BookRoomClient = () => {
  const { bookingRoomData, clientSerect } = useBookRoom();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const {theme} = useTheme()
  const router = useRouter()
  const options: StripeElementsOptions = {
    clientSecret: clientSerect,
    appearance:{
        theme: theme === 'dark'? 'night' : 'stripe',
        labels: 'floating'
    }
  }

  const handleSetPaymentSuccess= (value: boolean) =>{
    setPaymentSuccess(value)
  }
  if(!paymentSuccess && (!bookingRoomData || !clientSerect)) return <div className='flex
  items-center flex-col gap-4'>
    <div className='text-rose-500'>Không thể tải được trang này</div>
    <div className="flex items-center gap-4">
    <Button variant='outline' onClick={()=> router.push('/')}>Trở về trang chủ</Button>
    <Button onClick={()=> router.push('/my-bookings')}>Xem danh sách đặt phòng</Button>
    </div>
  </div>
  if(paymentSuccess) return <div className='flex items-center flex-col gap-4'>
    <div className='text-teal-500 text-center'>Thanh toán thành công</div>
    <Button onClick={()=> router.push('/my-bookings')}>Xem danh sách đặt phòng</Button>
  </div>
  return (
    <div className="max-w-[700px] mx-auto">
      {clientSerect && bookingRoomData && (
          <div>
            <h3 className="text-2xl font-semibold">
              Hãy hoàn thành thanh toán đặt phòng
            </h3>
            <div className='mb-6'>
                <RoomCard room={bookingRoomData.room}/>
            </div>
            <Elements stripe={stripePromise} options={options}>
                <RoomPaymentForm clientSecret={clientSerect} handleSetPaymentSuccess={handleSetPaymentSuccess}/>
            </Elements>
        </div>
      )}
    </div>
  );
};

export default BookRoomClient;
