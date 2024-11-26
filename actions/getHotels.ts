import prismadb from '@/lib/prismadb';

export const getHotels = async (searchParams: {
  title: string;
  city: string;
}) => {
  try {
    const { title, city } = searchParams;

    const hotels = await prismadb.hotels.findMany({
      where: {
        title: {
          contains: title,
        },
        city,
      },
      include: {
        rooms: true,
      },
    });
    return hotels;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
