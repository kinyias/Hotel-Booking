'use client';

import * as z from 'zod';
import {
  Hotel,
  Room,
  Pax,
  RoomAmenity,
  SeasonPricing,
  RoomType,
  RoomRate,
  Amenity,
} from '@prisma/client';
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
import { formatNumber, parseCurrency } from '@/utils/formatCurrency';
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
export interface IRoom extends Room {
  RoomAmenity: RoomAmenity[];
  SeasonPricing: SeasonPricing[];
  RoomType: { name: string } | null;
  RoomRate: { name: string } | null;
  Pax: Pax[];
}
interface IItems {
  roomType: RoomType[];
  roomRate: RoomRate[];
}
interface AddHotelFormProps {
  hotel?: Hotel & {
    room: IRoom[];
  };
  room?: IRoom;
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
  seasonPricing: z.coerce.number().optional(),
  bathroomCount: z.coerce.number().min(1, {
    message: 'Cần nhập số phòng tắm',
  }),
  singleBed: z.coerce.number().optional(),
  doubleBed: z.coerce.number().optional(),
  breakFastPrice: z.coerce.number().optional(),
  roomPrice: z.coerce.number().min(1, {
    message: 'Cần nhập giá phòng',
  }),
  RoomAmenity: z
    .array(
      z.object({
        amenityId: z.string().uuid(),
      })
    )
    .min(1, {
      message: 'Yêu cầu chọn ít nhất một tiện ích',
    }),
  Pax: z.array(
    z.object({
      maxAdults: z.number().optional(),
      maxChildren: z.number().optional(),
      maxInfants: z.number().optional(),
    })
  ),
  roomTypeId: z.string().optional(),
  roomRateId: z.string().optional(),
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
  const [selectItems, setSelectItems] = useState<IItems>({
    roomType: [],
    roomRate: [],
  });
  const [amenities, setAmenities] = useState<Amenity[]>([]);
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
      RoomAmenity: [],
      Pax: [
        {
          maxAdults: 0,
          maxChildren: 0,
          maxInfants: 0,
        },
      ],
      roomTypeId: '',
      roomRateId: '',
      image: '',
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [amenitiesResponse, roomTypesResponse] = await Promise.all([
          axios.get(`/api/room/amenity`),
          axios.get(`/api/room/roomType`),
        ]);

        setAmenities(amenitiesResponse.data);
        setSelectItems(roomTypesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
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
            <div className="mt-2">
              <FormField
                control={form.control}
                name="RoomAmenity"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      {amenities.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="RoomAmenity"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.some(
                                      (amenity) => amenity.amenityId === item.id
                                    )}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [
                                            ...field.value,
                                            {
                                              amenityId: item.id,
                                            },
                                          ]
                                        : field.value?.filter(
                                            (amenity) =>
                                              amenity.amenityId !== item.id
                                          );
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
  name="Pax.0.maxAdults"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Số người lớn</FormLabel>
      <FormDescription>Số người lớn cho phép</FormDescription>
      <FormControl>
        <Input type="number" min={0} max={20} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="Pax.0.maxChildren"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Số trẻ em</FormLabel>
      <FormDescription>Số trẻ em cho phép</FormDescription>
      <FormControl>
        <Input type="number" min={0} max={20} {...field}  onChange={(e) => field.onChange(e.target.valueAsNumber)} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="Pax.0.maxInfants"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Số trẻ sơ sinh</FormLabel>
      <FormDescription>Số trẻ sơ sinh cho phép</FormDescription>
      <FormControl>
        <Input type="number" min={0} max={20} {...field}  onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
              {/* {fields.map((field, index) => (
                <div key={field.id}>
                  <FormField
                    control={form.control}
                    name={`Pax.${index}.maxAdults`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số khách người lớn *</FormLabel>
                        <FormDescription>
                          Bao nhiêu người lớn có thể ở
                        </FormDescription>
                        <FormControl>
                          <Input type="number" min={0} max={20} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`Pax.${index}.maxChildren`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số khách trẻ em *</FormLabel>
                        <FormDescription>
                          Bao nhiêu trẻ em có thể ở
                        </FormDescription>
                        <FormControl>
                          <Input type="number" min={0} max={20} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`Pax.${index}.maxInfants`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số khách trẻ em sơ sinh *</FormLabel>
                        <FormDescription>
                          Bao nhiêu trẻ em sơ sinh có thể ở
                        </FormDescription>
                        <FormControl>
                          <Input type="number" min={0} max={20} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {index > 0 && (
                    <Button type="button" onClick={() => remove(index)}>
                      Xóa cấu hình Pax
                    </Button>
                  )}
                </div>
              ))} */}
              {/* <FormField
                control={form.control}
                name={`Pax.0.maxAdults`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số khách người lớn *</FormLabel>
                    <FormDescription>
                      Bao nhiêu người lớn có thể ở
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={20} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`Pax.0.maxChildren`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số khách trẻ em *</FormLabel>
                    <FormDescription>Bao nhiêu trẻ em có thể ở</FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={20} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`Pax.0.maxInfants`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số khách trẻ em sơ sinh *</FormLabel>
                    <FormDescription>
                      Bao nhiêu trẻ em sơ sinh có thể ở
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={20} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="roomTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại phòng *</FormLabel>
                    <FormDescription>Chọn loại phòng</FormDescription>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại phòng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectItems.roomType.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roomRateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hạng phòng *</FormLabel>
                    <FormDescription>Chọn Hạng phòng</FormDescription>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn hạng phòng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectItems.roomRate.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 flex flex-col gap-6">
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
