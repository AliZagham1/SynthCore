import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/', // Landing page is public
  '/sign-in(.*)', // Sign-in route is public
  '/sign-up(.*)',  
  '/api/webhook(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
 
  // Check if the current route is not public
  if (!isPublicRoute(request)) {
    console.log("Protected route: Ensuring user is authenticated.");
    // Protect the route: Redirects to sign-in if the user is not authenticated
    await auth.protect();
  }
  else {
    console.log("Public route: No authentication required.");
  }
});

export const config = {
  matcher: [
    // Apply middleware only to specific routes
    '/dashboard/:path*', // Protect the /dashboard route and its subroutes
    '/(api|trpc)(.*)', // Protect API routes if necessary
    ], 
};
