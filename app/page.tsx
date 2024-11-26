import { getHotels } from "@/actions/getHotels";
import HotelList from "@/components/hotel/HotelList";

interface HomeProps{
  searchParams:{
    title: string,
    city: string
  }
}
export default async function Home({searchParams}: HomeProps) {
  const hotels = await getHotels(searchParams)

  if(!hotels) return <div>Không tìm thấy khách sạn...</div>
  return (
    <div>
     
    <HotelList hotels={hotels}/>
    </div>
  );
}
