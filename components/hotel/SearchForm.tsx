"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, MapPinIcon, SearchIcon, UsersIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { AutoComplete, type Option } from "../ui/autocomplete"
import useLocation from "@/hooks/useLocation"
const SearchForm = () => {
    const [destination, setDestination] =  useState<Option>()
  const [checkIn, setCheckIn] = useState<Date>()
  const [isGuestPopoverOpen, setIsGuestPopoverOpen] = useState(false)
  const [guestInfo, setGuestInfo] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    rooms: 1
  })
  const { getAllCities } = useLocation();
  const cities = getAllCities();
  const locations = cities.map(item => ({
    value: item.slug,
    label: item.name
}));
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search logic here
    console.log({ destination, checkIn, ...guestInfo })
  }

  const updateGuestInfo = (key: keyof typeof guestInfo, value: number) => {
    setGuestInfo(prev => ({ ...prev, [key]: Math.max(0, value) }))
  }

  const guestSummary = `${guestInfo.adults + guestInfo.children + guestInfo.infants} khách, ${guestInfo.rooms} phòng`

    return ( 
        <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Tìm kiếm khách sạn</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col lg:flex-row items-end gap-4">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="destination">Điểm đến</Label>
              <div className="relative">
                <MapPinIcon className="absolute left-2 h-5 w-5 top-1/2 transform -translate-y-3/4 text-gray-500" />
                <AutoComplete
                options={locations}
                emptyMessage="Không có kết quả"
                placeholder="Bạn muốn đi đâu?"
                isLoading={false}
                onValueChange={setDestination}
                value={destination}
                disabled={false}
                />
                {/* <Input
                  id="destination"
                  placeholder="Bạn muốn đi đâu?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-10"
                /> */}
              </div>
            </div>
              <div className="flex flex-col space-y-2">
                <Label>Ngày nhận phòng - ngày trả phòng</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkIn && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, "PPP") : <span>Chọn ngày</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col space-y-2">
              <Label>Số khách & phòng</Label>
              <Popover open={isGuestPopoverOpen} onOpenChange={setIsGuestPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    role="combobox"
                    aria-expanded={isGuestPopoverOpen}
                    className="w-full justify-start text-left font-normal"
                  >
                    <UsersIcon className="mr-2 h-4 w-4" />
                    {guestSummary}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="adults">Người lớn</Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGuestInfo('adults', guestInfo.adults - 1)}
                          disabled={guestInfo.adults <= 1}
                        >
                          -
                        </Button>
                        <span>{guestInfo.adults}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGuestInfo('adults', guestInfo.adults + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="children">Trẻ em (2-12 tuổi)</Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGuestInfo('children', guestInfo.children - 1)}
                          disabled={guestInfo.children <= 0}
                        >
                          -
                        </Button>
                        <span>{guestInfo.children}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGuestInfo('children', guestInfo.children + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="infants">Trẻ sơ sinh (0-2 tuổi)</Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGuestInfo('infants', guestInfo.infants - 1)}
                          disabled={guestInfo.infants <= 0}
                        >
                          -
                        </Button>
                        <span>{guestInfo.infants}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGuestInfo('infants', guestInfo.infants + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rooms">Phòng</Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGuestInfo('rooms', guestInfo.rooms - 1)}
                          disabled={guestInfo.rooms <= 1}
                        >
                          -
                        </Button>
                        <span>{guestInfo.rooms}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGuestInfo('rooms', guestInfo.rooms + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            </div>
  
            <Button type="submit" className="w-full mb-0.5 md:w-auto">
                <SearchIcon/>
              Tìm
            </Button>
            </div>
          </form>
        </CardContent>
      </Card>
     );
}
 
export default SearchForm;