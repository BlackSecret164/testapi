import Banner from "./partials/Banner/Banner";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import "./Home.scss";

import Features from "./partials/Features/Features";
import React, { useEffect, useState } from "react";
import { MainApiRequest } from "@/services/MainApiRequest";
import { Button, List } from "antd";
import Gallery from "./partials/Gallery/Gallery";
import img1 from "@/assets/cup7.jpg";
import img2 from "@/assets/cup32.jpg";
import img4 from "@/assets/bread12.jpg";
import img3 from "@/assets/cup39.jpg";
import CardProduct from "../CardProduct/CardProduct";

interface ProductSize {
  name: string
  price: number
}

interface Product {
  id: string
  name: string
  category: string
  image: string
  available: boolean
  sizes: ProductSize[]
  hot?: boolean
  cold?: boolean
  materials: string[]
  description: string
  isPopular: boolean
}

const Home = () => {
  var settings: Settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    slidesToShow: 4,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          autoplay: true,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          autoplay: true,
          arrows: false
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        },
      },
    ],
  };

  

  const navigate = useNavigate();
  const [productList, setProductList] = useState<any[]>([]);
  const [visibleProducts, setVisibleProducts] = useState(8);


  const fetchListProduct = async () => {
    const res = await MainApiRequest.get('/product/list');
    console.log(res);
    if (res.status === 200) {
      setProductList(res.data.data);
    } else {
      console.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchListProduct();
  }, []);

  const handleShowMore = () => {
    navigate("/products");
  };

  const [cart, setCart] = useState<any[]>([])

  const sampleProducts: Product[] = [
    {
      id: "1",
      name: "Cà Phê Đen Đá",
      category: "Cà phê",
      image: img1,
      available: true,
      sizes: [
        { name: "S", price: 25000 },
        { name: "M", price: 30000 },
        { name: "L", price: 35000 },
      ],
      hot: true,
      cold: true,
      materials: ["Cà phê robusta", "Đường", "Đá"],
      description: "Cà phê đen truyền thống, đậm đà hương vị Việt Nam",
      isPopular: true,
    },
    {
      id: "2",
      name: "Trà Sữa Trân Châu",
      category: "Trà sữa",
      image: img2,
      available: true,
      sizes: [
        { name: "M", price: 45000 },
        { name: "L", price: 55000 },
      ],
      materials: ["Trà đen", "Sữa tươi", "Trân châu", "Đường"],
      description: "Trà sữa thơm ngon với trân châu dai giòn",
      isPopular: true,
    },
    {
      id: "3",
      name: "Bánh Tiramisu",
      category: "Bánh ngọt",
      image: img4,
      available: true,
      sizes: [
        { name: "1 miếng", price: 65000 },
        { name: "Cả bánh", price: 450000 },
      ],
      materials: ["Mascarpone", "Cà phê espresso", "Ladyfinger", "Cocoa"],
      description: "Bánh Tiramisu Ý nguyên bản với hương vị cà phê đặc trưng",
      isPopular: true,
    },
    {
      id: "4",
      name: "Cà Phê Sữa Nóng",
      category: "Cà phê",
      image: img3,
      available: true,
      sizes: [
        { name: "S", price: 30000 },
        { name: "M", price: 35000 },
      ],
      hot: true,
      cold: true,
      materials: ["Cà phê robusta", "Sữa đặc", "Đường"],
      description: "Cà phê sữa nóng đậm đà, thơm ngon",
      isPopular: true,
    },
  ]

  const handleAddToCart = (productId: string, size: ProductSize, temperature?: string) => {
    const product = sampleProducts.find((p) => p.id === productId)
    if (product) {
      const cartItem = {
        id: `${productId}-${size.name}${temperature ? `-${temperature}` : ""}`,
        productId,
        name: product.name,
        size: size.name,
        temperature,
        price: size.price,
        quantity: 1,
      }
      setCart((prev) => [...prev, cartItem])
      console.log("Cart updated:", cartItem)
    }
  }

  const handleProductClick = (productId: string) => {
    console.log(`Navigate to product detail: ${productId}`)
    // Implement navigation logic here
  }

  return (
    <>
      <Banner />
      <Features />

      <section className="popular py-5">
        <Container>
          <Row className="mb-4">
            <Col md={12}>
              <div className="main_heading text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Sản Phẩm Nổi Bật</h1>
              </div>
              </Col>
          </Row>
          <Row>
            <Col md={12} className="product-slider">
              <Slider {...settings}>
                {sampleProducts.map((product) => (
                  <div key={product.id} className="product-item p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <CardProduct
                    key={product.id}
                    {...product}
                    onAddToCart={handleAddToCart}
                    onProductClick={handleProductClick}
                  />
                  </div>
                ))}
              </Slider>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={12} className="text-center">
              <Button 
                className="atn-btn-primary"
                type="primary" 
                onClick={handleShowMore}>
                Xem Thêm
              </Button>
            </Col>
          </Row>
        
        </Container>

        {/* <section className="popular py-5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Thực Đơn Đồ Uống & Bánh Ngọt</h1>
              <p className="text-gray-600">Khám phá các món đồ uống và bánh ngọt thơm ngon của chúng tôi</p>
              {cart.length > 0 && <p className="text-orange-600 mt-2">Giỏ hàng: {cart.length} sản phẩm</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sampleProducts.map((product) => (
                <CardProduct
                  key={product.id}
                  {...product}
                  onAddToCart={handleAddToCart}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
          </div>
          </section> */}

        <Gallery />
        <section className="call_us px-5">
          <Container>
            <Row className="align-items-center">
              <Col md="4" className="text-center mt-3 mt-md-0">
                <Link
                to="/contact-us"
                className="secondary_btn bounce"
                >
                Liên hệ với chúng tôi!
                </Link>
              </Col>
              <Col md="8">
                <h2 className="heading">
                SẴN SÀNG VỚI TRẢI NGHIỆM TUYỆT VỜI TẠI CỬA HÀNG CHÚNG TÔI?
                </h2>
                <p className="text">
                Thưởng thức các loại thức uống thơm ngon và bánh ngọt hấp dẫn trong không gian ấm cúng tại cửa hàng của chúng tôi. Đội ngũ thân thiện và thực đơn đa dạng luôn sẵn sàng phục vụ bạn mỗi ngày!
                </p>
              </Col>
            </Row>
          </Container>
          <div className="overlay px-5"></div>
        </section>
      </section>
      {/* room seciton end */}
    </>
  );
};

export default Home;