import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';

export const getBookingsByUserId = async () => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const bookings = await prismadb.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        Room: {
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
        Hotel: true,
      },
      orderBy: {
        bookedAt: 'desc',
      },
    });
    if (!bookings) return null;
    return bookings;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
