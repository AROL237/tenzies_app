'use client';
import Image from 'next/image'
import Panel from '../../Components/Panel'
import NavBar from '@/Components/NavBar';

export default function Home() {
  return (
    <main className=' flex flex-col mx-auto w-fit ' id='main'>
      <NavBar />
      <Panel />
    </main>
  )
}
