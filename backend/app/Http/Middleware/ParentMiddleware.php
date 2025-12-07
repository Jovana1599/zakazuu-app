<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ParentMiddleware
{
    /**
     * Proverava da li je korisnik ulogovan i da li ima ulogu roditelja (role_as = 0)
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isParent()) {
            return response()->json([
                'message' => 'Forbidden. Parent access only.'
            ], 403);
        }

        return $next($request);
    }
}
