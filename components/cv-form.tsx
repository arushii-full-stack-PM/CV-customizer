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
      // Step 1: Parse the CV PDF
      const formData = new FormData()
      formData.append("file", uploadedFile!)
      const cvRes = await fetch("/api/parse-cv", {
        method: "POST",
        body: formData,
      })
      const cvData = await cvRes.json()
      if (!cvData.text) throw new Error("Failed to parse CV")

      // Step 2: Scrape the JD URL
      const jdRes = await fetch("/api/scrape-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jdUrl }),
      })
      const jdData = await jdRes.json()
      if (!jdData.text) throw new Error("Failed to fetch job description")

      // Step 3: Analyze with Claude
      const analysisRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jdText: jdData.text, cvText: cvData.text }),
      })
      const analysisData = await analysisRes.json()
      if (!analysisData.matchScore) throw new Error("Analysis failed")

      // Step 4: Store results and redirect
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
                  if (e.target.value) setUrlError("")
                }}
                placeholder="Paste the JD URL here (LinkedIn, Naukri, etc.)"
                disabled={!isSignedIn}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--navy-surface)] py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-[var(--text-subtle)] transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
                aria-describedby={urlError ? "jd-url-error" : undefined}
              />
            </div>
            {urlError && (
              <p id="jd-url-error" className="mt-1.5 text-xs text-red-400" role="alert">
                {urlError}
              </p>
            )}
          </div>

          {/* Field 2 – CV Upload */}
          <div className="mb-8">
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Upload Your CV{" "}
              <span className="font-normal text-[var(--text-subtle)]">(PDF only)</span>
            </label>

            <input
              ref={fileInputRef}
              id="cv-upload"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleInputChange}
              disabled={!isSignedIn}
              className="sr-only"
              aria-label="Upload CV PDF file"
            />

            {uploadedFile ? (
              <div className="flex items-center justify-between rounded-xl border border-primary/40 bg-primary/10 px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{uploadedFile.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {(uploadedFile.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  aria-label="Remove uploaded file"
                  className="rounded-lg p-1 text-[var(--text-subtle)] transition-colors hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="cv-upload"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200 ${
                  isDragging
                    ? "border-primary bg-primary/10 scale-[1.01]"
                    : "border-[var(--border)] bg-[var(--navy-surface)] hover:border-primary/50 hover:bg-[var(--blue-glow)]"
                } ${!isSignedIn ? "pointer-events-none opacity-50" : ""}`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                    isDragging ? "bg-primary/20" : "bg-[var(--navy-elevated)]"
                  }`}
                >
                  <Upload
                    className={`h-5 w-5 transition-colors ${isDragging ? "text-primary" : "text-[var(--text-muted)]"}`}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Drag &amp; drop your PDF here{" "}
                    <span className="text-[var(--text-subtle)]">or</span>{" "}
                    <span className="text-primary underline-offset-2 hover:underline">
                      click to browse
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-subtle)]">
                    PDF files only · max 10 MB
                  </p>
                </div>
              </label>
            )}

            {fileError && (
              <p className="mt-1.5 text-xs text-red-400" role="alert">
                {fileError}
              </p>
            )}
          </div>

          {/* Error message */}
          {analysisError && (
            <p className="mb-4 text-sm text-red-400 text-center">{analysisError}</p>
          )}

          {/* CTA */}
          <button
            type="submit"
            disabled={!isSignedIn || isLoading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Analyzing your CV...
              </>
            ) : (
              <>
                Analyze My CV
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true"/>
              </>
            )}
          </button>
        </form>

        {/* Signed-out overlay */}
        {!isSignedIn && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-[var(--background)]/70 backdrop-blur-[3px]"
            aria-live="polite"
          >
            <div className="flex flex-col items-center gap-5 px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--navy-elevated)] ring-1 ring-[var(--border)]">
                <Lock className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">
                  Sign in to get started
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Please sign in with Google to continue
                </p>
              </div>
              <button
                onClick={onSignIn}
                className="flex items-center gap-2.5 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-lg transition-all hover:bg-foreground/90 active:scale-95"
                aria-label="Sign in with Google"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
