<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\Sales;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SalesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $sales = Sales::with('user')->get();
            $users = User::all();
            $products = Products::all();

            return Inertia::render('Auth/Sales', [
                'sales' => $sales,
                'users' => $users,
                'products' => $products,
            ]);
        } catch (\Exception $e) {
            return Redirect::route('sales')->with('error', 'Error al cargar las compras: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::all();
        $products = Products::all();

        return Inertia::render('Auth/Sales', [
            'users' => $users,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'document_date' => 'required|date',
            'payment_status' => 'required|integer|min:0|max:2',
            'total' => 'required|numeric|min:0',
        ]);

        try {
            $formattedDate = Carbon::parse($request->input('document_date'))->format('Y-m-d H:i:s');

            $sale = Sales::create([
                'user_id' => $request->input('user_id'),
                'document_date' => $formattedDate,
                'payment_status' => $request->input('payment_status'),
                'total' => $request->input('total'),
            ]);

            return Redirect::route('sales.index')->with('success', 'Venta creada exitosamente.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Error al crear la venta: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Sales $sales)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sales $sales)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|integer',
            'document_date' => 'required|date',
            'payment_status' => 'required|integer',
            'total' => 'required|numeric',
        ]);
        $sale = Sales::findOrFail($id);
        $sale->update($validatedData);
        return Redirect::route('sales.index')->with('success', 'Venta editada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sales $sale)
    {
        try {
            $sale->delete();
            return Redirect::route('sales.index')->with('success', 'Venta eliminada exitosamente.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Error al eliminar la venta: ' . $e->getMessage());
        }
    }
}
