import { NextRequest, NextResponse } from "next/server";
import { sessionService } from "@/lib/mongodb/dbService";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (token) {
      await sessionService.deleteSession(token);
    }

    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear cookie
    response.cookies.delete('auth-token');
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}