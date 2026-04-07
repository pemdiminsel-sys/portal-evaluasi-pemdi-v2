<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aspek extends Model
{
    protected $fillable = [
        'nama',
        'bobot',
        'urutan',
    ];

    public function indikators()
    {
        return $this->hasMany(Indikator::class);
    }
}
