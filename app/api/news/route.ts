import { getTotalNews } from '@/actions/getNews';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const news = await prismadb.news.create({
      data: {
        ...body,
        userId,
      },
    });
    return NextResponse.json(news);
  } catch (error) {
    console.log('Error at /api/news POST', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  console.log("serach", searchParams)
  const page = parseInt(searchParams.get('page') ?? '1');
  const result_per_page = 6;
  const total_result = await getTotalNews();
  const total =
  typeof total_result === 'number' ? total_result : total_result._count.id;
  const total_page = Math.ceil(total/6);
  const skip = (page - 1) * result_per_page;
  const take = page * result_per_page;
  console.log("skip", skip)
  console.log("take", take)
  try {
    const news = await prismadb.news.findMany({
      skip,
      take,
    });
    return NextResponse.json({news, total_result, total_page});
  } catch (error) {
    console.log('Error at /api/news GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
