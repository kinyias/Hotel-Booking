import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const roomRate = await prismadb.roomRate.findMany();
    const roomType = await prismadb.roomType.findMany();
    return NextResponse.json({ roomType, roomRate });
  } catch (error) {
    console.log('Error at /api/roomType GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
