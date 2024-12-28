import prismadb from '@/lib/prismadb';

export const getHotelById = async (hotelId: string) => {
  try {
    const hotel = await prismadb.hotel.findUnique({
      where: {
        id: hotelId,
      },
      include: {
        room: {
          include: {
            Pax: true,
            RoomAmenity: true,
            SeasonPricing: true,
            RoomType: {
              select: {
                name: true, // Fetch RoomType name
              },
            },
            RoomRate: {
              select: {
                name: true, // Fetch RoomRate name
              },
            },
          },
        },
      },
    });
    return hotel;
  } catch (error) {
    return null;
  }
};
