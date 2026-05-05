"use client"
import { useSession } from "next-auth/react"
import { CVForm } from "@/components/cv-form"

interface CVFormWrapperProps {
  isSignedIn: boolean
}

export function CVFormWrapper({ isSignedIn }: CVFormWrapperProps) {
  const { data: session } = useSession()
  const email = session?.user?.email || ""

  return (
    <CVForm
      isSignedIn={isSignedIn}
      email={email}
      onSignIn={() => {
        window.location.href = "/api/auth/signin"
      }}
    />
  )
}
