<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Poste extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
    ];

    /**
     * Get the affectations for the poste.
     */
    public function affectations(): HasMany
    {
        return $this->hasMany(Affectation::class);
    }
}
