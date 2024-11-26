import { getHotel } from '@/actions/getHotel';
import HotelList from '@/components/hotel/HotelList';

interface HomeProps {
  searchParams: {
    title: string;
    city: string;
  };
}
export default async function Home({ searchParams }: HomeProps) {
  const hotel = await getHotel(searchParams);

  if (!hotel) return <div>Không tìm thấy khách sạn...</div>;
  return (
    <div>
      <HotelList hotel={hotel} />
    </div>
  );
}
