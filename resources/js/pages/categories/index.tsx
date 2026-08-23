import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Category } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type CategoriesWithCount = Category & { products_count: number };
interface CategoriesProps {
    categories: CategoriesWithCount[];
}

export default function CategoriesIndex({ categories }: CategoriesProps) {
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null,
    );

    const { data, setData, reset, errors, processing, post, put } = useForm({
        name: '',
        description: '',
    });

    const saveCategory = (e: React.FormEvent) => {
        e.preventDefault();
        const opts = {
            onSuccess: () => {
                reset();
                setShowForm(false);
                setEditingCategory(null);
                toast.success(
                    editingCategory ? 'Category updated.' : 'Category created.',
                );
            },
        };

        if (editingCategory) {
            put(`/categories/${editingCategory.id}`, opts);
        } else {
            post('/categories', opts);
        }
    };

    const deleteCategory = (category: CategoriesWithCount) => {
        if (category.products_count > 0) {
            toast.error(
                `Cannot delete category "${category.name}". It has ${category.products_count} products`,
            );

            return;
        }

        if (!confirm(`Delete "${category.name}"?`)) {
            return;
        }

        router.delete(`/categories/${category.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Category deleted.');
            },
        });
    };

    const openCreateForm = () => {
        setEditingCategory(null);
        setShowForm(true);
    };

    const editCategory = (category: Category) => {
        setEditingCategory(category);
        setData('name', category.name);
        setData('description', category.description ?? '');
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingCategory(null);
        reset();
    };

    return (
        <>
            <Head title="Categories" />
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <Button onClick={openCreateForm}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                    </Button>
                </div>
                <div>
                    <div className="rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Products
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-4 py-3 text-center"
                                        >
                                            <p>There is nothing here...yet</p>
                                        </td>
                                    </tr>
                                )}
                                {categories.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="border-b hover:bg-muted/50"
                                    >
                                        <td className="px-4 py-3">
                                            {category.name}
                                        </td>
                                        <td className="px-4 py-3">
                                            {category.products_count}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button
                                                onClick={() =>
                                                    editCategory(category)
                                                }
                                                className="mr-2"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    deleteCategory(category)
                                                }
                                                variant="destructive"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Dialog open={showForm} onOpenChange={closeForm}>
                <DialogContent>
                    <DialogTitle>
                        {editingCategory ? 'Edit Category' : 'Add Category'}
                    </DialogTitle>
                    <div className="no-scrollbar -mx-4 max-h-[80vh] overflow-y-auto px-4">
                        <form onSubmit={saveCategory} className="space-y-4">
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
                                <Label
                                    htmlFor="description"
                                    className="mb-2 block"
                                >
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
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={closeForm}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? 'Saving...'
                                        : editingCategory
                                          ? 'Update'
                                          : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

CategoriesIndex.layout = {
    Breadcrumb: [
        {
            title: 'Categories',
            href: '/categories',
        },
    ],
};
