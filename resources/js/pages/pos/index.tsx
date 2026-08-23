import { useState } from 'react';
import type { Product } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { LayoutGrid, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ProductGrid from './product-grid';
import CartPanel from './cart-panel';
import { useCart } from './use-cart';

interface Props {
    products: Product[];
}

export default function PosIndex({ products }: Props) {
    const [searchValue, setSearchValue] = useState('');
    const { items, subtotal, addToCart, removeItem, updateItem, clearCart } =
        useCart();

    const searchProducts = (): Product[] => {
        if (!searchValue) {
            return products;
        }
        return products.filter(
            (product) =>
                product.name
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()) ||
                product.category.name
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()),
        );
    };

    return (
        <>
            <Head title="Point of Sale" />
            <div className="flex h-screen flex-col bg-background">
                {/* top */}
                <div className="flex items-center gap-4 border-b px-4 py-3">
                    <Link href="/dashboard">
                        <LayoutGrid className="h-4 w-4" />
                    </Link>
                    <h1 className="text-lg font-semibold">Point of Sale</h1>
                    <div className="relative ml-4 max-w-lg flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search product by name"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* content */}
                <div className="flex flex-1 overflow-hidden">
                    <ProductGrid
                        products={searchProducts()}
                        addToCart={addToCart}
                    />
                    <CartPanel
                        cartItems={items}
                        subtotal={subtotal}
                        onClearCart={clearCart}
                        onRemoveItem={removeItem}
                        onUpdateQuantity={updateItem}
                    />
                </div>
            </div>
        </>
    );
}
