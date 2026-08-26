import { Button } from '@/components/ui/button';
import type { Sale } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';

interface Props {
    sale: Sale;
}

export default function Receipt({ sale }: Props) {
    return (
        <>
            <Head title={`Receipt #${sale.id}`} />

            <div className="">
                <div className="border-b px-4 py-4 print:hidden">
                    <div className="flex items-center gap-4">
                        <Button asChild variant={'secondary'}>
                            <Link href="/pos">
                                <ArrowLeft className="h-4 w-4" />
                                Back to POS
                            </Link>
                        </Button>
                        <Button
                            variant={'default'}
                            className="cursor-pointer"
                            onClick={() => window.print()}
                        >
                            <Printer className="h-4 w-4" />
                            Print Receipt
                        </Button>
                    </div>
                </div>

                <div className="mx-auto max-w-4xl p-4 print:max-w-none print:p-0">
                    <h1 className="my-8 text-center text-2xl font-bold">
                        Official Receipt
                    </h1>

                    <div className="flex justify-between">
                        <div className="space-y-2">
                            <p>
                                <strong>Receipt No:</strong> #
                                {'Receipt #' + sale.id}
                            </p>
                            <p>
                                <strong>Status:</strong> {sale.status}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p>
                                <strong>Date:</strong>{' '}
                                {new Date(sale.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <table className="mt-4 w-full border text-center">
                        <thead>
                            <tr>
                                <th className="border p-2 text-start">
                                    Product
                                </th>
                                <th className="border p-2">Quantity</th>
                                <th className="border p-2">Unit Price</th>
                                <th className="border p-2">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sale.items.map((item) => (
                                <tr key={item.id}>
                                    <td className="border px-2 py-0 text-start">
                                        {item.product_name}
                                    </td>
                                    <td className="border px-2 py-0">
                                        {item.quantity}
                                    </td>
                                    <td className="border px-2 py-0">
                                        {item.unit_price}
                                    </td>
                                    <td className="border p-2">
                                        {item.subtotal}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-accent">
                                <td
                                    colSpan={3}
                                    className="border px-2 py-2 text-start font-semibold"
                                >
                                    Total:
                                </td>
                                <td className="border px-2 py-2 font-bold">
                                    {sale.total}
                                </td>
                            </tr>
                            <tr className="bg-accent">
                                <td
                                    colSpan={3}
                                    className="border px-2 py-2 text-start font-semibold"
                                >
                                    Cash:
                                </td>
                                <td className="border px-2 py-2 font-bold">
                                    {sale.cash_tendered}
                                </td>
                            </tr>
                            <tr className="bg-accent">
                                <td
                                    colSpan={3}
                                    className="border px-2 py-2 text-start font-semibold"
                                >
                                    Change:
                                </td>
                                <td className="border px-2 py-2 font-bold">
                                    {sale.change_amount}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="mt-10">
                        <p className="text-center text-muted-foreground">
                            Thank you for your purchase!
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
