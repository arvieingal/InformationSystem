import Image from "next/image";
import Login from "./(auth)/login/page";
import AuthLogin from "@/components/AuthLogin";
export default function Home() {
  return (
    <div>
      <AuthLogin />
    </div>
  );
}
