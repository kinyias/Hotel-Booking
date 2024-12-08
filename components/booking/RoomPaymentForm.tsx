'use client';

import { useToast } from '@/hooks/use-toast';
import useBookRoom from '@/hooks/useBookRoom';
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { Separator } from '../ui/separator';
import PriceDisplay from '../PriceDisplay';
import moment from 'moment';
import { Button } from '../ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';
interface RoomPaymentFormProps {
  clientSecret: string;
  handleSetPaymentSuccess: (value: boolean) => void;
}
const RoomPamentForm = ({
  clientSecret,
  handleSetPaymentSuccess,
}: RoomPaymentFormProps) => {
  const { bookingRoomData, resetBookRoom } = useBookRoom();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!clientSecret) {
      return;
    }
    handleSetPaymentSuccess(false);
    setIsLoading(false);
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements || !bookingRoomData) {
      return;
    }

    try {
        //Date overlap
        
      stripe
        .confirmPayment({ elements, redirect: 'if_required' })
        .then((result) => {
          if (!result.error) {
            axios
              .patch(`api/booking/${result.paymentIntent.id}`)
              .then((res) => {
                toast({
                  variant: 'success',
                  description: 'Đặt phòng thành công!',
                });
                router.refresh();
                resetBookRoom();
                handleSetPaymentSuccess(true);
                setIsLoading(false);
              })
              .catch((error) => {
                console.log(error);
                toast({
                  variant: 'destructive',
                  description: 'Có lỗi xảy ra! Vui lòng thử lại',
                });
                setIsLoading(false)
              });
          }else{

          }
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  if (!bookingRoomData?.startDate || !bookingRoomData.endDate)
    return <div>Lỗi: Không tìm thấy dữ liệu đặt phòng</div>;
  moment.locale('vi');
  const startDate = moment(bookingRoomData?.startDate).format('DD/MM/YYYY');
  const endDate = moment(bookingRoomData?.endDate).format('DD/MM/YYYY');
  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <h2 className="font-semibold mb-2 text-lg">Địa chi thanh toán</h2>
      <AddressElement
        options={{
          mode: 'billing',
          allowedCountries: ['US', 'VN'],
        }}
      />
      <h2 className="font-semibold mt-4 mb-2 text-lg">Thông tin thanh toán</h2>
      <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold mb-1 text-lg">Thông tin đặt phòng</h2>
        <div>Bạn sẽ check-in vào {startDate}</div>
        <div>Bạn sẽ check-out vào {endDate}</div>
        {bookingRoomData?.breakFastIncluded && (
          <div>Bạn sẽ được phục vụ buổi sáng mỗi ngày vào 8 giờ sáng</div>
        )}
        <Separator />
        <div className="font-bold text-lg">
          {bookingRoomData?.breakFastIncluded && (
            <div className="mb-2">
              Giá buổi sáng:
              {bookingRoomData.room.breakFastPrice}
            </div>
          )}
          Tổng tiền: <PriceDisplay price={bookingRoomData?.totalPrice || 0} />
        </div>
      </div>
      {isLoading && <div> V</div>}
      {isLoading && 
                <Alert className="bg-green-600 text-white">
                  <Terminal className="h-4 w-4 stroke-white" />
                  <AlertTitle>Đang thực hiện thanh toán...</AlertTitle>
                  <AlertDescription>
                  Vui lòng chờ đợi thanh toán hoàn tất
                  </AlertDescription>
                </Alert>
              }
      <Button disabled={isLoading}>
        {isLoading ? 'Đang thực hiện thanh toán' : 'Thanh toán ngay'}
      </Button>
    </form>
  );
};

export default RoomPamentForm;
