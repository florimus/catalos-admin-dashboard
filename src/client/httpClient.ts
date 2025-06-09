import { redirect } from 'next/navigation'


export const handleError = (error: {status: number}) => {
  if (error.status === 500 || error.status === 401) {
    redirect('/signin')
  }
}
