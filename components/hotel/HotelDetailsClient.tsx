'use client';

import { Booking } from '@prisma/client';
import { HotelWithRoom } from './AddHotelForm';
import useLocation from '@/hooks/useLocation';
import Image from 'next/image';
import AmenityItem from '../AmenityItem';
import { MapPin, ShowerHead, Wifi } from 'lucide-react';
import RoomCard from '../room/RoomCard';

const HotelDetailsClient = ({
  hotel,
  bookings,
}: {
  hotel: HotelWithRoom;
  bookings?: Booking[];
}) => {
  const { getCityByCode, getDistByCode } = useLocation();
  const city = getCityByCode(hotel.city);
  const district = getDistByCode(hotel.district);
  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="aspect-square overflow-hidden relative w-full h-[200px] md:h-[400px] rounded-lg">
        <Image
          fill
          src={hotel.image}
          alt={hotel.title}
          className="object-cover"
        />
      </div>
      <div>
        <h3 className="font-semibold text-xl md:text-3xl pb-2">
          {hotel.title}
        </h3>
        <AmenityItem>
          <MapPin className="w-4 h-4" /> {city?.name}, {district?.name}
        </AmenityItem>
        <h3 className="font-semibold text-lg mt-4 mb-2">Địa chỉ chi tiết</h3>
        <p className="text-primary/90 mb-2">{hotel.locationDescription}</p>
        <h3 className="font-semibold text-lg mt-4 mb-2">Thông tin khách sạn</h3>
        <p className="text-primary/90 mb-2">{hotel.description}</p>
        <h3 className="font-semibold text-lg mt-4 mb-2">
          Tiện nghi của khách sạn
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 content-start text-sm">
          <AmenityItem>
            <Wifi className="w-4 h-4" /> Wifi
          </AmenityItem>
          <AmenityItem>
            <ShowerHead className="w-4 h-4" /> Shower
          </AmenityItem>
        </div>
      </div>
      {!!hotel.room.length && (
        <div>
          <h3 className="text-lg font-semibold my-4">Phòng</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {hotel.room.map((room) => {
              return (
                <RoomCard
                  hotel={hotel}
                  room={room}
                  key={room.id}
                  bookings={bookings}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetailsClient;
