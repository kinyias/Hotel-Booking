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
        room: true,
      },
    });
    return hotel;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
