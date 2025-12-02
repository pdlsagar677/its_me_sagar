import { NextRequest, NextResponse } from "next/server";
import { sessionService, userService } from "@/lib/mongodb/authService";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('cookie')?.match(/auth-token=([^;]+)/)?.[1];
    
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const session = await sessionService.getSession(token);
    
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const user = await userService.findUserById(session.userId);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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

    return NextResponse.json(userData, { status: 200 });

  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}