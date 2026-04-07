<?php
 
 namespace App\Http\Controllers\Api\V1;
 
 use App\Http\Controllers\Controller;
 use App\Models\Indikator;
 use App\Models\Aspek;
 use Illuminate\Http\Request;
 
 class IndikatorController extends Controller
 {
     public function index()
     {
         $aspeks = Aspek::with('indikators')->get();
         return response()->json([
             'success' => true,
             'data' => $aspeks
         ]);
     }
 }
