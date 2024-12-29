import prismadb from '@/lib/prismadb';

export const getHotelById = async (hotelId: string) => {
  try {
    const hotel = await prismadb.hotel.findUnique({
      where: {
        id: hotelId,
      },
      include: {
        HotelAmenity: {
          include: {
            Amenity: true,
          },
          where: {
            amenityId: { not: undefined },
          },
        },
        room: {
          include: {
            Pax: true,
            RoomAmenity: true,
            SeasonPricing: true,
            RoomType: {
              select: {
                name: true,
              },
            },
            RoomRate: {
              select: {
                name: true,
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
