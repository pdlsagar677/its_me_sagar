import { NextRequest, NextResponse } from "next/server";
import { sessionService, userService } from "@/lib/mongodb/dbService";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const session = await sessionService.getSession(token);
    
    if (!session) {
      const response = NextResponse.json({ user: null }, { status: 200 });
      response.cookies.delete('auth-token');
      return response;
    }

    const user = await userService.findUserById(session.userId);
    
    if (!user) {
      const response = NextResponse.json({ user: null }, { status: 200 });
      response.cookies.delete('auth-token');
      return response;
    }

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    };

    return NextResponse.json({ user: userData }, { status: 200 });

  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}