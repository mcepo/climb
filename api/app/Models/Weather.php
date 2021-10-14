<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Weather extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    protected $casts = [
        // Current weather
        'current' => 'array',
        // Minute forecast for 1 hour
        'minutely' => 'array',
        // Hourly forecast for 48 hours
        'hourly' => 'array',
        // Daily forecast for 7 days
        'daily' => 'array',
    ];
}
