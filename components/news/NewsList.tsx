import NewsCard from './NewsCard';
import { News } from '@prisma/client';

const NewsList = ({ news }: { news: News[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
     {news.map((news) => (
        <div key={news.id}>
          <NewsCard news={news} />
        </div>
      ))}
    </div>
  );
};

export default NewsList;
