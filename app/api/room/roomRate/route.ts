import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
      const roomType = await prismadb.roomRate.findMany();
      return NextResponse.json(roomType);
    } catch (error) {
      console.log('Error at /api/roomType GET', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }
