import { getHotelsByUserId } from "@/actions/getHotelsbyUserId";
import HotelList from "@/components/hotel/HotelList";
import { auth } from "@clerk/nextjs/server";

const  MyHotels = async () => {
    const hotels = await getHotelsByUserId();
    const {userId} = await auth();
    console.log(userId)
    if(!hotels) return <div>Chưa có khách sạn nào {userId}</div>
    return ( <div>
    <h2 className="text-2xl font-semibold">Khách sạn của bạn</h2>
    <HotelList hotel={hotels}/>
    </div> );
}
 
export default MyHotels;