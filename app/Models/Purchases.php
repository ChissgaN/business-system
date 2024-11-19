<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchases extends Model
{
    /** @use HasFactory<\Database\Factories\PurchasesFactory> */
    use HasFactory;
    protected $fillable = [
        'user_id',
        'document_date',
        'order_status',
        'payment_status',
        'total',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function purchaseProducts()
    {
        return $this->hasMany(PurchaseProducts::class);
    }
}
