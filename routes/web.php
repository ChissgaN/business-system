<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\PurchaseProductsController;
use App\Http\Controllers\PurchasesController;
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
     
    Route::delete('/purchase/{purchase}', [PurchasesController::class, 'destroy'])->name('purchases.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/purchase-product', [PurchaseProductsController::class, 'index'])->name('purchase-product.index');
    Route::post('/purchase-product/create', [PurchaseProductsController::class, 'store'])->name('purchase-product.store');
    Route::put('/purchase-product/{purchase-product}', [PurchaseProductsController::class, 'update'])->name('purchase-product.update');
    Route::delete('/purchase-product/{purchase-product}', [PurchaseProductsController::class, 'destroy'])->name('purchase-product.destroy');
});

// en routes/web.php
Route::post('/purchase-product/bulk-create', [PurchaseProductsController::class, 'bulkCreate'])->name('purchase-product.bulk-create');

require __DIR__.'/auth.php';

