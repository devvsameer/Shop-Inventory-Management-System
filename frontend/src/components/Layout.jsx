import { Outlet } from 'react-router-dom'
import {Toaster} from 'sonner'

const MainLayout = () => {
  return (
    <>
      <Toaster />
      <main className='flex h-screen min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-gray-100'>
        <nav className='flex h-10 w-full shrink-0 justify-end bg-blue-500 items-center-safe '>
          {/* <img height={4} src='favicon.svg'></img> */}
          <div className='h-9 bg-amber-200 w-9 rounded-2xl mr-4 '></div>
        </nav>
        <div className='min-h-0 flex-1 overflow-hidden'>
          <Outlet/>
        </div>
      </main>
    </>
  )
}

export default MainLayout
