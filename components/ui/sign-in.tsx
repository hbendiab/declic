"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, KeyRound, Mail, Sparkles } from "lucide-react"
const GoogleIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src="https://svgl.app/library/google.svg" alt="Google" {...props} />
)

const MicrosoftIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src="https://svgl.app/library/microsoft.svg" alt="Microsoft" {...props} />
)

const AppleIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src="https://svgl.app/library/apple_dark.svg" alt="Apple" {...props} />
)

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onEmailSubmit?: (data: { email: string; password?: string }) => void
  onSocialSignIn?: (provider: "google" | "microsoft" | "apple" | "sso") => void
  onEmailLink?: () => void
}

const AuthForm = React.forwardRef<HTMLDivElement, AuthFormProps>(
  ({ className, onEmailSubmit, onSocialSignIn, onEmailLink, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const email = formData.get("email") as string
      const password = formData.get("password") as string
      onEmailSubmit?.({ email, password })
    }

    return (
      <Card ref={ref} className={cn("w-full max-w-md mx-auto", className)} {...props}>
        <CardHeader className="text-left">
          <CardTitle className="text-2xl">Se connecter</CardTitle>
          <CardDescription>
            Accède à DÉCLIK et continue ton parcours d'orientation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Social Sign-in */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Se connecter avec</Label>
              <div className="grid grid-cols-4 gap-2">
                <Button variant="outline" onClick={() => onSocialSignIn?.("google")}>
                  <GoogleIcon className="size-4" />
                </Button>
                <Button variant="outline" onClick={() => onSocialSignIn?.("microsoft")}>
                  <MicrosoftIcon className="size-4" />
                </Button>
                <Button variant="outline" onClick={() => onSocialSignIn?.("apple")}>
                  <AppleIcon className="size-5" />
                </Button>
                <Button variant="outline" onClick={() => onSocialSignIn?.("sso")}>
                  <KeyRound className="h-5 w-5" />
                  <span className="ml-1.5">SSO</span>
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ton.email@exemple.com"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <a href="#" className="text-sm font-medium text-primary hover:underline">
                    Mot de passe oublié ?
                  </a>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-9 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Se connecter
              </Button>
            </form>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start space-y-4">
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => onEmailLink?.()}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Recevoir un lien par email
          </Button>
          <p className="text-xs text-muted-foreground text-center w-full">
            En continuant, tu acceptes nos{" "}
            <a href="#" className="underline hover:text-primary">
              Conditions d'utilisation
            </a>{" "}
            &{" "}
            <a href="#" className="underline hover:text-primary">
              Politique de confidentialité
            </a>
          </p>
          <p className="text-sm text-center w-full text-muted-foreground">
            Pas encore de compte ?{" "}
            <a href="/signup" className="font-medium text-primary hover:underline">
              Créer un compte
            </a>
          </p>
        </CardFooter>
      </Card>
    )
  }
)
AuthForm.displayName = "AuthForm"

export { AuthForm }
