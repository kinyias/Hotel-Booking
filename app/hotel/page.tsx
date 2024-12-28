import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SideBar from '@/components/layout/Sidebar';
const hotels = [
  {
    id: 1,
    name: 'Luxury Resort & Spa',
    description: 'Experience ultimate relaxation in our 5-star resort.',
    price: 350,
    amenities: ['Wi-Fi', 'Pool', 'Spa', 'Restaurant'],
  },
  {
    id: 2,
    name: 'City Center Hotel',
    description: 'Perfect location for business and leisure travelers.',
    price: 200,
    amenities: ['Wi-Fi', 'Gym', 'Restaurant', 'Parking'],
  },
  {
    id: 3,
    name: 'Beachfront Paradise',
    description: 'Enjoy stunning ocean views and direct beach access.',
    price: 450,
    amenities: ['Wi-Fi', 'Pool', 'Beach Access', 'Air Conditioning'],
  },
];
const Hotel = () => {
  return (
    <div className="flex flex-col justify-center md:flex-row min-h-screen">
      <SideBar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Khách sạn</h1>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {hotels.map((hotel) => (
            <Card key={hotel.id}>
              <CardHeader>
                <CardTitle>{hotel.name}</CardTitle>
                <CardDescription>{hotel.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  ${hotel.price}{' '}
                  <span className="text-sm font-normal text-muted-foreground">
                    / night
                  </span>
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {hotel.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Book Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Hotel;
