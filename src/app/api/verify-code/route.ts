import connect_db from "@/lib/database";
import UserModel from "@/model/User.model";
import { verifySchema } from "@/schemas/verifySchema";
import { z } from "zod";

export async function POST(request: Request) {
  await connect_db();
  //validate with zod

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({
      username: decodedUsername,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User Not Found",
        },
        {
          status: 500,
        }
      );
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verfiCodeExpiry) > new Date();
    if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired, please signup again to get new code",
        },
        {
          status: 400,
        }
      );
    }
    if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "verification code is invalid, please try again",
        },
        {
          status: 400,
        }
      );
    }
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
     
      await user.save();
      return Response.json({
        success: true,
        message: "User verified successfully",
      });
    } else {
      return Response.json(
        {
          success: false,
          message: "someting went wrong. try again",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.log("error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Failed to verify user",
      },
      {
        status: 500,
      }
    );
  }
}
