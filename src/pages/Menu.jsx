import { useEffect, useMemo, useState } from "react";
import SEO from "../components/SEO";
import "./Menu.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/menu`)
      .then((response) => {
        if (!response.ok) throw new Error("The menu could not be loaded.");
        return response.json();
      })
      .then(setMenuItems)
      .catch((loadError) => setError(loadError.message))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = ["All", ...new Set(menuItems.map((item) => item.category))];
  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);
  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const addToCart = (item) => {
    setCart((currentCart) => {
      const existing = currentCart.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return currentCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }
      return [...currentCart, { ...item, quantity: 1 }];
    });
  };

  const changeQuantity = (itemId, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleOrderSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          phone,
          pickup_time: pickupTime,
          notes: notes || null,
          items: cart.map((item) => ({
            menu_item_id: item.id,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "The order could not be placed.");
      setConfirmation(data);
      setCart([]);
      setCustomerName("");
      setPhone("");
      setPickupTime("");
      setNotes("");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="menu-page">
      <SEO
        title="Menu | Rivera Coffee"
        description="Explore our menu of espresso, filter coffee, and pastries."
      />
      <h1>Our Menu</h1>

      {isLoading && <p>Loading menu...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!isLoading && !error && (
        <>
          <div className="category-buttons">
            {categories.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? "active" : ""}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="menu-layout">
            <div className="menu-list">
              {filteredItems.map((item) => (
                <div className="menu-item" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>₹{item.price}</span>
                  </div>
                  <button type="button" onClick={() => addToCart(item)}>
                    Add
                  </button>
                </div>
              ))}
            </div>

            <aside className="cart-panel">
              <h2>Your order</h2>
              {cart.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div className="cart-item" key={item.id}>
                        <span>{item.name}</span>
                        <div>
                          <button type="button" onClick={() => changeQuantity(item.id, -1)}>-</button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => changeQuantity(item.id, 1)}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="cart-total">Total: ₹{total}</p>
                  <form className="order-form" onSubmit={handleOrderSubmit}>
                    <input
                      required
                      placeholder="Your name"
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Phone number"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                    <input
                      required
                      placeholder="Pickup time (e.g. 5:30 PM)"
                      value={pickupTime}
                      onChange={(event) => setPickupTime(event.target.value)}
                    />
                    <textarea
                      placeholder="Notes (optional)"
                      rows="3"
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                    />
                    <button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Placing order..." : "Place pickup order"}
                    </button>
                  </form>
                </>
              )}
            </aside>
          </div>
        </>
      )}
      {confirmation && (
        <p className="success-msg">
          Order #{confirmation.order_id} confirmed. Your total is ₹{confirmation.total}.
        </p>
      )}
    </div>
  );
}

export default Menu;