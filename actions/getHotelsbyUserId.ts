import prismadb from '@/lib/prismadb';
import { useAuth } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

export const getHotelsByUserId = async () => {
  try {
    const { userId } = await auth();
    console.log(userId);
    if (!userId) {
      throw new Error('Unauthorize');
    }
    const hotel = await prismadb.hotel.findMany({
      where: {
        userId: userId,
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
    if (!hotel) return null;
    return hotel;
  } catch (error: any) {}
};
