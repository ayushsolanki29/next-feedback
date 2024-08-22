import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connect_db from "@/lib/database";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await connect_db();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
    ]);
    const messageCount = user.length as number;
   
    return Response.json(
      { success: true, messageCount: messageCount },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching messages: ", error);
    return Response.json(
      { success: false, message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
