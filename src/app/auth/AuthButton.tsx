import { signOut } from './actions'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function AuthButton() {
  return (
    <form action={signOut}>
      <Button variant="ghost">
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </form>
  )
}
