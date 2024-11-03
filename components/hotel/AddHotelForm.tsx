'use client';

import * as z from 'zod';
import { Hotels, Rooms } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { UploadButton } from '../uploadthing';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Loader2, XCircle } from 'lucide-react';
import axios from 'axios';
import userLocation from '@/hooks/userLocation';
import { IDistricts } from 'vn-provinces';
interface AddHotelFormProps {
  hotel: HotelWithRooms | null | undefined;
}
export type HotelWithRooms = Hotels & {
  rooms: Rooms[];
};

const formSchema = z.object({
  title: z.string().min(3, {
    message: 'Tiêu đề phải có ít nhất 3 kí tự',
  }),
  description: z.string().min(10, {
    message: 'Mô tả phải có ít nhát 10 kí tự',
  }),
  image: z.string().min(1, {
    message: 'Yêu cầu có hình ảnh',
  }),
  city: z.string().optional(),
  district: z.string().optional(),
  googleMapAdress: z.string().optional(),
  locationDescription: z.string().min(10, {
    message: 'Mô tả địa chỉ phải có ít nhát 10 kí tự',
  }),
});

const AddHotelForm = ({ hotel }: AddHotelFormProps) => {
  const [image, setImage] = useState<string | undefined>(hotel?.image);
  const [imageIsDeleting, setImageIsDeleting] = useState(false);
  const [districts, setDistricts] = useState<IDistricts[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const { getAllCities, getAllDistricsByProvinceCode } = userLocation();
  const cities = getAllCities();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
      city: '',
      district: '',
      googleMapAdress: '',
      locationDescription: '',
    },
  });

  useEffect(() => {
    const selectedCity = form.watch('city') ?? '';
    const cityDistricts = getAllDistricsByProvinceCode(selectedCity);
    if (cityDistricts) {
      setDistricts(cityDistricts);
    }
  }, [form.watch('city')]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <h3 className="text-lg font-semibold">
            {hotel ? 'Cập nhật khách sạn' : 'Tạo khách sạn mới'}
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-6">
          <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên khách sạn</FormLabel>
                    <FormDescription>Tên khách sạn của bạn</FormDescription>
                    <FormControl>
                      <Input placeholder="Khách sạn Siris" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả khách sạn</FormLabel>
                    <FormDescription>Mô tả khách sạn của bạn</FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Khách sạn Siris sang trọng giá cả phải chăng..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>Chọn tiện nghi</FormLabel>
                <FormDescription>
                  Chọn tiện nghi phổ biến ở khách sạn của bạn
                </FormDescription>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                        <FormControl>
                          <Checkbox />
                        </FormControl>
                        <FormLabel>Gym</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-3">
                    <FormLabel>Tải ảnh lên</FormLabel>
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
                                  description: `❌ LỖI!!! TẢI LÊN THẤT BẠI $`,
                                });
                              }}
                            />
                          </div>
                        </>
                      )}
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chọn TP</FormLabel>
                      <FormDescription>Chọn tên thành phố</FormDescription>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Chọn TP"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => {
                            return (
                              <SelectItem key={city.code} value={city.code}>
                                {city.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chọn Quận/Huyện</FormLabel>
                      <FormDescription>Chọn Quận/Huyện</FormDescription>
                      <Select
                        disabled={isLoading || districts.length< 1}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Chọn Quận/Huyện"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => {
                            return (
                              <SelectItem key={district.code} value={district.code}>
                                {district.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddHotelForm;
