import prismadb from '@/lib/prismadb';

export const getHotelById = async (hotelId: string) => {
  try {
    const hotel = await prismadb.hotel.findUnique({
      where: {
        id: hotelId,
      },
      include: {
        room: true,
      },
    });
    if (!hotel) return null;
    return hotel;
  } catch (error: any) {}
};
