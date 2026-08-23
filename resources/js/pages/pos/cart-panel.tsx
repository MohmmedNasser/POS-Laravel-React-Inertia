import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { cartItem } from '@/types';
import { Trash2 } from 'lucide-react';

interface Props {
    cartItems: cartItem[];
    subtotal: number;
    onClearCart: () => void;
    onRemoveItem: (productId: number) => void;
    onUpdateQuantity: (productId: number, quantity: number) => void;
}

export default function CartPanel({
    cartItems,
    subtotal,
    onClearCart,
    onRemoveItem,
    onUpdateQuantity,
}: Props) {
    return (
        <>
            <div className="flex h-full w-[320px] flex-col border-l p-6">
                <h4 className="pb-2 text-lg font-semibold">Your Cart</h4>

                {cartItems.length === 0 && (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                        <p>Your cart is empty</p>
                    </div>
                )}

                {cartItems.length > 0 && (
                    <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between">
                            <p className="py-2 text-sm text-gray-600">
                                {cartItems.length} item
                                {cartItems.length !== 1 ? 's' : ''} in your cart
                            </p>
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto">
                            {cartItems.map((item) => (
                                <div
                                    key={item.product.id}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex flex-col gap-1">
                                        <p className="font-medium">
                                            {item.product.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            ${item.product.price}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Input
                                            type="number"
                                            min="0"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                onUpdateQuantity(
                                                    item.product.id,
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="w-16"
                                        />
                                        <Button
                                            onClick={() =>
                                                onRemoveItem(item.product.id)
                                            }
                                            className="cursor-pointer"
                                            variant="outline"
                                            size="icon"
                                        >
                                            <Trash2 className="h-5 w-5 text-red-400 hover:text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-lg font-medium">Total: </p>
                                <span className="text-lg font-medium">
                                    ${subtotal}
                                </span>
                            </div>
                            <div className="flex flex-col space-y-3">
                                <Button
                                    className="mt-auto w-full cursor-pointer"
                                    variant="default"
                                    onClick={() => {}}
                                >
                                    Checkout
                                </Button>
                                <Button
                                    className="mt-auto w-full cursor-pointer"
                                    variant="secondary"
                                    onClick={() => onClearCart()}
                                >
                                    Clear Cart
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
