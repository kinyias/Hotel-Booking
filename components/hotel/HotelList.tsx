import { HotelWithRoom } from './AddHotelForm';
import HotelCard from './HotelCard';

const HotelList = ({ hotel }: { hotel: HotelWithRoom[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-9 gap-y-12 mt-4">
      {hotel.map((hotel) => (
        <div key={hotel.id}>
          <HotelCard hotel={hotel} />
        </div>
      ))}
    </div>
  );
};

export default HotelList;
