<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SupabaseService
{
    protected $url;
    protected $storageUrl;
    protected $key;

    public function __construct()
    {
        $this->url = env('SUPABASE_URL') . '/rest/v1';
        $this->storageUrl = env('SUPABASE_URL') . '/storage/v1';
        $this->key = env('SUPABASE_ANON_KEY');
    }

    public function from($table)
    {
        return new class($this->url, $this->key, $table) {
            protected $url;
            protected $key;
            protected $table;
            protected $query = [];
            protected $headers = [];

            public function __construct($url, $key, $table)
            {
                $this->url = $url;
                $this->key = $key;
                $this->table = $table;
                $this->headers = [
                    'apikey' => $this->key,
                    'Authorization' => 'Bearer ' . $this->key,
                ];
            }

            public function select($columns = '*')
            {
                $this->query['select'] = $columns;
                return $this;
            }

            public function where($column, $value)
            {
                $this->query[$column] = 'eq.' . $value;
                return $this;
            }

            public function order($column, $direction = 'asc')
            {
                $this->query['order'] = "{$column}.{$direction}";
                return $this;
            }

            public function limit($count)
            {
                $this->query['limit'] = $count;
                return $this;
            }

            public function get()
            {
                $response = Http::withHeaders($this->headers)->get("{$this->url}/{$this->table}", $this->query);
                return $response->json();
            }

            public function count()
            {
                $response = Http::withHeaders(array_merge($this->headers, [
                    'Prefer' => 'count=exact'
                ]))->get("{$this->url}/{$this->table}", array_merge($this->query, ['limit' => '1']));
                
                $range = $response->header('Content-Range');
                if ($range && preg_match('/\/(.*)$/', $range, $matches)) {
                    return (int)$matches[1];
                }
                return count($response->json());
            }

            public function insert($data)
            {
                $response = Http::withHeaders(array_merge($this->headers, [
                    'Content-Type' => 'application/json',
                    'Prefer'       => 'return=representation',
                ]))->post("{$this->url}/{$this->table}", $data);

                return $response->json();
            }

            public function update($data)
            {
                $response = Http::withHeaders(array_merge($this->headers, [
                    'Content-Type' => 'application/json',
                    'Prefer'       => 'return=representation',
                ]))->patch("{$this->url}/{$this->table}", $data, $this->query);

                return $response->json();
            }

            public function upsert($data)
            {
                $response = Http::withHeaders(array_merge($this->headers, [
                    'Content-Type' => 'application/json',
                    'Prefer' => 'resolution=merge-duplicates'
                ]))->post("{$this->url}/{$this->table}", $data);

                return $response->json();
            }

            public function delete()
            {
                $response = Http::withHeaders($this->headers)->delete("{$this->url}/{$this->table}", $this->query);
                return $response->json();
            }
        };
    }

    public function uploadFile($bucket, $path, $file)
    {
        $response = Http::withHeaders([
            'apikey' => $this->key,
            'Authorization' => 'Bearer ' . $this->key,
        ])->attach('file', file_get_contents($file->getRealPath()), $file->getClientOriginalName())
          ->post("{$this->storageUrl}/object/{$bucket}/{$path}");

        return $response->json();
    }
}
