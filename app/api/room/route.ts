import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { Pax, RoomAmenity, roomTypeId, roomRateId, hotelId, ...data } = body;
    const room = await prismadb.room.create({
      data: {
        ...data,
        Hotel:{
          connect: {
            id: hotelId, // Use the RoomRate ID
          },
        },
        RoomAmenity: {
          create: RoomAmenity.map((amenity: { amenityId: string }) => ({
            amenityId: amenity.amenityId,
          })),
        },
        RoomType: {
          connect: {
            id: roomTypeId, // Use the RoomType ID
          },
        },
        RoomRate: {
          connect: {
            id: roomRateId, // Use the RoomRate ID
          },
        },
        Pax: {
          create: {
            maxAdults: Pax[0].maxAdults,
            maxChildren: Pax[0].maxChildren,
            maxInfants: Pax[0].maxInfants,
          },
        },
      },
    });
    return NextResponse.json(room);
  } catch (error) {
    console.log('Error at /api/room POST', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
