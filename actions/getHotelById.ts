import prismadb from '@/lib/prismadb';

export const getHotelById = async (hotelId: string) => {
  try {
    const hotel = await prismadb.hotels.findUnique({
      where: {
        id: hotelId,
      },
      include: {
        rooms: true,
      },
    });
    if (!hotel) return null;
    return hotel;
  } catch (error: any) {}
};
