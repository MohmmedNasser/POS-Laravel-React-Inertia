<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;

class PosController extends Controller
{
    public function index() {

        $products = Product::with('category')->where('is_active', true)->where('stock', '>', 0)->orderBy('name')->get();
        return Inertia::render('pos/index', [
            'products' => $products,
        ]);
    }
}
