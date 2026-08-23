import { Button } from '@/components/ui/button';
import type { Product } from '@/types';

interface ProductGridProps {
    products: Product[];
    addToCart: (product: Product) => void;
}

export default function ProductGrid({ products, addToCart }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center text-center">
                <p>No products found</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div className="h-48 w-full overflow-hidden">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                    <p className="text-xs text-muted-foreground">
                                        No image
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex w-full flex-col items-start gap-3 p-3">
                            <h3 className="text-md font-medium">
                                {product.name}
                            </h3>
                            <div className="flex w-full flex-wrap items-center justify-between">
                                <p className="text-md font-semibold text-foreground">
                                    ${product.price}
                                </p>
                                <p className="rounded-full bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                                    Stock: {product.stock}
                                </p>
                            </div>
                            <Button
                                className="mt-auto w-full cursor-pointer"
                                onClick={() => addToCart(product)}
                            >
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
