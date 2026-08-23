import { Head, router } from '@inertiajs/react';
import { Pencil, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Category, Product } from '@/types';
import ProductForm from './product-form';
import { cn } from '@/lib/utils';

interface ProductIndexProps {
    products: Product[];
    categories: Category[];
}

export default function ProductsIndex({
    products,
    categories,
}: ProductIndexProps) {
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleDelete = (product: Product) => {
        if (!confirm(`Delete "${product.name}"?`)) {
            return;
        }

        router.delete(`/products/${product.id}`, {
            preserveScroll: true,
        });
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    return (
        <>
            <Head title="Products" />
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Products</h1>
                    <Button
                        onClick={() => {
                            setEditingProduct(null);
                            setShowForm(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </div>
                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-right">Price</th>
                                <th className="px-4 py-3 text-right">Stock</th>
                                <th className="px-4 py-3 text-center">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No products yet. Click "Add Product" to
                                        get started.
                                    </td>
                                </tr>
                            )}
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b hover:bg-muted/50"
                                >
                                    <td className="px-4 py-3">
                                        {product.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {product.category?.name}
                                    </td>
                                    <td className={`px-4 py-3 text-right`}>
                                        {product.price} $
                                    </td>
                                    <td
                                        className={cn('px-4 py-3 text-right', {
                                            'font-semibold text-orange-600':
                                                product.stock <= 5,
                                        })}
                                    >
                                        {product.stock === 0 ? (
                                            <span>Out of Stock</span>
                                        ) : (
                                            product.stock
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {product.is_active ? (
                                            <Badge variant="default">
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">
                                                Inactive
                                            </Badge>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Button
                                            onClick={() => handleEdit(product)}
                                            variant="outline"
                                            size="sm"
                                            className="mr-2"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleDelete(product)
                                            }
                                            variant="destructive"
                                            size="sm"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showForm && (
                    <ProductForm
                        categories={categories}
                        product={editingProduct}
                        onClose={handleClose}
                    />
                )}
            </div>
        </>
    );
}

ProductsIndex.layout = {
    Breadcrumb: [
        {
            title: 'Products',
            href: '/products',
        },
    ],
};
