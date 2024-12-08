import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";

const newsItems = [
    {
      title: "Top 10 Beach Destinations for 2023",
      excerpt: "Discover the most beautiful and relaxing beach getaways for your next vacation.",
      link: "/blog/top-beach-destinations-2023",
      image: "",
      author: "Emma Thompson",
      date: "May 15, 2023"
    },
    {
      title: "How to Save Money on Your Next Hotel Booking",
      excerpt: "Learn insider tips and tricks to get the best deals on your hotel reservations.",
      link: "/blog/save-money-hotel-booking",
      image: "",
      author: "Michael Chen",
      date: "June 2, 2023"
    },
    {
      title: "The Rise of Eco-Friendly Hotels",
      excerpt: "Explore the growing trend of sustainable and environmentally conscious accommodations.",
      link: "/blog/eco-friendly-hotels",
      image: "",
      author: "Sophia Rodriguez",
      date: "June 10, 2023"
    }
  ]
const NewsList = () => {
    return (  <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">Tin tức mới</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {newsItems.map((item, index) => (
               <Card key={index} className="flex flex-col">
               <CardHeader className="p-0">
                 <Image
                   src={item.image}
                   alt={item.title}
                   width={400}
                   height={200}
                   className="w-full h-48 object-cover rounded-t-lg"
                 />
               </CardHeader>
               <CardContent className="p-6 flex-grow">
                 <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                 <p className="text-gray-600 mb-4">{item.excerpt}</p>
                 <div className="flex items-center text-sm text-gray-500">
                   <span>{item.author}</span>
                   <span className="mx-2">•</span>
                   <time dateTime={item.date}>{item.date}</time>
                 </div>
               </CardContent>
               <CardFooter className="p-6 pt-0">
                 <Link href={item.link}>
                   <Button variant="outline">Read More</Button>
                 </Link>
               </CardFooter>
             </Card>
 
            ))}
          </div>
        </div>
      </section> );
}
 
export default NewsList;