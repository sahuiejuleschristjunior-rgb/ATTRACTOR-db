import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to access your CRM dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm outline-none ring-primary/20 transition focus:ring-2"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm outline-none ring-primary/20 transition focus:ring-2"
              />
            </div>
            <Button size="lg" className="w-full" type="submit">
              Sign in
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Continue to <Link href="/dashboard" className="font-medium text-primary">dashboard</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
