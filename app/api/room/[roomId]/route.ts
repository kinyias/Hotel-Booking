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

    const room = await prismadb.room.update({
      where: {
        id: params.roomId,
      },
      data: {
        ...body,
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
