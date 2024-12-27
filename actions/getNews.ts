import prismadb from '@/lib/prismadb';

export const getNews = async () => {
  try {
    const news = await prismadb.news.findMany({
      skip: 0,
      take: 3,
    });
    return news;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const getNewsByUserId = async (userId:string) => {
    try {
      const news = await prismadb.news.findMany({
        where:{
            userId
        }
      });
      if(!news) return null;
      return news;
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  };

  export const getTotalNews = async () => {
    try {
      const count = await prismadb.news.aggregate({
        _count: {
          id: true,
        },
      });
      if(!count) return 1;
      return count;
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  };