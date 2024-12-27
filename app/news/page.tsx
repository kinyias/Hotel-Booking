'use client';

import { useSearchParams } from 'next/navigation';
import NewsList from '@/components/news/NewsList';
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
  PaginationItem,
  PaginationContent,
  PaginationLink,
} from '@/components/ui/pagination';

import axios from 'axios';
import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/layout/loading-spinner';
import Link from 'next/link';

const News = () => {
  const searchParams = useSearchParams();
  const [news, setNews] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setisLoading] = useState(false);

  const page = searchParams.get('page') || '1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setisLoading(true);
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/news?page=${page}`
        );
        setNews(data.news);
        setTotalPage(data.total_page);
        setisLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [page]);
  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <h2 className="text-2xl font-semibold py-3">Tin tức mới nhất</h2>
          <NewsList news={news} />
          <Pagination>
            <PaginationContent>
              <Link href={'/news?page=' + (parseInt(page) - 1)}>
                <PaginationItem className={parseInt(page) == 1 ? 'hidden' : ''}>
                  <PaginationPrevious />
                </PaginationItem>
              </Link>
              {[...Array(totalPage)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <Link key={index} href={`/news?page=${pageNumber}`}>
                    <PaginationItem key={pageNumber}>
                      <PaginationLink isActive={parseInt(page) === pageNumber}>
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  </Link>
                );
              })}
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default News;
