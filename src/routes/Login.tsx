import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/authContext';

export default function Login() {
  const { user, login } = useAuth();

  const handleClick = () => {
    if (!user) {
      login()
    }
  }

  return (
    <main className='grow flex items-center justify-center'>
      <Button onClick={handleClick} className='w-xs'>
        Ke Ani
      </Button>
    </main>
  )
}