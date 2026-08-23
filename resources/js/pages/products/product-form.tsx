import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { Category, Product } from '@/types';

import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

interface ProductFormProps {
    categories: Category[];
    product?: Product | null;
    onClose: () => void;
}

export default function ProductForm({
    categories,
    product,
    onClose,
}: ProductFormProps) {
    const { data, setData, post, put, errors, reset, processing } = useForm({
        name: product?.name ?? '',
        description: product?.description ?? '',
        price: product?.price ?? '',
        stock: product?.stock.toString() ?? '',
        category_id: product?.category_id.toString() ?? '',
        is_active: product?.is_active ?? true,
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const opts = {
            forceFormData: true,
            onSuccess: () => {
                toast.success(
                    product ? 'Product updated.' : 'Product created.',
                );
                reset();
                onClose();
            },
        };

        if (product) {
            put(`/products/${product.id}`, opts);
        } else {
            post('/products', opts);
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>
                    {product ? 'Edit Product' : 'Add Product'}
                </DialogTitle>

                <div className="no-scrollbar -mx-4 max-h-[80vh] overflow-y-auto px-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="mb-2 block">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <Label htmlFor="category_id" className="mb-2 block">
                                Category
                            </Label>
                            <Select
                                value={data.category_id}
                                onValueChange={(value) =>
                                    setData('category_id', value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id.toString()}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category_id} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData('price', e.target.value)
                                    }
                                />
                                <InputError message={errors.price} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock</Label>
                                <Input
                                    id="stock"
                                    value={data.stock}
                                    onChange={(e) =>
                                        setData('stock', e.target.value)
                                    }
                                />
                                <InputError message={errors.stock} />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description" className="mb-2 block">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div>
                            <Label htmlFor="image" className="mb-2 block">
                                Image
                            </Label>
                            <Input
                                id="image"
                                type="file"
                                onChange={(e) =>
                                    setData(
                                        'image',
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                            />
                            <InputError message={errors.image} />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Label htmlFor="is_active">Status</Label>
                            <Switch
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) =>
                                    setData('is_active', checked)
                                }
                            />
                            <InputError message={errors.is_active} />
                        </div>

                        <div className="flex items-center justify-end space-x-2">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {product ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
