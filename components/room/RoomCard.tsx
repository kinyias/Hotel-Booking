'use client'

import { Bookings, Hotels, Rooms } from "@prisma/client";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "../ui/card";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { Bed, BedDouble, Loader2, Pencil, Trash, Users } from "lucide-react";
import { Separator } from "../ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import AddRoomForm from "./AddRoomForm";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface RoomCardProps{
    hotel?: Hotels &{
        rooms: Rooms[] // Fixed property name from room to rooms
    }
    room: Rooms;
    booking?: Bookings[]
}

const RoomCard = ({hotel, room}: RoomCardProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const isHotelDetailsPage = pathname.includes('hotel-details');
    const {toast} = useToast();
    const handleDialogueOpen = () =>{
        setOpen(prev=>!prev)
      }

    const handleDeleteRoom =  (room: Rooms) =>{
        setIsLoading(true)
        const imageKey = room.image.substring(room.image.lastIndexOf('/') + 1)
        axios.post('/api/uploadthing/delete', {imageKey})
        .then(()=>{
            axios.delete(`/api/room/${room.id}`)
            .then(()=>{
                router.refresh()
                toast({
                    variant: 'success',
                    description: 'Phòng đã được xoá thành công'
                })
                setIsLoading(false)
            })
            .catch(()=>{
                setIsLoading(false)
                toast({
                    variant: 'destructive',
                    description: 'Không thể xoá phòng'
                })
            })
        })
        .catch(()=>{
            setIsLoading(false)
            toast({
                variant: 'destructive',
                description: 'Không thể xoá phòng'
            })
        })
    }
    return ( 
    <Card>
        <CardHeader>
            <CardTitle>{room.title}</CardTitle>
            <CardDescription>{room.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
            <div className="apsect-square overflow-hidden relative h-[200px] rounded-lg">
                <Image fill src={room.image} alt={room.title} className="object-cover"/>
            </div>
            <div className="grid grid-cols-2 gap-4 content-start text-sm">
                <AmenityItem><Bed className="w-4 h-4"/>{room.bedCount} giường</AmenityItem>
                <AmenityItem><Users className="w-4 h-4"/>{room.guestCount} khách</AmenityItem>
                <AmenityItem><Bed className="w-4 h-4"/>{room.bathroomCount} phòng tắm</AmenityItem>
                {!!room.singleBed && <AmenityItem><Bed className="w-4 h-4"/>{room.singleBed} giường đơn</AmenityItem>}         
                {!!room.doubleBed && <AmenityItem><BedDouble className="w-4 h-4"/>{room.doubleBed} giường đôi</AmenityItem>}         
            </div>
            <Separator/>
            <div className="flex flex-wrap gap-4 justify-between">
                <div>Giá phòng: <span className="font-bold">{room.roomPrice} VND</span> <span className="text-xs">/ngày</span></div>
                {!!room.breakFastPrice && <div>Giá bữa sáng: <span className="font-bold">{room.breakFastPrice} VND</span></div>}
            </div>
            <Separator/>
        {
            isHotelDetailsPage ? <div>Chi tiết khách sạn</div> : <div className="flex w-full justify-between">
                <Button disabled={isLoading} type="button" variant='danger' onClick={()=>handleDeleteRoom(room)}>
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Đang xoá</> : <><Trash className="w-4 h-4 mr-2"/> Xoá</>}
                </Button>
                <Dialog open={open} onOpenChange={setOpen}>
                 <DialogTrigger>
                  <Button type='button' variant='info' className='max-w-[150px]'>
                  <Pencil className='mr-2 h-4 w-4'/> Cập nhật phòng
                  </Button>
                  </DialogTrigger>
                 <DialogContent className='max-w-[900px] w-[90%]'>
                   <DialogHeader className='px-2'>
                     <DialogTitle>Cập nhật phòng</DialogTitle>
                     <DialogDescription>
                       Cập nhật về phòng của khách sạn
                     </DialogDescription>
                   </DialogHeader>
                    <AddRoomForm 
                      hotel={hotel}
                      room={room} 
                      handleDialogueOpen={handleDialogueOpen}
                    />
                 </DialogContent>
               </Dialog>
            </div>
        }
        </CardContent>
    </Card> );
}
 
export default RoomCard;