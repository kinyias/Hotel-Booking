import { getHotel } from '@/actions/getHotel';
import Hero from '@/components/Hero';
import HeroFeature from '@/components/HeroFeature';
import HotelList from '@/components/hotel/HotelList';
import SearchForm from '@/components/hotel/SearchForm';
import NewsList from '@/components/news/NewsList';

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
      <Hero/>
      <SearchForm/>
      <HeroFeature/>
      <h2 className="text-3xl font-bold mb-6">Những khách sạn nổi bật</h2>
      <HotelList hotel={hotel} />
      <NewsList/>
    </div>
  );
}
