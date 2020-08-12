<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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

        $user = User::find($request->route('id'));

        if (!$this->_checkVerificationHash($user, $request->get('hash'))) {
            throw new AuthorizationException;
        }

        $user->markEmailAsVerified();

        return redirect('/');
    }

    public function resend(Request $request)
    {

        $user = auth()->user();

        if ($user->hasVerifiedEmail()) {
            return response(null, 204);
        }

        $user->sendEmailVerificationMail();

        return response(null, 200);
    }
}
