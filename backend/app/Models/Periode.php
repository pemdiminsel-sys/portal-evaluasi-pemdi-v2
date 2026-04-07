<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Periode extends Model
{
    protected $fillable = [
        'tahun',
        'nama',
        'start_date',
        'end_date',
        'status',
        'keterangan',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function penilaians()
    {
        return $this->hasMany(Penilaian::class);
    }
}
