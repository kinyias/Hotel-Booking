import prismadb from '@/lib/prismadb';

export const getHotel = async () => {
  try {

    const hotel = await prismadb.hotel.findMany({
      skip:0,
      take:3,
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
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
