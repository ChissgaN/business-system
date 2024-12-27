<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Expenses;
use App\Models\Purchases;
use App\Models\Sales;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class BalanceController extends Controller
{
    public function index(Request $request)
    {
        // Validar los parámetros recibidos
        $validator = Validator::make($request->all(), [
            'month' => 'nullable|integer|min:1|max:12',
            'year' => 'nullable|integer|min:2000|max:' . now()->year,
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Parámetros inválidos'], 422);
        }

        // Obtener parámetros enviados o usar valores por defecto
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        // Obtener usuarios
        $users = User::all();

        // Filtrar ventas
        $sales = Sales::query()
            ->whereYear('document_date', $year)
            ->whereMonth('document_date', $month)
            ->where('payment_status', 0)
            ->get();
        $totalSales = $sales->sum('total');

        // Filtrar compras
        $purchases = Purchases::query()
            ->whereYear('document_date', $year)
            ->whereMonth('document_date', $month)
            ->where('order_status', 1)
            ->where('payment_status', 2)
            ->get();
        $totalPurchases = $purchases->sum('total');

        // Filtrar gastos
        $expenses = Expenses::query()
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->get();
        $totalExpenses = $expenses->sum('amount');

        // Retornar los datos a la vista
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
            'filters' => [
                'month' => $month,
                'year' => $year,
            ],
        ]);
    }
}
