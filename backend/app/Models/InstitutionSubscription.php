<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class InstitutionSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'institution_user_id',
        'membership_id',
        'status',
        'started_at',
        'ends_at',
        'payment_reference',
        'auto_renew',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ends_at' => 'datetime',
        'auto_renew' => 'boolean',
    ];

    public function institution()
    {
        return $this->belongsTo(User::class, 'institution_user_id');
    }

    public function membership()
    {
        return $this->belongsTo(Membership::class);
    }

    public function isActive()
    {
        return $this->status === 'active' && $this->ends_at > Carbon::now();
    }

    public function isExpired()
    {
        return $this->ends_at && $this->ends_at < Carbon::now();
    }

    public function daysRemaining()
    {
        if (!$this->ends_at) {
            return 0;
        }
        return max(0, Carbon::now()->diffInDays($this->ends_at, false));
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active')->where('ends_at', '>', Carbon::now());
    }
}
