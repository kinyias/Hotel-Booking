import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { Id: string } }
) {
  try {
    const { userId } = await auth();

    if (!params.Id) {
      return new NextResponse('Payment intent Id is required', { status: 400 });
    }

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const booking = await prismadb.booking.update({
      where: {
        paymentIntentId: params.Id,
      },
      data: {
        paymentStatus:true
      },
    });
    return NextResponse.json(booking);
  } catch (error) {
    console.log('Error at /api/booking/Id PATCH', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { Id: string } }
) {
  try {
    const { userId } = await auth();

    if (!params.Id) {
      return new NextResponse('Booking Id is required', { status: 400 });
    }

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const booking = await prismadb.booking.delete({
      where: {
        id: params.Id,
      },
    });
    return NextResponse.json(booking);
  } catch (error) {
    console.log('Error at /api/booking/Id DELETE', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
