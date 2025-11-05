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
    <main className='relative grow flex items-center justify-center'>
      <div className='relative w-96 px-24'>
        <img src="/images/button-frame.png" className='absolute left-1/2 top-1/2 -translate-1/2' />
        <Button onClick={handleClick} className='relative w-full font-great-vibes text-3xl h-fit leading-0 py-9' variant="outline">
          Ke&nbsp;&nbsp;&nbsp;Ani
        </Button>
      </div>
    </main>
  )
}