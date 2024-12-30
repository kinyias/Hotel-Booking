import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
      const amenity = await prismadb.amenity.findMany({
        where:{
            type: "Room"
        }
      });
      return NextResponse.json(amenity);
    } catch (error) {
      console.log('Error at /api/roomType GET', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }
