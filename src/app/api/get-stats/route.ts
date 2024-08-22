import connect_db from "@/lib/database";
import UserModel from "@/model/User.model";

export async function GET(request: Request) {
  await connect_db();

  try {
    // Count the total number of users
    const totalUsers = await UserModel.countDocuments({});

    // Count the total number of messages
    const totalMessages = await UserModel.aggregate([
      { $unwind: "$messages" },
      { $group: { _id: null, totalMessages: { $sum: 1 } } },
    ]);

    // Prepare the stats object
    const stats = {
      users: totalUsers,
      messages: totalMessages.length > 0 ? totalMessages[0].totalMessages : 0
    };

    return new Response(JSON.stringify({ success: true, stats: stats }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching stats: ", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch stats" }),
      { status: 500 }
    );
  }
}
