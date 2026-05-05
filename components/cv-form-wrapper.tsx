"use client"
import { useSession } from "next-auth/react"
import { CVForm } from "@/components/cv-form"

interface CVFormWrapperProps {
  isSignedIn: boolean
  remaining: number | null
}

export function CVFormWrapper({ isSignedIn, remaining }: CVFormWrapperProps) {
  const { data: session } = useSession()
  const email = session?.user?.email || ""

  return (
    <CVForm
      isSignedIn={isSignedIn}
      email={email}
      remaining={remaining}
      onSignIn={() => {
        window.location.href = "/api/auth/signin"
      }}
    />
  )
}
