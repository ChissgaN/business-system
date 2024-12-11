<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expenses extends Model
{
    /** @use HasFactory<\Database\Factories\ExpensesFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'date',
        'amount',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

