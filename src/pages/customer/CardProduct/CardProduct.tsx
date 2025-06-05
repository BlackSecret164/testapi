import type React from "react"

import { useEffect, useState } from "react"
import { FaCartPlus, FaPlus } from "react-icons/fa"
import styles from "./CardProduct.module.css"
interface ProductSize {
  name: string
  price: number 
}

interface CardProductProps {
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
  onAddToCart?: (productId: string, size: ProductSize, temperature?: string) => void
  onProductClick?: (productId: string) => void
}

const CardProduct: React.FC<CardProductProps> = ({
  id,
  name,
  category,
  image,
  available,
  sizes,
  hot = false,
  cold = false,
  materials,
  description,
  isPopular,
  onAddToCart,
  onProductClick,
}) => {
  const [selectedSize, setSelectedSize] = useState(0)
  const [selectedTemperature, setSelectedTemperature] = useState<string>("")

  // Initialize temperature selection for coffee
  useEffect(() => {
    if (category.toLowerCase() === "Cà phê" && (hot || cold)) {
      setSelectedTemperature(hot ? "hot" : "cold")
    }
  }, [category, hot, cold])

  const handleAddToCart = () => {
    if (!available) return

    const selectedSizeData = sizes[selectedSize]
    const temperature = category.toLowerCase() === "cà phê" ? selectedTemperature : undefined

    onAddToCart?.(id, selectedSizeData, temperature)
    console.log(
      `Added ${name} (${selectedSizeData.name}${temperature ? ` - ${temperature === "hot" ? "Nóng" : "Đá"}` : ""}) to cart`,
    )
  }

  const handleProductClick = () => {
    onProductClick?.(id)
  }

  const isCoffee = category.toLowerCase() === "cà phê"
  const hasTemperatureOptions = isCoffee && (hot || cold)

  return (
    <div className={`${styles.cardProduct} ${!available ? styles.cardProductUnavailable : ""}`}>
      <div className={styles.cardProductImageWrapper}>
        {isPopular && <div className={styles.cardProductBadge}>Phổ biến</div>}
        {!available && (
          <div className={styles.cardProductUnavailableOverlay}>
            <span>Hết hàng</span>
          </div>
        )}
        <img
          src={image || "@asset/img2.jpg"}
          alt={`Hình ảnh của ${name}`}
          className={styles.cardProductImage}
        />
      </div>

      <div className={styles.cardProductContent}>
        <div className={styles.cardProductInfo}>
          <div className={styles.cardProductCategory}>{category}</div>
          <div className="d-flex justify-between h-100 gap-2">
            <h3 className={styles.cardProductTitle} onClick={handleProductClick}>
              {name}
            </h3>

            {/* Temperature Selection for Coffee */}
            {hasTemperatureOptions && (
              <div className={styles.cardProductTemperature}>
                <div className={styles.cardProductTemperatureOptions}>
            {hot && (
              <button
                onClick={() => setSelectedTemperature("hot")}
                className={`${styles.cardProductTemperatureBtn} ${
                  selectedTemperature === "hot" ? styles.active : ""
                }`}
                disabled={!available}
              >
                Nóng
              </button>
            )}
            {cold && (
              <button
                onClick={() => setSelectedTemperature("cold")}
                className={`${styles.cardProductTemperatureBtn} ${
                  selectedTemperature === "cold" ? styles.active : ""
                }`}
                disabled={!available}
              >
                Đá
              </button>
            )}
                </div>
              </div>
            )}
          </div>
          {/* <p className={styles.cardProductDescription}>{description}</p>

          {materials.length > 0 && (
            <div className={styles.cardProductMaterials}>
              <span className={styles.cardProductMaterialsLabel}>Nguyên liệu: </span>
              <span className={styles.cardProductMaterialsList}>{materials.join(", ")}</span>
            </div>
          )} */}
        </div>

        <div className={styles.cardProductOptionsRow}>

          {/* Size Selection */}
          <div className={styles.cardProductSizes}>
            <div className="d-flex justify-between h-100 gap-2 align-items-center">
                <p className={styles.cardProductSizeLabel}>Kích thước:</p>
                <div className={styles.cardProductSizeOptions}>
                  {sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(index)}
                      className={`${styles.cardProductSizeBtn} ${selectedSize === index ? styles.active : ""}`}
                      disabled={!available}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
        </div>

        <div className={styles.cardProductFooter}>
          <p className={styles.cardProductPrice}>{sizes[selectedSize]?.price.toLocaleString("vi-VN")}đ</p>
          <button
            onClick={handleAddToCart}
            className={styles.cardProductAddBtn}
            disabled={!available || (hasTemperatureOptions && !selectedTemperature)}
          >
            <FaCartPlus className={styles.cardProductAddIcon} />
            Thêm
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardProduct
