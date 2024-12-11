<?php

use App\Http\Controllers\ExpensesController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ProductSaleController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\PurchaseProductsController;
use App\Http\Controllers\PurchasesController;
use App\Http\Controllers\SalesController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/register', [RegisteredUserController::class, 'create'])
    ->middleware('guest')
    ->name('register');

Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Rutas protegidas para el perfil
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/products', [ProductsController::class, 'index'])->name('products.index');
    Route::post('/products/create', [ProductsController::class, 'store'])->name('products.store');
    Route::put('/products/{product}', [ProductsController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductsController::class, 'destroy'])->name('products.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/purchase', [PurchasesController::class, 'index'])->name('purchases.index');
    Route::post('/purchase/create', [PurchasesController::class, 'store'])->name('purchases.store');
    Route::put('/purchase/{purchase}', [PurchasesController::class, 'update'])->name('purchases.update');
    Route::delete('/purchase/{purchase}', [PurchasesController::class, 'destroy'])->name('purchases.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/purchase-products', [PurchaseProductsController::class, 'index'])->name('purchase-products.index');
    Route::post('/purchase-products/create', [PurchaseProductsController::class, 'store'])->name('purchase-products.store');
    Route::put('/purchase-products/{purchaseProducts}', [PurchaseProductsController::class, 'update'])->name('purchase-products.update');
    Route::delete('/purchase-products/{purchaseProduct}', [PurchaseProductsController::class, 'destroy'])
    ->name('purchase-products.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/sales', [SalesController::class, 'index'])->name('sales.index');
    Route::post('/sales/create', [SalesController::class, 'store'])->name('sales.store');
    Route::put('/sales/{sale}', [SalesController::class, 'update'])->name('sales.update');
    Route::delete('/sales/{sale}', [SalesController::class, 'destroy'])->name('sales.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/sales-products', [ProductSaleController::class, 'index'])->name('sales-products.index');
    Route::post('/sales-products/create', [ProductSaleController::class, 'store'])->name('sales-products.store');
    Route::put('/sales-products/{productSale}', [ProductSaleController::class, 'update'])->name('sales-products.update');
    Route::delete('/sales-products/{productSale}', [ProductSaleController::class, 'destroy'])->name('sales-products.destroy');
});

Route::middleware('auth')->group(function(){
    Route::get('/expenses', [ExpensesController::class, 'index'])->name('expenses.index');
    Route::post('/expenses/create', [ExpensesController::class, 'store'])->name('expenses.store');
    Route::put('/expenses/{expense}', [ExpensesController::class, 'update'])->name('expenses.update');
    Route::delete('/expenses/{expense}', [ExpensesController::class, 'destroy'])->name('expenses.destroy');
});
require __DIR__.'/auth.php';

