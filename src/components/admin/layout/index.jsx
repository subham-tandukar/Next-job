import React from 'react'

export default function AdminLayout() {
  return (
    <main className='flex min-h-screen flex-grow'>
      <aside className='bottom-0 start-0 z-50 h-full w-[270px] border-e-2 border-gray-100 bg-white 2xl:w-72 fixed hidden xl:block dark:bg-gray-50'>

      </aside>

      <div className='flex w-full flex-col xl:ms-[270px] xl:w-[calc(100%-270px)] 2xl:ms-72 2xl:w-[calc(100%-288px)]'>

      </div>
    </main>
  )
}
