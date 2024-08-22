import connect_db from "@/lib/database";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";

export async function POST(request: Request) {
  await connect_db();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    // is user acception the messages
    if (!user.isAcceptionMessage) {
      return Response.json(
        { success: false, message: "User is not acception the messages" },
        { status: 403 }
      );
    }
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.log("Error senting message: ", error);
    return Response.json(
      { success: false, message: "Failed to sent message" },
      { status: 500 }
    );
  }
}
