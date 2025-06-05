import { CardContent } from "@mui/material"
import { useState } from "react"
import { Badge, Button, Card} from "react-bootstrap"
import { FaPlusCircle } from "react-icons/fa"
import img1 from "@/assets/bg7.jpg";
import img2 from "@/assets/service3.jpg";
import img3 from "@/assets/img5.jpg";
import img4 from "@/assets/bread10.jpg";

interface ProductCardProps {
  id: string
  name: string
  description: string
  image: string
  sizes: {
    name: string
    price: number
  }[]
  category: string
  isPopular?: boolean
}

const CardProduct = ({ id, name, description, image, sizes, category, isPopular = false }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState(0)

  const handleAddToCart = () => {
    console.log(`Added ${name} (${sizes[selectedSize].name}) to cart`)
    // Implement add to cart logic here
  }

  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
      <div className="relative">
        {isPopular && <Badge className="absolute top-3 left-3 z-10 bg-orange-500 hover:bg-orange-600">Phổ biến</Badge>}
        <div className="aspect-square overflow-hidden bg-gray-50">
          <Card.Img
            src={image || "/placeholder.svg"}
            alt={name}
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Badge bg="secondary" className="text-xs">
              {category}
            </Badge>
          </div>
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>

        {/* Size Selection */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Kích thước:</p>
          <div className="flex gap-2">
            {sizes.map((size, index) => (
              <button
                key={index}
                onClick={() => setSelectedSize(index)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  selectedSize === index
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-orange-300"
                }`}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <p className="text-xl font-bold text-orange-600">{sizes[selectedSize].price.toLocaleString("vi-VN")}đ</p>
          </div>

          <Button
            onClick={handleAddToCart}
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full"
          >
            <FaPlusCircle className="w-4 h-4 mr-1" />
            Thêm
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Example usage with sample data
export default function Component() {
  const sampleProducts: ProductCardProps[] = [
    {
      id: "1",
      name: "Cà Phê Đen Đá",
      description: "Cà phê đen truyền thống, đậm đà hương vị Việt Nam",
      image: img1,
      sizes: [
        { name: "S", price: 25000 },
        { name: "M", price: 30000 },
        { name: "L", price: 35000 },
      ],
      category: "Cà phê",
      isPopular: true,
    },
    {
      id: "2",
      name: "Trà Sữa Trân Châu",
      description: "Trà sữa thơm ngon với trân châu dai giòn",
      image: img2,
      sizes: [
        { name: "M", price: 45000 },
        { name: "L", price: 55000 },
      ],
      category: "Trà sữa",
    },
    {
      id: "3",
      name: "Bánh Tiramisu",
      description: "Bánh Tiramisu Ý nguyên bản với hương vị cà phê đặc trưng",
      image: img4,
      sizes: [
        { name: "1 miếng", price: 65000 },
        { name: "Cả bánh", price: 450000 },
      ],
      category: "Bánh ngọt",
      isPopular: true,
    },
    {
      id: "4",
      name: "Nước Cam Tươi",
      description: "Nước cam tươi nguyên chất, giàu vitamin C",
      image: img3,
      sizes: [
        { name: "S", price: 35000 },
        { name: "M", price: 45000 },
      ],
      category: "Nước ép",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thực Đơn Đồ Uống & Bánh Ngọt</h1>
          <p className="text-gray-600">Khám phá các món đồ uống và bánh ngọt thơm ngon của chúng tôi</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleProducts.map((product) => (
            <CardProduct key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  )
}
