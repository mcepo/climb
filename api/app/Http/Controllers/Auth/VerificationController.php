<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\User;

use Illuminate\Auth\Access\AuthorizationException;

class VerificationController extends Controller
{

    private function _generateVerificationHash($user): string
    {
        return sha1($user->getEmailForVerification());
    }

    private function _checkVerificationHash($user, $hash): bool
    {
        return hash_equals($this->_generateVerificationHash($user), $hash);
    }

    public function verify(Request $request)
    {
        $user = User::findOrFail($request->route('id'));

        if (!$this->_checkVerificationHash($user, $request->get('hash'))) 
        {
            throw new AuthorizationException;
        }

        $user->markEmailAsVerified();

        Auth::login($user);

        return redirect('/?token=' . auth()->user()->getToken());
    }

    public function resend(Request $request)
    {
        if(!$request->has('email')) 
        {
            return abort(400);
        }

        $user = User::where('email', $request->get('email'))->firstOrFail();

        if ($user->hasVerifiedEmail()) 
        {
            return response('Email already verified', 204);
        }

        $user->sendEmailVerificationMail();

        return response('Verification email resend to '.$request->get('email'), 200);
    }
}
