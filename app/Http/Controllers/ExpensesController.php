<?php

namespace App\Http\Controllers;

use App\Models\Expenses;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ExpensesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $expenses = Expenses::all();
            $users = User::all();
            return Inertia::render('Auth/Expenses', [
                'expenses' => $expenses,
                'users' => $users,
            ]);
        } catch (\Exception $e) {
            return Redirect::route('expenses')->with('error', 'Error al cargar los gastos: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:45',
            'description' => 'required|string|max:90',
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0',
        ]);

        try {
            $formattedDate = Carbon::parse($request->input('date'))->format('Y-m-d H:i:s');

            $expense = Expenses::create([
                'user_id' => $request->input('user_id'),
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'date' => $formattedDate,
                'amount' => $request->input('amount'),
            ]);

            return Redirect::route('expenses.index')->with('success', 'Gasto creado exitosamente.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Error al crear un gasto: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Expenses $expenses)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Expenses $expenses)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Expenses $expenses)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:45',
            'description' => 'required|string|max:90',
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0',
        ]);
        try {
            $formattedDate = Carbon::parse($request->input('date'))->format('Y-m-d H:i:s');
            $expenses->update([
                'user_id' => $request->input('user_id'),
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'date' => $formattedDate,
                'amount' => $request->input('amount'),
            ]);
            return Redirect::route('expenses.index')->with('success', 'Gasto actualizado exitos');
            } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Error al actualizar el gasto: '. $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expenses $expenses)
    {
        try {
            $expenses->delete();
            return Redirect::route('expenses.index')->with('success', 'Gasto eliminado exitosamente.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Error al eliminar el gasto: '. $e->getMessage());
        }
    }
}
