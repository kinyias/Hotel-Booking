'use client';

import { Booking, Hotel, Room } from '@prisma/client';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
} from '../ui/card';
import Image from 'next/image';
import AmenityItem from '../AmenityItem';
import {
  Bed,
  BedDouble,
  MapPin,
  Users,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { useRouter } from 'next/navigation';
import React, {useState } from 'react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { differenceInCalendarDays } from 'date-fns';
import PriceDisplay from '../PriceDisplay';
import { formatCurrency } from '@/utils/formatCurrency';
import { useAuth } from '@clerk/nextjs';
import useBookRoom from '@/hooks/useBookRoom';
import useLocation from '@/hooks/useLocation';
import moment from 'moment';

interface MyBookingClientProps {
  booking: Booking & { Room: Room | null } & { Hotel: Hotel | null };
}

const MyBookingClient: React.FC<MyBookingClientProps> = ({ booking }) => {
  const { setRoomData, setClientSecret, paymentIntentId, setPaymentIntentId } =
    useBookRoom();
  const [bookingIsLoading, setBookingIsLoading] = useState(false);
  const { userId } = useAuth();
  const router = useRouter();
  const { Hotel, Room } = booking;
  const { getCityByCode, getDistByCode } = useLocation();
  const { toast } = useToast();
  if (!Hotel || !Room) return <div>Thiếu dữ liệu...</div>;
  const city = getCityByCode(Hotel.city);
  const district = getDistByCode(Hotel.district);
  const startDate = moment(booking.startDate).format('DD/MM/YYYY');
  const endDate = moment(booking.endDate).format('DD/MM/YYYY');
  const dayCount = differenceInCalendarDays(booking.endDate, booking.startDate);

  const handleBookRoom = () => {
    if (!userId)
      return toast({
        variant: 'destructive',
        description: 'Bạn phải đăng nhập để đặt phòng',
      });

    if (!Hotel?.userId)
      return toast({
        variant: 'destructive',
        description: 'Có lỗi xảy ra. Không thể đặt phòng vui lòng thử lại',
      });

    setBookingIsLoading(true);

    const bookingRoomData = {
      room: Room,
      totalPrice: booking.totalPrice,
      breakFastIncluded: booking.breakFastIncluded,
      startDate: booking.startDate,
      endDate: booking.endDate,
    };

    setRoomData(bookingRoomData);
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        booking: {
          hotelOwnerId: Hotel.userId,
          hotelId: Hotel.id,
          roomId: Room.id,
          startDate: bookingRoomData.startDate,
          endDate: bookingRoomData.endDate,
          breakFastIncluded: bookingRoomData.breakFastIncluded,
          totalPrice: bookingRoomData.totalPrice,
        },
        payment_intent_id: paymentIntentId,
      }),
    })
      .then((res) => {
        setBookingIsLoading(false);
        if (res.status === 401) {
          toast({
            variant: 'destructive',
            description: `Chưa đăng nhập. Vui lòng đăng nhập để đặt phòng`,
          });
          return router.push('/sign-in');
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setClientSecret(data.client_secret);
        setPaymentIntentId(data.id);
        router.push('/book-room');
      })
      .catch((error) => {
        console.log('Error:', error);
        toast({
          variant: 'destructive',
          description: `Có lỗi xảy ra. Không thể đặt phòng vui lòng thử lại ${error.message}`,
        });
      });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{Hotel.title}</CardTitle>
        <CardDescription>
          <div className="font-semibold mt-4">
            <AmenityItem>
              <MapPin className="h-4 w-4" /> {district.name}, {city.name}
            </AmenityItem>
          </div>
          <p className='py-2'>{Hotel.locationDescription}</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="apsect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={Room.image}
            alt={Room.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-sm">
          <AmenityItem>
            <Bed className="w-4 h-4" />
            {Room.bedCount} giường
          </AmenityItem>
          <AmenityItem>
            <Users className="w-4 h-4" />
            {Room.guestCount} người
          </AmenityItem>
          <AmenityItem>
            <Bed className="w-4 h-4" />
            {Room.bathroomCount} phòng tắm
          </AmenityItem>
          {!!Room.singleBed && (
            <AmenityItem>
              <Bed className="w-4 h-4" />
              {Room.singleBed} giường đơn
            </AmenityItem>
          )}
          {!!Room.doubleBed && (
            <AmenityItem>
              <BedDouble className="w-4 h-4" />
              {Room.doubleBed} giường đôi
            </AmenityItem>
          )}
        </div>
        <Separator />
        <div className="flex flex-wrap gap-4 justify-between">
          <div>
            Giá phòng:{' '}
            <span className="font-bold">
              <PriceDisplay price={Room.roomPrice} />
            </span>{' '}
            <span className="text-xs">/ngày</span>
          </div>
          {!!Room.breakFastPrice && (
            <div>
              Giá bữa sáng:{' '}
              <span className="font-bold">
                {formatCurrency(Room.breakFastPrice)}
              </span>
            </div>
          )}
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <CardTitle>Chi tiết đặt phòng</CardTitle>
          <div className="text-primary/90">
            <div>
              Phòng được đạt bởi {booking.userName} cho {dayCount} ngày -{' '}
              {moment(booking.bookedAt).fromNow()}
            </div>
            <div>Check-in: {startDate}</div>
            <div>Check-out: {endDate}</div>
            {booking.breakFastIncluded && <div>Bữa sáng được phục vụ</div>}
            {booking.paymentStatus ? (
              <div className="text-teal-500">
                Đã thanh toán <PriceDisplay price={booking.totalPrice} /> -
                Phòng đã đặt
              </div>
            ) : (
              <div className="text-rose-500">
                Chưa thanh toán <PriceDisplay price={booking.totalPrice} /> -
                Phòng chưa đặt
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex items-center justify-between'>
        <Button disabled={bookingIsLoading} variant='outline' onClick={()=> router.push(`/hotel-details/${Hotel.id}`)}>Xem khách sạn</Button>
        {
            !booking.paymentStatus && booking.userId == userId && <Button disabled={bookingIsLoading}  onClick={
                () => handleBookRoom()
            }>Thanh toán ngay</Button>
        }
      </CardFooter>
    </Card>
  );
};

export default MyBookingClient;
