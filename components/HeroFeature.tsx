const HeroFeature = () => {
    return ( 
    <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Tại sao lại chọn đặt phòng khách sạn của chúng tôi?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Giá tốt nhất</h3>
              <p >Đảm bảo giá tốt nhất cho bạn</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Dễ sử dụng</h3>
              <p >Thân thiện, dễ sử dụng với người dùng mới</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Hô trợ 24/7</h3>
              <p>Dịch vụ hỗ trợ khách hàng 24/7</p>
            </div>
          </div>
        </div>
      </section> );
}
 
export default HeroFeature;