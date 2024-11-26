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
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Loader2, Pencil, PencilLine, XCircle } from 'lucide-react';
import axios from 'axios';
import { UploadButton } from '../uploadthing';
import { useRouter } from 'next/navigation';
import {
  formatNumber,
  parseCurrency,
} from '@/utils/formatCurrency';

interface AddHotelFormProps {
  hotel?: Hotels & {
    rooms: Rooms[];
  };
  room?: Rooms;
  handleDialogueOpen: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, {
    message: 'Tên phải có ít nhât 3 kí tự',
  }),
  description: z.string().min(10, {
    message: 'Mô tả phải có ít nhât 10 kí tự',
  }),
  bedCount: z.coerce.number().min(1, {
    message: 'Cần nhập số giường',
  }),
  guestCount: z.coerce.number().min(1, {
    message: 'Cần nhập số khách',
  }),
  bathroomCount: z.coerce.number().min(1, {
    message: 'Cần nhập số phòng tắm',
  }),
  singleBed: z.coerce.number().optional(),
  doubleBed: z.coerce.number().optional(),
  breakFastPrice: z.coerce.number().optional(),
  roomPrice: z.coerce.number().min(1, {
    message: 'Cần nhập giá phòng',
  }),
  image: z.string().min(1, {
    message: 'Cần thêm hình ảnh',
  }),
});

const AddRoomForm = ({
  hotel,
  room,
  handleDialogueOpen,
}: AddHotelFormProps) => {
  const [image, setImage] = useState<string | undefined>(room?.image);
  const [imageIsDeleting, setImageIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: room || {
      title: '',
      description: '',
      bedCount: 0,
      guestCount: 0,
      bathroomCount: 0,
      singleBed: 0,
      doubleBed: 0,
      breakFastPrice: 0,
      roomPrice: 0,
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
    if (hotel && room) {
      //update
      axios
        .patch(`/api/room/${room.id}`, values)
        .then(() => {
          toast({
            variant: 'success',
            description: 'Cập nhật phòng thành công',
          });
          router.refresh();
          setIsLoading(false);
          handleDialogueOpen();
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
      if (!hotel) return;
      axios
        .post('/api/room', { ...values, hotelId: hotel.id })
        .then(() => {
          toast({
            variant: 'success',
            description: 'Thêm mới phòng thành công',
          });
          router.refresh();
          setIsLoading(false);
          handleDialogueOpen();
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
    <div className="max-h-[75vh] overflow-y-auto px-2">
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên phòng *</FormLabel>
                <FormDescription>Tên phòng của bạn</FormDescription>
                <FormControl>
                  <Input placeholder="Phòng đôi" {...field} />
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
                <FormLabel>Mô tả phòng *</FormLabel>
                <FormDescription>Mô tả phòng của bạn</FormDescription>
                <FormControl>
                  <Input placeholder="Phòng có view biển..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormLabel>Chọn tiện nghi</FormLabel>
            <FormDescription>Chọn tiện nghi cho phòng của bạn</FormDescription>
            <div className="grid grid-cols-2 gap-2 mt-2"></div>
          </div>
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem className="flex flex-col space-y-3">
                <FormLabel>Tải ảnh lên *</FormLabel>
                <FormDescription>
                  Chọn ảnh đại diện cho phòng của bạn
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
          <div className="flex flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="roomPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá phòng *</FormLabel>
                    <FormDescription>Giá phòng/ngày</FormDescription>
                    <FormControl>
                      <Input
                        type="text"
                        min={0}
                        {...field}
                        value={formatNumber(field.value)} // Display formatted value
                        onFocus={(e) =>
                          (e.target.value = field.value.toString())
                        } // Show raw number on focus
                        onBlur={(e) =>
                          field.onChange(parseCurrency(e.target.value))
                        } // Parse back to number on blur
                        onChange={(e) =>
                          field.onChange(parseCurrency(e.target.value))
                        } // Handle manual typing
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bedCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số giường *</FormLabel>
                    <FormDescription>
                      Bao nhiêu giường trong phòng
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={10} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số khách *</FormLabel>
                    <FormDescription>Bao nhiêu khách có thể ở</FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={20} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathroomCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số phòng tắm *</FormLabel>
                    <FormDescription>
                      Bao nhiêu phòng tắm trong phòng
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="breakFastPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bữa sáng *</FormLabel>
                    <FormDescription>Giá bữa ăn sáng</FormDescription>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        value={formatNumber(field.value || 0)} // Display formatted value
                        onFocus={(e) =>
                          (e.target.value = field.value?.toString() || '')
                        } // Show raw number on focus
                        onBlur={(e) =>
                          field.onChange(parseCurrency(e.target.value))
                        } // Parse back to number on blur
                        onChange={(e) =>
                          field.onChange(parseCurrency(e.target.value))
                        } // Handle manual typing
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="singleBed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số giường đơn *</FormLabel>
                    <FormDescription>Có bao nhiêu giường đơn</FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doubleBed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số giường đôi *</FormLabel>
                    <FormDescription>Có bao nhiêu giường đôi</FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="pt-4 pb-2">
            {room ? (
              <Button
                onClick={form.handleSubmit(onSubmit)}
                type="button"
                variant="info"
                className="max-w-[150px]"
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
                onClick={form.handleSubmit(onSubmit)}
                type="button"
                variant="success"
                className="max-w-[150px]"
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
                    Tạo phòng
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddRoomForm;
