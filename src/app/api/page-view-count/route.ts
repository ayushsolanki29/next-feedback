// app/api/updateSettings/route.ts
import { NextResponse } from "next/server";
import SettingsModel from "@/model/Settings.model";
import connect_db from "@/lib/database";

export async function GET() {
  connect_db();
  try {
    await SettingsModel.findOneAndUpdate(
      { id: 2 },
      { $inc: { data1: 1 } },
      { new: true, upsert: true }
    );

    // Set the cookie
    const response = NextResponse.json({
      message: "Settings updated and cookie set",
    });
    response.cookies.set("page-viewed", "true", {
      maxAge: 604800,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function POST() {
  connect_db();
  try {
    const count = await SettingsModel.findOne({ id: 2 });

    // Set the cookie
    return Response.json(
      { success: true, count: count.data1 },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
