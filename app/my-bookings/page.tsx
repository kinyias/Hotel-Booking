import { getBookingsByHotelOwnerId } from "@/actions/getBookingsByHotelOwnerId";
import { getBookingsByUserId } from "@/actions/getBookingsByUserId";
import MyBookingClient from "@/components/booking/MyBookingClient";

const MyBookings = async () => {
    const bookingsFromVisitors = await getBookingsByHotelOwnerId()
    const bookingsHaveMade = await getBookingsByUserId()

    if(!bookingsFromVisitors?.length && !bookingsHaveMade?.length) return <div>Chưa có đặt phòng nào</div>
    return ( <div className="flex flex-col gap-10">
        {!!bookingsHaveMade?.length && <div>
            <h2 className="text-xel md:text-2xl font-semibold mb-6 mt-2">Đây là những đơn đặt phòng của bạn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {bookingsHaveMade.map(booking => <MyBookingClient key={booking.id} booking={booking}/>)}
            </div>
            </div>}
        {!!bookingsFromVisitors?.length && <div>
            <h2 className="text-xel md:text-2xl font-semibold mb-6 mt-2">Đây là những đơn đặt phòng của khách hàng của bạn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {bookingsFromVisitors.map(booking => <MyBookingClient key={booking.id} booking={booking}/>)}
            </div>
            </div>}
    </div> );
}
 
export default MyBookings;