
import NewsList from '@/components/news/NewsList';
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
  PaginationItem,
  PaginationContent,
} from '@/components/ui/pagination';

import axios from 'axios';


interface NewsPageProps {
  params: {
    page: string;
  };
}
const News = async ({ params }: NewsPageProps) => {

 
  const page = parseInt(params.page) || 1; 
//   const total_result = await getTotalNews();
//   const total =
//     typeof total_result === 'number' ? total_result : total_result._count.id;
  const { data: news } = await axios.get(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/news?page=${page}`
  );
//   const total_page = Math.ceil(total/6);
  if (!news) return <div>Chưa có tin tức nào</div>;
  return (
    <div>
      <h2 className="text-2xl font-semibold py-3">Tin tức mới nhất {}</h2>
      <NewsList news={news} />
      <Pagination>
        <PaginationContent>
          <PaginationItem className={page == 1 ? 'hidden' : ''}>
            <PaginationPrevious href={'/news?page=' + (page - 1)} />
          </PaginationItem>
          {/* {[...Array(total_page)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink 
                  href={`/news?page=${pageNumber}`} 
                  isActive={page === pageNumber}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })} */}
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default News;
