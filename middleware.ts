import { NextResponse } from "next/server";

// No-op middleware. It exists so Next resolves middleware from THIS project
// root rather than pulling in a middleware file from a parent directory during
// local dev (this repo is often checked out as a git worktree beside the main
// checkout, which has its own Supabase auth middleware). The matcher targets a
// path that never exists, so this runs on zero routes in production.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/__noop__"],
};
