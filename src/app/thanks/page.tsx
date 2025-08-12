import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, User } from 'lucide-react'
import Link from 'next/link'

export default function ThanksPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center bg-transparent border-0 shadow-none">
        <CardHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          <CardTitle className="mt-4 text-2xl font-bold">Vote Submitted!</CardTitle>
          <CardDescription>Thank you for participating. Your vote has been successfully recorded.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button asChild>
            <Link href="/profile">
              <User className="mr-2" />
              View Your Profile
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
