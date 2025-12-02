import { NextRequest, NextResponse } from "next/server";
import { userService, sessionService, verifyPassword } from "@/lib/mongodb/authService";

export async function POST(request: NextRequest) {
  try {
    const { emailOrUsername, password } = await request.json();

    // Validation
    if (!emailOrUsername?.trim()) {
      return NextResponse.json(
        { error: "Email or username is required" },
        { status: 400 }
      );
    }

    if (!password?.trim()) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Find user
    let user;
    const cleanInput = emailOrUsername.trim();
    
    if (cleanInput.includes('@')) {
      user = await userService.findUserByEmail(cleanInput);
    } else {
      user = await userService.findUserByUsername(cleanInput);
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create session
    const session = await sessionService.createSession(user.id);

    // Prepare user data for response
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    };

    const response = NextResponse.json(
      { 
        message: "Login successful",
        user: userData
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set('auth-token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}