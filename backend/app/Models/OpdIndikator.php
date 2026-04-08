<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OpdIndikator extends Model
{
    protected $fillable = [
        'opd_id',
        'indikator_id',
        'is_responsibility',
    ];

    protected $casts = [
        'is_responsibility' => 'boolean',
    ];

    public function opd()
    {
        return $this->belongsTo(Opd::class);
    }

    public function indikator()
    {
        return $this->belongsTo(Indikator::class);
    }
}
