
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const routeMatcher = createRouteMatcher(["/", "/about", "/pricing", "/sign-in", "/sign-up"]);

export default clerkMiddleware((auth, req, evt) => {
  if (routeMatcher(req)) {
    return;
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};