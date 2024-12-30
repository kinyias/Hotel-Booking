import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = await auth();

    if (!params.roomId) {
      return new NextResponse('Room Id is required', { status: 400 });
    }

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { Pax, RoomAmenity, ...data } = body;
    const room = await prismadb.room.update({
      where: {
        id: params.roomId,
      },
      data: {
        ...data,
        RoomAmenity: {
          deleteMany: {}, // Clear existing amenities
          create: RoomAmenity.map((amenity: { amenityId: string }) => ({
            amenityId: amenity.amenityId,
          })),
        },
        Pax: {
          deleteMany: {},
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
    console.log('Error at /api/room/roomId PATCH', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const { userId } = await auth();

    if (!params.roomId) {
      return new NextResponse('Hotel Id is required', { status: 400 });
    }

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const room = await prismadb.room.delete({
      where: {
        id: params.roomId,
      },
    });
    return NextResponse.json(room);
  } catch (error) {
    console.log('Error at /api/hotel/roomId DELETE', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
