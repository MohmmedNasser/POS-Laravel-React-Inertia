import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Sale } from '@/types';

interface StatsProps {
    today_revenue: number;
    today_transactions: number;
    total_products: number;
    low_stock_count: number;
}

interface TopProductProps {
    product_name: string;
    total_qty: number;
    total_revenue: number;
}

interface DashboardProps {
    stats: StatsProps;
    top_products: TopProductProps[];
    recent_sales: Sale[];
}

export default function Dashboard({
    stats,
    top_products,
    recent_sales,
}: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Today's Revenue"
                        value={`$ ${stats.today_revenue}`}
                        highlight
                    />
                    <StatCard
                        title="Transactions Today"
                        value={`${stats.today_transactions.toString()}`}
                    />
                    <StatCard
                        title="Active Products"
                        value={`${stats.total_products.toString()}`}
                    />
                    <StatCard
                        title="Low Stock"
                        value={`${stats.low_stock_count}`}
                    />
                </div>
                <div className="grid items-start gap-4 lg:grid-cols-2">
                    {/* Top products */}
                    <div className="rounded-lg border">
                        <div className="border-b px-4 py-3">
                            <h2 className="font-semibold">
                                Top Products Today
                            </h2>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <td className="px-4 py-3 text-left">
                                        Product
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        Units
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        Revenue
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {top_products.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-4 py-6 text-center text-muted-foreground"
                                        >
                                            No sales today yet.
                                        </td>
                                    </tr>
                                ) : (
                                    top_products.map((top) => (
                                        <tr>
                                            <td className="px-4 py-2">
                                                {top.product_name}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                {top.total_qty}
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                {top.total_revenue}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Recent Sales */}
                    <div className="rounded-lg border">
                        <div className="border-b px-4 py-3">
                            <h2 className="font-semibold">Recent Sales</h2>
                        </div>
                        <div className="divide-y">
                            {recent_sales.length === 0 ? (
                                <div className="px-4 py-6 text-center text-muted-foreground">
                                    No sales recorded yet.
                                </div>
                            ) : (
                                recent_sales.map((sale) => (
                                    <div
                                        key={sale.id}
                                        className="flex items-center justify-between px-4 py-3"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold">
                                                Sale #{sale.id}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {sale.items
                                                    .map(
                                                        (i) =>
                                                            `${i.product_name} ×${i.quantity}`,
                                                    )
                                                    .join(', ')}
                                            </p>
                                        </div>
                                        <div className="text-sm font-semibold">
                                            <p className="text-end">
                                                $ {sale.total}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(
                                                    sale.created_at,
                                                ).toLocaleString('en-GB', {
                                                    year: 'numeric',
                                                    month: 'numeric',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

function StatCard({
    title,
    value,
    highlight = false,
}: {
    title: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    className={cn(
                        'text-xl font-bold sm:text-2xl',
                        highlight ? 'text-green-600' : 'text-foreground',
                    )}
                >
                    {value}
                </div>
            </CardContent>
        </Card>
    );
}
