import { IRoom } from '@/components/room/AddRoomForm';
import { Room } from '@prisma/client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface BookRoomStore {
  bookingRoomData: RoomDataType | null;
  paymentIntentId: string | null;
  clientSerect: string | undefined;
  setRoomData: (data: RoomDataType) => void;
  setPaymentIntentId: (paymentIntentId: string) => void;
  setClientSecret: (clientSerect: string) => void;
  resetBookRoom: () => void;
}

type RoomDataType = {
  room: IRoom;
  totalPrice: number;
  breakFastIncluded: boolean;
  startDate: Date;
  endDate: Date;
};

const useBookRoom = create<BookRoomStore>()(
  persist(
    (set) => ({
      bookingRoomData: null,
      paymentIntentId: null,
      clientSerect: undefined,
      setRoomData: (data: RoomDataType) => {
        set({ bookingRoomData: data });
      },
      setPaymentIntentId: (paymentIntentId: string) => {
        set({ paymentIntentId });
      },
      setClientSecret: (clientSerect: string) => {
        set({ clientSerect });
      },
      resetBookRoom: () => {
        set({
          bookingRoomData: null,
          paymentIntentId: null,
          clientSerect: undefined,
        });
      },
    }),
    {
      name: 'BookRoom',
    }
  )
);

export default useBookRoom;
