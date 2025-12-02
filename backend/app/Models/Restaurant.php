<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Restaurant extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
        'adresse',
        'code_postal',
        'ville',
    ];

    /**
     * Get the affectations for the restaurant.
     */
    public function affectations(): HasMany
    {
        return $this->hasMany(Affectation::class);
    }
}
