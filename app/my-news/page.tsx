import { auth } from '@clerk/nextjs/server';
import NewsList from '@/components/news/NewsList';
import { getNewsByUserId } from '@/actions/getNews';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const MyNews = async () => {
  const { userId } = await auth();
  if (!userId) return <div>Not Authenticated</div>;
  const news = await getNewsByUserId(userId);
  if (!news || !news.length)
    return (
      <div>
        <h2 className="text-2xl font-semibold py-3">Tin tức của bạn</h2>
        <Link href={'/my-news/new'}>
          <Button className="max-w-[150px] mb-2" variant="success">
            Thêm tin tức
          </Button>
        </Link>
        <br />
        Chưa có tin tức nào
      </div>
    );
  return (
    <div>
      <h2 className="text-2xl font-semibold py-3">Tin tức của bạn</h2>
      <Link href={'/my-news/new'}>
        <Button className="max-w-[150px] mb-2" variant="success">
          Thêm tin tức
        </Button>
      </Link>
      <NewsList news={news} />
    </div>
  );
};

export default MyNews;
