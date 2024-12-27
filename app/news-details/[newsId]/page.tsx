
import NewsDetailsClient from '@/components/news/NewsDetailsClient';
import axios from 'axios';

interface NewsDetailsProps {
  params: {
    newsId: string;
  };
}

const NewsDetails = async ({ params }: NewsDetailsProps) => {
  const { data: news } = await axios.get(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/news/${params.newsId}`
  );
  if (!news) return <div>Opp! Không tìm thấy tin tức</div>;
  return (
    <div>
      <NewsDetailsClient news={news} />
    </div>
  );
};

export default NewsDetails;
