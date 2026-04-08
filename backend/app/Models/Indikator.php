<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Indikator extends Model
{
    protected $fillable = [
        'aspek_id',
        'kode',
        'nama',
        'penjelasan',
        'bobot',
        'urutan',
    ];

    public function aspek()
    {
        return $this->belongsTo(Aspek::class);
    }

    public function penilaians()
    {
        return $this->hasMany(Penilaian::class);
    }

    public function opds()
    {
        return $this->belongsToMany(Opd::class, 'opd_indikators', 'indikator_id', 'opd_id')
                    ->withPivot('is_responsibility')
                    ->withTimestamps();
    }
}
