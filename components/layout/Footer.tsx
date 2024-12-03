import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
    return ( 
        <footer className="bg-card pt-16 pb-12 ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Về Khang Hotel</h2>
              <p className="text-sm">
               Khang Hotel là đồ án chuyên ngành năm 4 (chuyên ngành CNTT) trường ĐH Công Nghệ Sài Gòn
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Links</h2>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm hover:text-primary">Về chúng tôi</Link></li>
                <li><Link href="/contact" className="text-sm hover:text-primary">Liên hệ</Link></li>
                <li><Link href="/faq" className="text-sm hover:text-primary">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Thông tin</h2>
              <ul className="space-y-2">
                <li><div className="text-sm">Địa chỉ chính: 180 Cao Lỗ, phường 4, Quận 8, TP Hồ Chí Minh</div></li>
                <li><div className="text-sm">Email: DH52102716@student.stu.edu.vn</div></li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Nhận thông báo</h2>
              <p className="text-sm mb-4">Đăng kí ngay để nhận thông báo mới nhất về chương trình và khuyến mãi</p>
              <form className="space-y-2">
                <Input type="email" placeholder="Địa chỉ email của bạn" className="w-full" />
                <Button type="submit" className="w-full">Đăng kí</Button>
              </form>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm">&copy; 2024 Khang Hotel</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                  <span className="sr-only">Facebook</span>
                  <Facebook size={24} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                  <span className="sr-only">Twitter</span>
                  <Twitter size={24} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                  <span className="sr-only">Instagram</span>
                  <Instagram size={24} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                  <span className="sr-only">LinkedIn</span>
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
     );
}
 
export default Footer;