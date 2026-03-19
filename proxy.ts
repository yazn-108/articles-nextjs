import { getServerSession } from 'next-auth';
import { NextResponse, type NextRequest } from 'next/server';
import { authOptions } from './app/api/auth/[...nextauth]/route';
export async function proxy(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(new URL('/api/auth/signin', request.url))
  }
  if (session.user.id.toString() !== process.env.ADMIN_ID) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}
export const config = {
  matcher: ['/dashboard/:path*', '/api/admin/:path*'],
}