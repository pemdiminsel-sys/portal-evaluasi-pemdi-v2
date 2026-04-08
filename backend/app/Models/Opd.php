<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Opd extends Model
{
    protected $fillable = [
        'nama',
        'singkatan',
        'alamat',
        'kepala_opd',
        'pic',
        'kontak',
        'status_penilaian',
        'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function penilaians()
    {
        return $this->hasMany(Penilaian::class);
    }

    public function indikators()
    {
        return $this->belongsToMany(Indikator::class, 'opd_indikators', 'opd_id', 'indikator_id')
                    ->withPivot('is_responsibility')
                    ->withTimestamps();
    }
}
