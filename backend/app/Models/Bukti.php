<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bukti extends Model
{
    protected $fillable = [
        'penilaian_id',
        'nama_file',
        'file_path',
        'file_type',
        'file_size',
    ];

    public function penilaian()
    {
        return $this->belongsTo(Penilaian::class);
    }
}
