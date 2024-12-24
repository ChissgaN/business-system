<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Expenses;
use App\Models\Purchases;
use App\Models\Sales;
use App\Models\User;
use Inertia\Inertia;

class BalanceController extends Controller
{
    public function index(Request $request)
{
    // Obtener los parámetros de mes y año de la solicitud
    $month = $request->input('month', now()->month);
    $year = $request->input('year', now()->year);
    $users = User::all();

    // Filtrar y calcular los totales de ventas, compras y gastos con los parámetros actuales
    $sales = Sales::whereMonth('document_date', $month)
        ->whereYear('document_date', $year)
        ->where('payment_status', 0)  // Solo ventas pagadas
        ->get();
    $totalSales = $sales->sum('total');

    $purchases = Purchases::whereMonth('document_date', $month)
        ->whereYear('document_date', $year)
        ->where('order_status', 1)  // Solo compras recibidas
        ->where('payment_status', 2) // Solo compras pagadas
        ->get();
    $totalPurchases = $purchases->sum('total');

    $expenses = Expenses::whereMonth('date', $month)
        ->whereYear('date', $year)
        ->get();
    $totalExpenses = $expenses->sum('amount');

    return Inertia::render('Auth/Balance', [
        'users' => $users,
        'sales' => $sales,
        'purchases' => $purchases,
        'expenses' => $expenses,
        'totals' => [
            'sales' => $totalSales,
            'purchases' => $totalPurchases,
            'expenses' => $totalExpenses,
        ],
    ]);
}
}
