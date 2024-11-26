'use client';
import { usePathname, useRouter } from 'next/navigation';
import { HotelWithRoom } from './AddHotelForm';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import AmenityItem from '../AmenityItem';
import { MapPin, Waves } from 'lucide-react';
import useLocation from '@/hooks/useLocation';
import { Button } from '../ui/button';

const HotelCard = ({ hotel }: { hotel: HotelWithRoom }) => {
  const pathname = usePathname();
  const isMyHotel = pathname.includes('/my-hotel');
  const router = useRouter();

  const { getCityByCode, getDistByCode } = useLocation();
  const city = getCityByCode(hotel.city);
  const district = getDistByCode(hotel.district);
  if (hotel.room.length === 0) return;
  return (
    <div
      onClick={() => !isMyHotel && router.push(`/hotel-details/${hotel.id}`)}
      className={cn(
        'col-span-1 cursor-pointer trasition hover:scale-105',
        isMyHotel && 'cursor-default'
      )}
    >
      <div className="flex gap-2 bg-background/50 border border-primary.10 rounded-lg">
        <div className="flex-1 aspect-square overflow-hidden relative w-full h-[210px] rounded-s-lg">
          <Image
            fill
            src={hotel.image}
            alt={hotel.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between h-[210px] gap-1 p-1 py-2 text-sm">
          <h3 className="font-semibold text-xl">{hotel.title}</h3>
          <div className="text-primary/90">
            {hotel.description.substring(0, 45)}...
          </div>
          <div className="text-primary/90">
            <AmenityItem>
              <MapPin className="w-4 h-4" /> {city?.name}, {district?.name}
            </AmenityItem>
            <AmenityItem>
              <Waves className="w-4 h-4" /> Pool
            </AmenityItem>
            <AmenityItem>
              <Waves className="w-4 h-4" /> Pool
            </AmenityItem>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              {hotel?.room[0].roomPrice && (
                <>
                  <div className="font-semibold text-base">
                    {hotel?.room[0].roomPrice} VND
                  </div>
                  <div className="text-xs">/ngày</div>
                </>
              )}
            </div>
            {isMyHotel && (
              <Button
                onClick={() => router.push(`/hotel/${hotel.id}`)}
                variant="info"
              >
                Sửa
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
