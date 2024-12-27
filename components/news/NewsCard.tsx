'use client';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import Link from 'next/link';
import { Button } from '../ui/button';
import { News } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2, PencilLine, Trash } from 'lucide-react';
import axios from 'axios';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
const NewsCard = ({ news }: { news: News }) => {
  const pathname = usePathname();
  const isMyNews = pathname.includes('/my-news');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isNewsDeleting, setIsNewsDeleting] = useState(false);
  const { toast } = useToast();
  const handleDeleteNews = async (news: News) => {
    setIsNewsDeleting(true);
    const getImageKey = (src: string) =>
      src.substring(src.lastIndexOf('/') + 1);
    try {
      const imageKey = getImageKey(news.image);
      await axios.post('/api/uploadthing/delete', { imageKey });
      await axios
        .delete(`/api/news/${news.id}`)
        .then(() => {
          toast({
            variant: 'success',
            description: 'Xoá tin tức thành công',
          });
        })
        .catch((err) => {
          console.log(err)
          toast({
            variant: 'destructive',
            description: 'Đã xảy ra lỗi',
          });
          setIsLoading(false);
        });
        router.push('/my-news');
        setIsNewsDeleting(false);
    } catch (error: unknown) {
      // Type-checking to ensure error is an instance of Error before accessing message
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      setIsNewsDeleting(false);
      toast({
        variant: 'destructive',
        description: `Không thể xoá tin tức! ${errorMessage}`,
      });
    }
  };
  function removeTags(str: string) {
    if (str === null || str === '') return false;
    else str = str.toString();

    // Regular expression to identify HTML tags in
    // the input string. Replacing the identified
    // HTML tag with a null string.
    return str.replace(/(<([^>]+)>)/gi, '');
  }
  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="p-0">
          <Image
            src={news.image}
            alt={news.title}
            width={400}
            height={200}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </CardHeader>
        <CardContent className="p-6 flex-grow">
          <h3 className="text-xl font-semibold mb-2 truncate">{news.title}</h3>
          <p className="text-gray-600 mb-4 truncate prose prose-sm">
            {removeTags(news.content)}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <time dateTime={new Date(news.createdDate).toISOString()}>
            {new Date(news.createdDate).toLocaleDateString('vi-VN')}
            </time>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          {!isMyNews && (
            <Link href={'/news-details/' + news.id}>
              <Button variant="outline">Xem chi tiết</Button>
            </Link>
          )}
          {isMyNews && (
            <div className="flex justify-end w-full">
              <Button
                onClick={() => router.push(`/my-news/${news.id}`)}
                variant="info"
              >
                <PencilLine className="mr-2 h-4 w-4" />
                Sửa
              </Button>
              <Button
                onClick={() => handleDeleteNews(news)}
                variant="danger"
                type="button"
                className="ml-2 max-w-[150px]"
                disabled={isNewsDeleting || isLoading}
              >
                {isNewsDeleting ? (
                  <>
                    <Loader2 className=" h-4 w-4" /> Xoá
                  </>
                ) : (
                  <>
                    <Trash className="h-4 w-4" /> Xoá
                  </>
                )}
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default NewsCard;
