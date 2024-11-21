<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\Purchases;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class PurchasesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $purchases = Purchases::with('user')->get();
            $users = User::all();
            $products = Products::all();

            return Inertia::render('Auth/Purchases', [
                'purchases' => $purchases,
                'users' => $users,
                'products' => $products,
            ]);
        } catch (\Exception $e) {
            return Redirect::route('purchases')->with('error', 'Error al cargar las compras: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::all();
        $products = Products::all();

        return Inertia::render('Auth/Purchases', [
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
        'order_status' => 'required|integer|min:0|max:2',
        'payment_status' => 'required|integer|min:0|max:2',
        'total' => 'required|numeric|min:0',
    ]);

    try {
        // Convertir el formato de la fecha al formato MySQL compatible
        $formattedDate = Carbon::parse($request->input('document_date'))->format('Y-m-d H:i:s');

        $purchase = Purchases::create([
            'user_id' => $request->input('user_id'),
            'document_date' => $formattedDate,
            'order_status' => $request->input('order_status'),
            'payment_status' => $request->input('payment_status'),
            'total' => $request->input('total'),
        ]);

        return Redirect::route('purchases.index')->with('success', 'Compra creada exitosamente.');
    } catch (\Exception $e) {
        return Redirect::back()->with('error', 'Error al crear la compra: ' . $e->getMessage());
    }
}

    /**
     * Display the specified resource.
     */
    public function show(Purchases $purchases)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Purchases $purchases)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Purchases $purchases)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'document_date' => 'required|date',
            'order_status' => 'required|integer|min:0|max:2',
            'payment_status' => 'required|integer|min:0|max:2',
            'total' => 'required|numeric|min:0',
        ]);
        try {
            $purchases->update($request->all());
            return Redirect::route('purchases.index')->with('success', 'Compra actualizado exitosamente.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Error al actualizar la compra: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Purchases $purchases)
    {
        try {
            $purchases->delete();
            return Redirect::route('purchases.index')->with('success', 'Compra eliminada exitosamente.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Error al eliminar la compra: ' . $e->getMessage());
        }
    }
}
