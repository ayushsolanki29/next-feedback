import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connect_db from "@/lib/database";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(request: Request) {
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
  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptionMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        { success: false, message: "faild to update user" },
        { status: 401 }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "Message acceptance status updated!",
          updatedUser,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Faild to Update Status",
      },
      {
        status: 500,
      }
    );
  }
}
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
  const userId = user._id;
  const foundUser = await UserModel.findById(userId);
  try {
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not Found",
        },
        {
          status: 404,
        }
      );
    } else {
      return Response.json(
        {
          success: true,
          messsage:foundUser.isAcceptionMessage,
          isAcceptionMessage: foundUser.isAcceptionMessage,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error is geting message acceptance status",
      },
      {
        status: 500,
      }
    );
  }
}
