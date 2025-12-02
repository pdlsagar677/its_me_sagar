import { NextRequest } from 'next/server';
import { sessionService, userService } from '@/lib/mongodb/dbService';

export async function verifyAdmin(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const session = await sessionService.getSession(token);
    
    if (!session) {
      return null;
    }

    const user = await userService.findUserById(session.userId);
    
    if (!user || !user.isAdmin) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  } catch (error) {
    console.error("Admin verification error:", error);
    return null;
  }
}