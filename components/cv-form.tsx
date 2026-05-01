"use client"

import { useCallback, useRef, useState } from "react"
import { Lock, Upload, Link, FileCheck, X, ArrowRight } from "lucide-react"

interface CVFormProps {
  isSignedIn: boolean
  onSignIn: () => void
}

export function CVForm({ isSignedIn, onSignIn }: CVFormProps) {
  const [jdUrl, setJdUrl] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [urlError, setUrlError] = useState("")
  const [fileError, setFileError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [analysisError, setAnalysisError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File | null | undefined) => {
    setFileError("")
    if (!file) return
    if (file.type !== "application/pdf") {
      setFileError("Only PDF files are accepted.")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File must be under 10 MB.")
      return
    }
    setUploadedFile(file)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      handleFile(e.dataTransfer.files?.[0])
    },
    [handleFile]
  )

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0])
  }

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setUploadedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let valid = true

    if (!jdUrl.trim()) {
      setUrlError("Please enter a job description URL.")
      valid = false
    } else {
      setUrlError("")
    }

    if (!uploadedFile) {
      setFileError("Please upload your CV as a PDF.")
      valid = false
    }

    if (!valid) return

    setIsLoading(true)
    setAnalysisError("")

    try {
      const formData = new FormData()
      formData.append("file", uploadedFile!)
      const cvRes = await fetch("/api/parse-cv", {
        method: "POST",
        body: formData,
      })
      const cvData = await cvRes.json()
      if (!cvData.text) throw new Error("Failed to parse CV")

      const jdRes = await fetch("/api/scrape-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jdUrl }),
      })
      const jdData = await jdRes.json()
      if (!jdData.text) throw new Error("Failed to fetch job description")

      const analysisRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jdText: jdData.text, cvText: cvData.text }),
      })
      const analysisData = await analysisRes.json()
      if (!analysisData.matchScore) throw new Error("Analysis failed")

      sessionStorage.setItem("cvAnalysis", JSON.stringify(analysisData))
      window.location.href = "/results"

    } catch (error) {
      console.error(error)
      setAnalysisError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full">
      <div
        className={`relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-2xl transition-all duration-300 ${
          !isSignedIn ? "overflow-hidden" : ""
        }`}
      >
        <form onSubmit={handleSubmit} noValidate>

          {/* Field 1 – JD URL */}
          <div className="mb-6">
            <label
              htmlFor="jd-url"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              Job Description URL
            </label>
            <div className="relative">
              <Link
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-subtle)]"
                aria-hidden="true"
              />
              <input
                id="jd-url"
                type="url"
                value={jdUrl}
                onChange={(e) => {
                  setJdUrl(e.target.value)
                  if (e.target.value) set
