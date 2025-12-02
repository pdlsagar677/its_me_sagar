import { NextRequest, NextResponse } from "next/server";
import { sessionService, userService, verifyPassword } from "@/lib/mongodb/authService";

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const session = await sessionService.getSession(token);
    if (!session) {
      return NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
      );
    }

    const user = await userService.findUserById(session.userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { password } = await request.json();
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const isPasswordValid = verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    // Delete user sessions
    await sessionService.deleteUserSessions(user.id);
    
    // Delete user account
    await userService.deleteUser(user.id);

    const response = NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );

    // Clear cookie
    response.cookies.delete('auth-token');
    
    return response;

  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}