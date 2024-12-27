import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card"
import Image from "next/image"

const About = () => {
    return (
        <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Về khách sạn của chúng tôi</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <Image
              src={'/logo.svg'}
              alt="Hotel Exterior"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Chào mừng đến với Khang Hotel</CardTitle>
              <CardDescription>Chọn nơi ở tốt nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
               Khang Hotel là đồ án chuyên ngành CNTT năm 4 Trường ĐH Công Nghệ Sài Gòn (STU) <br />
               Tên SV: Thái Tín Khang  <br />   
               MSSV: DH52102716
              </p>
            </CardContent>
          </Card>
        </div>
        </div>
     );
}
 
export default About;