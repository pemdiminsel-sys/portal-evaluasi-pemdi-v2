<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penilaian extends Model
{
    protected $fillable = [
        'opd_id',
        'indikator_id',
        'periode_id',
        'nilai_mandiri',
        'penjelasan_mandiri',
        'nilai_verifikasi',
        'catatan_verifikasi',
        'status',
    ];

    public function opd()
    {
        return $this->belongsTo(Opd::class);
    }

    public function indikator()
    {
        return $this->belongsTo(Indikator::class);
    }

    public function periode()
    {
        return $this->belongsTo(Periode::class);
    }

    public function buktis()
    {
        return $this->hasMany(Bukti::class);
    }
}
