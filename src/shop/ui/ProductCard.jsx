export default function ProductCard({ product, onAddToCart }) {
  // 백엔드 데이터에 가로/세로 칸수가 있을 때만 '2×4칸' 칩을 보여줌
  const sizeLabel =
    product.sizeX && product.sizeY ? `${product.sizeX}×${product.sizeY}칸` : null;

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <span className="product-card__no-image">이미지 없음</span>
        )}
      </div>
      <div className="product-card__body">
        <div className="product-card__tags">
          {product.category && <span className="chip-tag">{product.category}</span>}
          {sizeLabel && <span className="chip-size">{sizeLabel}</span>}
        </div>
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__price">{product.price.toLocaleString()}원</p>
        <button
          type="button"
          className="product-card__add-btn"
          onClick={() => onAddToCart(product)}
        >
          장바구니 담기
        </button>
      </div>
    </article>
  );
}