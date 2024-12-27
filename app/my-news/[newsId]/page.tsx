
import { auth } from '@clerk/nextjs/server';
import axios from 'axios';
import dynamic from 'next/dynamic';

const AddNewsForm = dynamic(() => import('@/components/news/AddNewsForm'), {
  ssr: false,
});
interface NewsPageProps {
  params: {
    newsId: string;
  };
}
const NewsPage = async ({ params }: NewsPageProps) => {
  const { data: news } = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/news/${params.newsId}`);
  const { userId } = await auth();
  if (!userId) return <div>Not Authenticated</div>;

  if (news && news.userId !== userId) return <div>Access Denied</div>;
  return (
    <div>
      <AddNewsForm news={news} />
    </div>
  );
};

export default NewsPage;
