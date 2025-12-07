<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InstitutionMiddleware
{
    /**
     * Handle an incoming request.
     * Proverava da li je korisnik ulogovan i da li ima ulogu institucije (role_as = 2)
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isInstitution()) {
            return response()->json([
                'message' => 'Forbidden. Institution access only.'
            ], 403);
        }

        return $next($request);
    }
}
