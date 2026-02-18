import { AuthForm } from "@/components/ui/sign-in"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="dark w-full min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] gap-4">
      <AuthForm />
      <Link
        href="/chatbot"
        className="text-sm text-neutral-500 hover:text-neutral-300 underline underline-offset-4 transition-colors"
      >
        Continuer en tant que guest →
      </Link>
    </div>
  )
}
