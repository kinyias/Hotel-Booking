import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
export async function PATCH(
  req: Request,
  { params }: { params: { newsId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = await auth();

    if (!params.newsId) {
      return new NextResponse('News Id is required', { status: 400 });
    }

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const news = await prismadb.news.update({
      where: {
        id: params.newsId,
      },
      data: {
        ...body,
      },
    });
    return NextResponse.json(news);
  } catch (error) {
    console.log('Error at /api/news/newsId PATCH', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}


export async function GET(req: Request,{ params }: { params: { newsId: string } }) {
  try {
    if (!params.newsId) {
      return new NextResponse('News Id is required', { status: 400 });
    }
    console.log('Received params:', params); // Better debugging
    const news = await prismadb.news.findUnique({
      where: {
        id: params.newsId,
      },
    });
    return NextResponse.json(news);
  } catch (error) {
    console.log(error)
    return new NextResponse('Internal Error', { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { newsId: string } }
) {
  try {
    const { userId } = await auth();

    if (!params.newsId) {
      return new NextResponse('Hotel Id is required', { status: 400 });
    }

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const newsId = await prismadb.news.delete({
      where: {
        id: params.newsId,
      },
    });
    return NextResponse.json(newsId);
  } catch (error) {
    console.log('Error at /api/news/newsId DELETE', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}