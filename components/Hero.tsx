import { Button } from "./ui/button";

const Hero = () => {
    return ( 
        <div className="relative bg-cover bg-center flex items-center justify-center my-10">
        <div className="absolute inset-0"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">Tìm Kiếm Chỗ Ở Hoàn Hảo</h1>
          <p className="text-xl mb-8">Khám phá những khách sạn và chỗ ở tuyệt vời</p>
          <Button size="lg">Đặt phòng ngay</Button>
        </div>
      </div>
     );
}
 
export default Hero;