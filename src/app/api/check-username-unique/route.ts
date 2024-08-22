import connect_db from "@/lib/database";
import UserModel from "@/model/User.model";
import { usernameValidation } from "@/schemas/signUpsSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});
export async function GET(request: Request) {
  await connect_db();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    //validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid username",
        },
        {
          status: 400,
        }
      );
    }
    const { username } = result.data;
    const existingVerifedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (!existingVerifedUser) {
      return Response.json({ success: true, message: "Username is available" });
    } else {
      return Response.json({
        success: false,
        message: "Username is already taken",
      });
    }
  } catch (error) {
    console.log("error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Failed to check username",
      },
      {
        status: 500,
      }
    );
  }
}
