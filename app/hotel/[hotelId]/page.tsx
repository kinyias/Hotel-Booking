import { getHotelById } from '@/actions/getHotelById';
import { auth } from '@clerk/nextjs/server';
import dynamic from 'next/dynamic';

const AddHotelForm = dynamic(() => import('@/components/hotel/AddHotelForm'), {
  ssr: false,
});
interface HotelPageProps {
  params: {
    hotelId: string;
  };
}
const Hotel = async ({ params }: HotelPageProps) => {
  const hotel = await getHotelById(params.hotelId);
  const { userId } = await auth();
  if (!userId) return <div>Not Authenticated</div>;

  if (hotel && hotel.userId !== userId) return <div>Access Denied</div>;
  return (
    <div>
      <AddHotelForm hotel={hotel} />
    </div>
  );
};

export default Hotel;
