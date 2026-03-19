import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
const IsAdmin = async () => {
  const session = await getServerSession(authOptions);
  return session && session!.user.id.toString() === process.env.ADMIN_ID
}
export default IsAdmin
