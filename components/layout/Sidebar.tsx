'use client'

import { useState } from 'react'
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

const amenities = [
  "Wi-Fi",
  "Pool",
  "Gym",
  "Restaurant",
  "Parking",
  "Air Conditioning"
]
const SideBar = () => {
    const [priceRange, setPriceRange] = useState([0, 1000])
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  
    const handlePriceChange = (value: number[]) => {
      setPriceRange(value)
    }
  
    const handleAmenityChange = (amenity: string) => {
      setSelectedAmenities(prev =>
        prev.includes(amenity)
          ? prev.filter(a => a !== amenity)
          : [...prev, amenity]
      )
    }
  
    const handleSearch = () => {
      console.log('Search with:', { priceRange, selectedAmenities })
      // Here you would typically update the main content or call an API
    }
  
    return (
      <aside className="w-64 bg-gray-100 p-6 mx-auto">
        <h2 className="text-xl font-semibold mb-4">Tìm kiếm</h2>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2">Giá</h3>
          <Slider
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
  
        <div className="mb-6">
          <h3 className="font-medium mb-2">Tiện nghi</h3>
          {amenities.map(amenity => (
            <div key={amenity} className="flex items-center mb-2">
              <Checkbox
                id={amenity}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => handleAmenityChange(amenity)}
              />
              <label htmlFor={amenity} className="ml-2 text-sm">
                {amenity}
              </label>
            </div>
          ))}
        </div>
  
        <Button onClick={handleSearch} className="w-full">
          Tìm
        </Button>
      </aside>
    )
}
 
export default SideBar;