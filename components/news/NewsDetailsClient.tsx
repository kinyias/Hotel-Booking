import { News } from '@prisma/client';
import Image from 'next/image';

const NewsDetailsClient = ({ news }: { news: News }) => {
  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="aspect-square overflow-hidden relative w-full h-[200px] md:h-[400px] rounded-lg">
        <Image
          fill
          src={news.image}
          alt={news.title}
          className="object-cover"
        />
      </div>
      <div>
        <h3 className="font-semibold text-xl md:text-3xl pb-2">{news.title}</h3>
        <p
          className="text-primary/90 mb-2"
          dangerouslySetInnerHTML={{ __html: news.content }}
        ></p>
      </div>
    </div>
  );
};

export default NewsDetailsClient;
