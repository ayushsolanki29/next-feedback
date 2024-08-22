import mongoose from "mongoose";
type ConnetionObject = {
  isConnected?: number;
};
const connection: ConnetionObject = {};
async function connect_db(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to Mongo database ");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI!);
    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to Mongo database!");
  } catch (error: any) {
    console.log("Failed to connect to Mongo database :" + error.message);
    process.exit(1);
  }
}
export default connect_db;
