import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import Link from 'next/link';

 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
      <div className='flex-1 rounded-lg bg-red-500 p-2 content-center justify-center'>
        <h1 className='text-white flex-1 mb-3 text-md text-center'>Login function still in development...</h1>
        <div className='text-white align-center flex justify-center hover:bg-red-500'>
            <Link href='/dashboard'>Go to Dashboard {'->'}</Link>
        </div>
      </div>
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}