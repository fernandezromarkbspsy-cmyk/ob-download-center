"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [employeeId, setEmployeeId] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLookedUp, setIsLookedUp] = useState(false)
  const router = useRouter()

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setFullName("")
    setIsLookedUp(false)

    try {
      const supabase = createClient()
      const { data, error: queryError } = await supabase
        .from("employees")
        .select("full_name")
        .eq("employee_id", employeeId)
        .single()

      if (queryError || !data) {
        setError("Employee ID not found.")
        setIsLookedUp(false)
        return
      }

      setFullName(data.full_name)
      setIsLookedUp(true)
      setError(null)
    } catch (err) {
      setError("An error occurred. Please try again.")
      setIsLookedUp(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Store user session in localStorage
      const userData = {
        employeeId: employeeId,
        fullName: fullName,
        loginTime: new Date().toISOString(),
      }
      localStorage.setItem("currentUser", JSON.stringify(userData))
      router.push("/")
    } catch (err) {
      setError("Login failed.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card className="border-border">
            <CardHeader className="space-y-2">
              <CardTitle className="font-bold text-foreground text-2xl">SOC_Packed Generated File</CardTitle>
              
            </CardHeader>
            <CardContent>
              <form onSubmit={isLookedUp ? handleLogin : handleLookup} className="flex flex-col gap-6 text-slate-800">
                <div className="grid gap-2">
                  <Label htmlFor="employee-id" className="text-foreground">
                    Ops Id Login
                  </Label>
                  <Input
                    id="employee-id"
                    type="text"
                    placeholder="e.g., Ops1234"
                    required
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    disabled={isLookedUp}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {isLookedUp && (
                  <div className="grid gap-2">
                    <Label className="text-foreground">Full Name</Label>
                    <div className="px-3 py-2 rounded-md bg-muted border border-border text-foreground">{fullName}</div>
                  </div>
                )}

                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                {!isLookedUp ? (
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isLoading || !employeeId}
                  >
                    {isLoading ? "Looking up..." : "Log In"}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
                      onClick={() => {
                        setIsLookedUp(false)
                        setEmployeeId("")
                        setFullName("")
                        setError(null)
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p className="font-sans text-right text-xs font-thin">zipfolder_uploader v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
