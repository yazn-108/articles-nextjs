import GoBackToHome from "@/app/_components/GoBackToHome";
import { signOut, useSession } from "next-auth/react";
export default function AuthButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div className="flex items-center justify-between m-4 px-4 py-1 bg-primary/5 rounded-lg">
        <div className="flex justify-center items-center gap-4">
          {session.user.name} <br />
          <button onClick={() => signOut({ callbackUrl: "/" })}>
            تسجيل الخروج
          </button>
        </div>
        <GoBackToHome.BackToHomeIcon className="mb-0!" />
      </div>
    );
  }
}
