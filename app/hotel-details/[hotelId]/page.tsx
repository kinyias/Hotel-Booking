import { getHotelById } from "@/actions/getHotelById";
import HotelDetailsClient from "@/components/hotel/HotelDetailsClient";

interface HotelDetailsProps{
    params:{
        hotelId: string
    }
}

const HotelDetails = async ({params}: HotelDetailsProps) => {
    const hotel = await getHotelById(params.hotelId)
    if(!hotel) return <div>Opp! Không tìm thấy khách sạn</div>
    return ( <div>
        <HotelDetailsClient hotel={hotel} />
    </div>  );
}
 
export default HotelDetails;