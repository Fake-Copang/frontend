export default function CartItemRow({ item, checked, onToggle, onQuantityChange, onRemove }) {
  return (
    <div className="cart-row">
      <input
        type="checkbox"
        className="cart-row__checkbox"
        checked={checked}
        onChange={() => onToggle(item.id)}
      />
      <img className="cart-row__thumb" src={item.imageUrl} alt={item.name} />
      <div className="cart-row__info">
        <p className="cart-row__name">{item.name}</p>
        <p className="cart-row__price">{item.price.toLocaleString()}원</p>
      </div>
      <div className="cart-row__qty">
        <button
          type="button"
          onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button type="button" onClick={() => onQuantityChange(item.id, item.quantity + 1)}>
          +
        </button>
      </div>
      <button type="button" className="cart-row__remove" onClick={() => onRemove(item.id)}>
        삭제
      </button>
    </div>
  );
}