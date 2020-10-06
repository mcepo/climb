<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\Filters\QueryFilter;
use App\Models\Traits\Filterable;

use \Firebase\JWT\JWT;

use Illuminate\Support\Facades\Mail;
use App\Mail\EmailVerification;
use App\Mail\EmailPasswordReset;

use App\Models\Area;

class User extends AuthUser  implements MustVerifyEmail
{
    use SoftDeletes, QueryFilter, Filterable;

    // role ids
    const ADMIN = 1;
    const USER = 2;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'avatar', 'role_id', 'permitted_paths'
    ];

    protected $casts = [
        'permitted_paths' => 'array'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'google_id', 'ts_vector'
    ];

    public static function boot()
    {
        parent::boot();

        self::saving(function ($model) {
            $model->updateTsVector();
        });
    }

    public function updateTsVector()
    {
        $string = $this->name . ' ' . $this->email;

        $tsVectorString = str_replace(" ", " || ", $string);
        $this->ts_vector = \DB::raw('to_tsvector(\'simple\',\'' . $tsVectorString . '\')');
    }

    public static function search($request)
    {
        return self::filter($request)->get();
    }

    public function setPasswordAttribute($password)
    {
        $this->attributes['password'] = bcrypt($password);
    }

    public static function getByProviderId($providerName, $providerId)
    {
        return self::where($providerName . '_id', $providerId)->first();
    }

    public static function registerFromProvider($provider, $providerUser)
    {

        $methodName = 'registerFrom' . ucwords($provider) . 'Provider';

        if (method_exists(self::class, $methodName)) {
            return self::$methodName($providerUser);
        }
    }

    public function isOwnerOf($item)
    {
        return $item->owner_id ? $item->owner_id == $this->id : false;
    }

    public static function scopeAdmins($query)
    {
        return $query->where('role_id', self::ADMIN);
    }

    public function isAdmin()
    {
        return $this->role_id == self::ADMIN;
    }

    public function areas()
    {
        return $this->belongsToMany(Area::class);
    }

    public function hasPermissionInArea($path)
    {

        if (!is_array($this->areas)) return false;

        foreach ($this->areas as $permittedArea) {
            if (substr($path, 0, strlen($permittedArea->path)) === $permittedArea->path)
                return true;
        }
        return false;
    }

    public static function registerFromGoogleProvider($providerUser)
    {
        // if there is a user with that email join him with user 
        // from google
        if (!$user = User::where('email', $providerUser->email)->first()) {
            $user = new User((array) $providerUser);
        }
        $user->google_id = $providerUser->id;
        $user->avatar = $providerUser->avatar;
        $user->role_id = self::USER;
        $user->email_verified_at = now();
        $user->save();
        return $user;
    }

    public function getToken()
    {
        // using app key for signiture, the key string is in format
        // base64:KEY
        // so i need to get the key and base64 decode it
        $key = base64_decode(explode(':', config('app.key'))[1]);

        return JWT::encode($this, $key);
    }

    public function sendEmailVerificationMail()
    {
        Mail::to($this)->send(new EmailVerification($this));
    }

    public function sendPasswordResetLink()
    {
        Mail::to($this)->send(new EmailPasswordReset($this));
    }

    public function hasVerifiedEmail()
    {
        return $this->email_verified_at != null;
    }

    public function getEmailForVerification()
    {

        return (config("app.key") . $this->email);
    }


    public static function register($userArray)
    {
        // email should be unique
        // so check by email if user exists first
        if ($user = self::where('email', $userArray['email'])->first()) {
            return false;
        }
        $user = self::make($userArray);
        $user->role_id = self::USER;
        $user->save();
        return $user;
    }
}
