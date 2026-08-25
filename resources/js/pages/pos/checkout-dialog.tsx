import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { cartItem } from '@/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface props {
    open: boolean;
    items: cartItem[];
    subtotal: number;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CheckoutDialog({
    open,
    items,
    subtotal,
    onClose,
    onSuccess,
}: props) {
    const [cashInput, setCashInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cash = parseFloat(cashInput) || 0;
    const changeDue = cash - subtotal;

    function handleCheckOut() {
        setError(null);
        setLoading(true);

        if (isNaN(cash) || cash < subtotal) {
            setError('Cash amount is less than the total');
            setLoading(false);
            return;
        }

        router.post(
            '/checkout',
            {
                items: items.map((item) => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                })),
                cash_tendered: cash,
            },
            {
                onSuccess: () => {
                    setLoading(false);
                    onSuccess();
                    onClose();
                    setCashInput('');
                },
                onError: (errors) => {
                    setLoading(false);
                    setError(Object.values(errors)[0] as string);
                    toast.error('Checkout failed. Please check the errors.');
                },
            },
        );
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Checkout</DialogTitle>
                    </DialogHeader>
                    <div>
                        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="overflow-y-auto">
                                {items.map((i) => (
                                    <div
                                        key={i.product.id}
                                        className="flex justify-between space-y-2 text-sm"
                                    >
                                        <span className="">
                                            {i.product.name} ×{' '}
                                            <span className="font-bold">
                                                {i.quantity}
                                            </span>
                                        </span>
                                        <span className="font-bold">
                                            $
                                            {(
                                                parseFloat(i.product.price) *
                                                i.quantity
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 flex items-center justify-between">
                                <p className="text-lg font-bold">Total:</p>
                                <p className="text-lg font-bold">
                                    ${subtotal.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 space-y-2">
                                <Label htmlFor="cash" className="text-base">
                                    Cash Tendered
                                </Label>
                                <Input
                                    className="mt-2 py-5"
                                    id="cash"
                                    type="number"
                                    step="0.01"
                                    min={subtotal.toFixed(2)}
                                    placeholder="0.00"
                                    value={cashInput}
                                    onChange={(e) => {
                                        setCashInput(e.target.value);
                                        setError(null);
                                    }}
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <p className="mt-2 text-sm text-red-500">
                                    {error}
                                </p>
                            )}

                            {cashInput && (
                                <div className="my-5 flex items-center justify-between">
                                    <p className="text-lg font-bold">Change:</p>
                                    <p
                                        className={`text-lg font-bold ${
                                            cash >= subtotal
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}
                                    >
                                        ${changeDue.toFixed(2)}
                                    </p>
                                </div>
                            )}

                            <Button
                                className="w-full"
                                size="lg"
                                disabled={
                                    loading || !cashInput || cash < subtotal
                                }
                                onClick={handleCheckOut}
                            >
                                {loading ? 'Processing…' : 'Complete Sale'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
