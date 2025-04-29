import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Get token from cookies
    const cookieStore = await cookies(); // <-- must await
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
      // Verify token
      const decoded = verify(
        token,
        process.env.JWT_SECRET
      );

      return NextResponse.json({
        user: {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          isFirstAdmin: decoded.isFirstAdmin,
        },
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
