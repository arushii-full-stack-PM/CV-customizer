"use client"

import { CVForm } from "@/components/cv-form"

interface CVFormWrapperProps {
  isSignedIn: boolean
}

export function CVFormWrapper({ isSignedIn }: CVFormWrapperProps) {
  return (
    <CVForm
      isSignedIn={isSignedIn}
      onSignIn={() => {
        window.location.href = "/api/auth/signin"
      }}
    />
  )
}
