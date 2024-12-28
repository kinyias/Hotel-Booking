import prismadb from '@/lib/prismadb';

export const getHotel = async (searchParams: {
  title: string;
  city: string;
}) => {
  try {
    const { title, city } = searchParams;

    const hotel = await prismadb.hotel.findMany({
      where: {
        title: {
          contains: title,
        },
        city,
      },
      include: {
        room:{
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
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
