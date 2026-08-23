import type { cartItem, Product } from "@/types";
import { useMemo, useReducer } from "react";

type CartAction = {
    type: "ADD";
    product: Product
} |
{
    type: "REMOVE";
    productId: number
} |
{
    type: "UPDATE";
    productId: number;
    quantity: number;
} |
{
    type: "CLEAR_CART";
};

function cartReducer(state: cartItem[], action: CartAction) {
    switch (action.type) {
        case "ADD":
            {
                const existing = state.find(item => item.product.id === action.product.id);
                if (existing) {
                    return state.map(item => item.product.id === action.product.id ? { ...item, quantity: item.quantity + 1 } : item)
                }
                return [...state, { product: action.product, quantity: 1 }]
            }
        case "REMOVE":
            {
                return state.filter(item => item.product.id !== action.productId);
            }
        case "UPDATE":
            {
                if (action.quantity <= 0) {
                    return state.filter(item => item.product.id !== action.productId);
                }
                return state.map(item => item.product.id === action.productId ? { ...item, quantity: action.quantity } : item);
            }
        case "CLEAR_CART":
            {
                return [];
            }
        default:
            return state;
    }
}


export function useCart() {
    const [items, dispatch] = useReducer(cartReducer, []);

    const subtotal = useMemo(() => items.reduce((acc, item) => acc + parseFloat(item.product.price) * item.quantity, 0), [items]);

    const addToCart = (product: Product) => dispatch({ type: "ADD", product });
    const removeItem = (productId: number) => dispatch({ type: "REMOVE", productId });
    const updateItem = (productId: number, quantity: number) => dispatch({ type: "UPDATE", productId, quantity });
    const clearCart = () => dispatch({ type: "CLEAR_CART" });


    return {
        items,
        subtotal,
        addToCart,
        removeItem,
        updateItem,
        clearCart,
    }
}
