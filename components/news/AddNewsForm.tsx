'use client';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { News } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Eye, Trash, XCircle, PencilLine, Loader2, Pencil } from 'lucide-react';
import { UploadButton } from '../uploadthing';
import Tiptap from '../editor/TipTap';
interface NewsFormProps {
  news: News | null | undefined;
}
const formSchema = z.object({
  title: z.string().min(3, {
    message: 'Tiêu đề phải có ít nhất 3 kí tự',
  }),
  content: z.string().min(10, {
    message: 'Nội dung phải có ít nhát 10 kí tự',
  }),
  image: z.string().min(1, {
    message: 'Yêu cầu có hình ảnh',
  }),
});
const AddNewsForm = ({ news }: NewsFormProps) => {
  const [image, setImage] = useState<string | undefined>(news?.image);
  const [imageIsDeleting, setImageIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewsDeleting, setIsNewsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: news || {
      title: '',
      content: '',
      image: '',
    },
  });
  useEffect(() => {
    if (typeof image == 'string') {
      form.setValue('image', image, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [image]);
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (news) {
      //update
      axios
        .patch(`/api/news/${news.id}`, values)
        .then((res) => {
          toast({
            variant: 'success',
            description: 'Cập nhật tin tức thành công',
          });
          router.push(`/my-news/${res.data.id}`);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toast({
            variant: 'destructive',
            description: 'Đã xảy ra lỗi',
          });
          setIsLoading(false);
        });
    } else {
      //create
      axios
        .post('/api/news', values)
        .then((res) => {
          toast({
            variant: 'success',
            description: 'Thêm mới tin tức thành công',
          });
          router.push(`/my-news/${res.data.id}`);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err)
          toast({
            variant: 'destructive',
            description: 'Đã xảy ra lỗi',
          });
          setIsLoading(false);
        });
    }
  }
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
      setIsNewsDeleting(false);
      router.push('/my-news/new');
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

  const handleImageDelete = (image: string) => {
    setImageIsDeleting(true);
    const imageKey = image.substring(image.lastIndexOf('/') + 1);

    axios
      .post('/api/uploadthing/delete', { imageKey })
      .then((res) => {
        if (res.data.success) {
          setImage('');
          toast({
            variant: 'success',
            description: 'Đã xoá hình ảnh',
          });
        }
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          description: 'Xảy ra lỗi',
        });
      })
      .finally(() => {
        setImageIsDeleting(false);
      });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <h3 className="text-lg font-semibold mt-4">
            {news ? 'Cập nhật tin tức' : 'Tạo tin tức mới'}
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đê tin tức *</FormLabel>
                    <FormDescription>Tiêu đề tin tức của bạn</FormDescription>
                    <FormControl>
                      <Input placeholder="Tiều đề tin tức" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung *</FormLabel>
                    <FormDescription>Nội dung tin tức của bạn</FormDescription>
                    <FormControl>
                      {/* <Textarea placeholder="Nội dung" {...field} /> */}
                      <Tiptap
                        description={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem className="flex flex-col space-y-3">
                    <FormLabel>Tải ảnh lên *</FormLabel>
                    <FormDescription>
                      Chọn ảnh đại diện cho khách sạn của bạn
                    </FormDescription>
                    <FormControl>
                      {image ? (
                        <>
                          <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                            <Image
                              fill
                              src={image}
                              alt="Hotel image"
                              className="object-contain"
                            />
                            <Button
                              onClick={() => handleImageDelete(image)}
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="absolute right-[-12px] top-0"
                            >
                              {imageIsDeleting ? <Loader2 /> : <XCircle />}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col items-center max-w-[400px] p-12 border-2 border-dashed border-primary/50 rounded mt-4">
                            <UploadButton
                              endpoint="imageUploader"
                              onClientUploadComplete={(res) => {
                                // Do something with the response
                                console.log('Files: ', res);
                                setImage(res[0].url);
                                toast({
                                  variant: 'success',
                                  description: '✅ TẢI LÊN THÀNH CÔNG',
                                });
                              }}
                              onUploadError={(error: Error) => {
                                // Do something with the error.
                                toast({
                                  variant: 'destructive',
                                  description: `❌ LỖI!!! TẢI LÊN THẤT BẠI ${error.message}`,
                                });
                              }}
                            />
                          </div>
                        </>
                      )}
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-between md:justify-start gap-2 flex-wrap">
                {news && (
                  <Button
                    onClick={() => handleDeleteNews(news)}
                    variant="danger"
                    type="button"
                    className="max-w-[150px]"
                    disabled={isNewsDeleting || isLoading}
                  >
                    {isNewsDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4" /> Xoá
                      </>
                    ) : (
                      <>
                        <Trash className="mr-2 h-4 w-4" /> Xoá
                      </>
                    )}
                  </Button>
                )}
                {news && (
                  <Button
                    onClick={() => router.push(`/news-details/${news.id}`)}
                    variant="outline"
                    type="button"
                  >
                    <Eye className="mr-2 h-4 w-4" /> View
                  </Button>
                )}

                {news ? (
                  <Button
                    className="max-w-[150px]"
                    variant="info"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4" /> Đang cập nhật
                      </>
                    ) : (
                      <>
                        <PencilLine className="mr-2 h-4 w-4" />
                        Cập nhật
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    className="max-w-[150px]"
                    variant="success"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4" /> Đang tạo
                      </>
                    ) : (
                      <>
                        <Pencil
                          className="mr-2 h-4 
                      w-4"
                        />{' '}
                        Thêm tin tức
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddNewsForm;
