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
  Loader2,
  Pencil,
  Trash,
  Users,
  Wand2,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import AddRoomForm from './AddRoomForm';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { DatePickerWithRange } from './DateRangePicker';
import { DateRange } from 'react-day-picker';
import { differenceInCalendarDays } from 'date-fns';
import PriceDisplay from '../PriceDisplay';
import { formatCurrency } from '@/utils/formatCurrency';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { useAuth } from '@clerk/nextjs';
import useBookRoom from '@/hooks/useBookRoom';

interface RoomCardProps {
  hotel?: Hotel & {
    room: Room[]; // Fixed property name from room to room
  };
  room: Room;
  booking?: Booking[];
}

const RoomCard = ({ hotel, room }: RoomCardProps) => {
  const { setRoomData, setClientSecret, paymentIntentId, setPaymentIntentId } =
    useBookRoom();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingIsLoading, setBookingIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [totalPrice, setTotalPrice] = useState(room.roomPrice);
  const [includeBreakFast, setIncludeBreakFast] = useState(false);
  const [days, setDays] = useState(1);
  const pathname = usePathname();
  const router = useRouter();
  const isHotelDetailsPage = pathname.includes('hotel-details');
  const { toast } = useToast();
  const { userId } = useAuth();
  useEffect(() => {
    if (date && date.from && date.to) {
      const dayCount = differenceInCalendarDays(date.to, date.from);

      setDays(dayCount);

      if (dayCount && room.roomPrice) {
        if (includeBreakFast && room.breakFastPrice) {
          setTotalPrice(
            dayCount * room.roomPrice + dayCount * room.breakFastPrice
          );
        } else {
          setTotalPrice(dayCount * room.roomPrice);
        }
      } else {
        setTotalPrice(room.roomPrice);
      }
    }
  }, [date, room.roomPrice, includeBreakFast]);
  const handleDialogueOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleDeleteRoom = (room: Room) => {
    setIsLoading(true);
    const imageKey = room.image.substring(room.image.lastIndexOf('/') + 1);
    axios
      .post('/api/uploadthing/delete', { imageKey })
      .then(() => {
        axios
          .delete(`/api/room/${room.id}`)
          .then(() => {
            router.refresh();
            toast({
              variant: 'success',
              description: 'Phòng đã được xoá thành công',
            });
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
            toast({
              variant: 'destructive',
              description: 'Không thể xoá phòng',
            });
          });
      })
      .catch(() => {
        setIsLoading(false);
        toast({
          variant: 'destructive',
          description: 'Không thể xoá phòng',
        });
      });
  };
  const handleBookRoom = () => {
    if (!userId)
      return toast({
        variant: 'destructive',
        description: 'Bạn phải đăng nhập để đặt phòng',
      });

    if (!hotel?.userId)
      return toast({
        variant: 'destructive',
        description: 'Có lỗi xảy ra. Không thể đặt phòng vui lòng thử lại',
      });

    if (date?.from && date?.to) {
      setBookingIsLoading(true);

      const bookingRoomData = {
        room,
        totalPrice,
        breakFastIncluded: includeBreakFast,
        startDate: date.from,
        endDate: date.to,
      };

      setRoomData(bookingRoomData);
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking: {
            hotelOwnerId: hotel.userId,
            hotelId: hotel.id,
            roomId: room.id,
            startDate: date.from,
            endDate: date.to,
            breakFastIncluded: includeBreakFast,
            totalPrice,
          },
          payment_intent_id: paymentIntentId,
        }),
      })
        .then((res) => {
          setBookingIsLoading(false);
          if (res.status === 401) {
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
    } else {
      toast({
        variant: 'destructive',
        description: 'Bạn phải chọn ngày đặt phòng',
      });
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="apsect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={room.image}
            alt={room.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-sm">
          <AmenityItem>
            <Bed className="w-4 h-4" />
            {room.bedCount} giường
          </AmenityItem>
          <AmenityItem>
            <Users className="w-4 h-4" />
            {room.guestCount} người
          </AmenityItem>
          <AmenityItem>
            <Bed className="w-4 h-4" />
            {room.bathroomCount} phòng tắm
          </AmenityItem>
          {!!room.singleBed && (
            <AmenityItem>
              <Bed className="w-4 h-4" />
              {room.singleBed} giường đơn
            </AmenityItem>
          )}
          {!!room.doubleBed && (
            <AmenityItem>
              <BedDouble className="w-4 h-4" />
              {room.doubleBed} giường đôi
            </AmenityItem>
          )}
        </div>
        <Separator />
        <div className="flex flex-wrap gap-4 justify-between">
          <div>
            Giá phòng:{' '}
            <span className="font-bold">
              <PriceDisplay price={room.roomPrice} />
            </span>{' '}
            <span className="text-xs">/ngày</span>
          </div>
          {!!room.breakFastPrice && (
            <div>
              Giá bữa sáng:{' '}
              <span className="font-bold">
                {formatCurrency(room.breakFastPrice)}
              </span>
            </div>
          )}
        </div>
        <Separator />
      </CardContent>
      <CardFooter>
        {isHotelDetailsPage ? (
          <div className="flex flex-col gap-6">
            <div>
              <div className="mb-2">Chọn ngày đặt phòng</div>
              <DatePickerWithRange date={date} setDate={setDate} />
            </div>
            {room.breakFastPrice > 0 && (
              <div>
                <div className="mb-2">Bạn có muốn thêm bữa sáng không?</div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="breakFast"
                    onCheckedChange={(value) => setIncludeBreakFast(!value)}
                  />
                  <Label htmlFor="breakFast">Bao gồm bữa sáng</Label>
                </div>
              </div>
            )}
            <div>
              Tổng:{' '}
              <span>
                {' '}
                <PriceDisplay price={totalPrice} />{' '}
              </span>
              cho <span>{days} ngày</span>
            </div>
            <Button
              disabled={bookingIsLoading}
              type="button"
              onClick={() => handleBookRoom()}
            >
              {bookingIsLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang đặt phòng
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Đặt phòng
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex w-full justify-between">
            <Button
              disabled={isLoading}
              type="button"
              variant="danger"
              onClick={() => handleDeleteRoom(room)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xoá
                </>
              ) : (
                <>
                  <Trash className="w-4 h-4 mr-2" /> Xoá
                </>
              )}
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <Button type="button" variant="info" className="max-w-[150px]">
                  <Pencil className="mr-2 h-4 w-4" /> Cập nhật phòng
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[900px] w-[90%]">
                <DialogHeader className="px-2">
                  <DialogTitle>Cập nhật phòng</DialogTitle>
                  <DialogDescription>
                    Cập nhật về phòng của khách sạn
                  </DialogDescription>
                </DialogHeader>
                <AddRoomForm
                  hotel={hotel}
                  room={room}
                  handleDialogueOpen={handleDialogueOpen}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
