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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEffect, useState } from 'react';
import { UploadButton } from '../uploadthing';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Button } from '../ui/button';
import {
  Eye,
  Loader2,
  Pencil,
  PencilLine,
  Plus,
  Terminal,
  Trash,
  XCircle,
} from 'lucide-react';
import axios from 'axios';
import userLocation from '@/hooks/userLocation';
import { IDistricts } from 'vn-provinces';
import { useRouter } from 'next/navigation';
import AddRoomForm from '../room/AddRoomForm';
import RoomCard from '../room/RoomCard';
import { Separator } from '../ui/separator';
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
  googleMapAddress: z.string().optional(),
  locationDescription: z.string().min(10, {
    message: 'Mô tả địa chỉ phải có ít nhát 10 kí tự',
  }),
});

const AddHotelForm = ({ hotel }: AddHotelFormProps) => {
  const [image, setImage] = useState<string | undefined>(hotel?.image);
  const [imageIsDeleting, setImageIsDeleting] = useState(false);
  const [districts, setDistricts] = useState<IDistricts[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHotelDeleting, setIsHotelDeleting] = useState(false);
  const [open, setOpen] = useState(false)

  const { toast } = useToast();
  const router = useRouter();
  const { getAllCities, getAllDistricsByProvinceCode } = userLocation();
  const cities = getAllCities();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: hotel || {
      title: '',
      description: '',
      image: '',
      city: '',
      district: '',
      googleMapAddress: '',
      locationDescription: '',
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
  useEffect(() => {
    const selectedCity = form.watch('city') ?? '';
    const cityDistricts = getAllDistricsByProvinceCode(selectedCity);
    if (cityDistricts) {
      setDistricts(cityDistricts);
    }
  }, [form.watch('city')]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (hotel) {
      //update
      axios
        .patch(`/api/hotel/${hotel.id}`, values)
        .then((res) => {
          toast({
            variant: 'success',
            description: 'Cập nhật khách sạn thành công',
          });
          router.push(`/hotel/${res.data.id}`);
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
        .post('/api/hotel', values)
        .then((res) => {
          toast({
            variant: 'success',
            description: 'Thêm mới khách sạn thành công',
          });
          router.push(`/hotel/${res.data.id}`);
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
    }
  }

  const handleDeleteHotel = async (hotel: HotelWithRooms) => {
    setIsHotelDeleting(true);
    const getImageKey = (src: string) =>
      src.substring(src.lastIndexOf('/') + 1);
    try {
      const imageKey = getImageKey(hotel.image);
      await axios.post('/api/uploadthing/delete', { imageKey });
      setIsHotelDeleting(false);
      toast({
        variant: 'success',
        description: 'Khách sạn đã được xoá thành công',
      });
      router.push('/hotel/new');
    } catch (error: unknown) {
       // Type-checking to ensure error is an instance of Error before accessing message
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setIsHotelDeleting(false);
      toast({
        variant: 'destructive',
        description: `Không thể xoá khách sạn! ${errorMessage}`,
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

const handleDialogueOpen = () =>{
  setOpen(prev=>!prev)
}

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
                    <FormLabel>Tên khách sạn *</FormLabel>
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
                    <FormLabel>Mô tả khách sạn *</FormLabel>
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
                  {/* <FormField
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
                  /> */}
                </div>
              </div>
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
                        disabled={isLoading || districts.length < 1}
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
                              <SelectItem
                                key={district.code}
                                value={district.code}
                              >
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
              <FormField
                control={form.control}
                name="locationDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả địa chỉ khách sạn *</FormLabel>
                    <FormDescription>
                      Mô tả địa chỉ khách sạn của bạn
                    </FormDescription>
                    <FormControl>
                      <Input
                        placeholder="466 Phạm Thái Bường, Quận 7, Quận 7, Tp. Hồ Chí Minh"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="googleMapAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Iframe google map</FormLabel>
                    <FormDescription>
                      Địa chỉ khách sạn trên google map của bạn
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="<iframe src='https://www.google.com/maps/embed..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {hotel && !hotel.rooms.length && (
                <Alert className="bg-green-600 text-white">
                  <Terminal className="h-4 w-4 stroke-white" />
                  <AlertTitle>Bước cuối cùng!</AlertTitle>
                  <AlertDescription>
                    Khách sạn của bạn đã được thêm thành công
                    <div>
                      Xin vui lòng thêm phòng để hoàn thành thông tin khách sạn
                      của bạn!
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex justify-between md:justify-end gap-2 flex-wrap">
                {hotel && (
                  <Button
                    onClick={() => handleDeleteHotel(hotel)}
                    variant="danger"
                    type="button"
                    className="max-w-[150px]"
                    disabled={isHotelDeleting || isLoading}
                  >
                    {isHotelDeleting ? (
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
                {hotel && (
                  <Button
                    onClick={() => router.push(`/hotel-details/${hotel.id}`)}
                    variant="outline"
                    type="button"
                  >
                    <Eye className="mr-2 h-4 w-4" /> View
                  </Button>
                )}

                {hotel && 
                 <Dialog open={open} onOpenChange={setOpen}>
                 <DialogTrigger>
                  <Button type='button' variant='success' className='max-w-[150px]'>
                  <Plus className='mr-2 h-4 w-4'/> Thêm phòng
                  </Button>
                  </DialogTrigger>
                 <DialogContent className='max-w-[900px] w-[90%]'>
                   <DialogHeader className='px-2'>
                     <DialogTitle>Thêm phòng</DialogTitle>
                     <DialogDescription>
                       Thêm chi tiết về phòng của khách sạn
                     </DialogDescription>
                   </DialogHeader>
                    <AddRoomForm hotel={hotel} handleDialogueOpen={handleDialogueOpen}/>
                 </DialogContent>
               </Dialog>}
               

                {hotel ? (
                  <Button className="max-w-[150px]" variant='info' disabled={isLoading}>
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
                  <Button className="max-w-[150px]" variant='success' disabled={isLoading}>
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
                        Tạo khách sạn
                      </>
                    )}
                  </Button>
                )}
              </div>
              {hotel && hotel.rooms.length && <div>
                <Separator/>
                <h3 className='test-lg font-semibold my-4'>Phòng khách sạn</h3>
                <div className='grid gird-cols-1 2xl:grid-cols-2 gap-6'>
                  { 
                    hotel.rooms.map(room=>{
                      return <RoomCard key={room.id} hotel={{...hotel, rooms: hotel.rooms}} room={room}/>
                    })
                  }
                </div>
                </div>}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddHotelForm;
