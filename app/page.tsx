import { getHotel } from '@/actions/getHotel';
import { getNews } from '@/actions/getNews';
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
  const news =  await getNews();
  if (!hotel) return <div>Không tìm thấy khách sạn...</div>;
  return (
    <div>
      <Hero/>
      <SearchForm/>
      <HeroFeature/>
      <h2 className="text-3xl font-bold mb-6">Những khách sạn nổi bật</h2>
      <HotelList hotel={hotel} />
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">Tin tức mới</h2>
        <NewsList news={news}/>
        </div>
      </section> 
    </div>
  );
}
