'use client'

import Image from 'next/image'
import Link from 'next/link'
import profile from '../../public/pic/profile.png'
import bell from '../../public/pic/Frame.png'
import frame2 from '../../public/pic/Frame (1).png'
import frame3 from '../../public/pic/Frame (2).png'
import Home from '../../public/pic/Home.png'
import Boards from '../../public/pic/Boards.png'
import Settings from '../../public/pic/Settings.png'
import Teams from '../../public/pic/Teams.png'
import create from '../../public/pic/create.png'
import cross from '../../public/pic/cross.png'
import { usePathname, useRouter } from 'next/navigation'
import { useCookies } from 'next-client-cookies'
import Create from './Create'
import { FaCross } from 'react-icons/fa'
import { RxCross1 } from 'react-icons/rx'
import { useState } from 'react'
import { RiMenu2Line } from 'react-icons/ri'

const SideBar = ({ user, FetchAllInventories, setCreateToggle, createToggle }: { user: string, FetchAllInventories: any, setCreateToggle: any, createToggle: boolean }) => {
    const pathname = usePathname()
    const cookies = useCookies();
    const cookie = cookies.get('token')
    const router = useRouter()

    const [toggleMenu, setToggleMenu] = useState(false)
    const handleLogout = () => {
        cookies.remove('token')
        router.push("/login")
    }
    return (
        <>
            <div className="w-[300px] z-10 bg-white shadow-lg max-h-screen h-screen overflow-hidden text-whiteShade px-4 py-6 pt-8 hidden md:flex md:flex-col justify-between">
                <div>
                    <div className="text-xl flex flex-row font-semibold pb-2">
                        <Image src={profile} alt="profile" width={31} height={31} className="pr-2" />
                        <div className="text-[#080808] text-ellipsis overflow-hidden w-full">{user ? user : <div className="h-5 my-1 bg-[#F4F4F4] rounded animate-pulse" />}</div>
                    </div>
                    <div className="pb-4">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-5 items-center">
                                <Image src={bell} alt="profile" width={24} height={24} className="" />
                                <Image src={frame2} alt="profile" width={24} height={24} className="" />
                                <Image src={frame3} alt="profile" width={24} height={24} className="" />
                            </div>
                            <div onClick={handleLogout} className="text-[#797979] text-sm lg:text-base px-2 py-3 rounded bg-[#F4F4F4] cursor-pointer">Log Out</div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-ful pb-4">
                        <Link href={"/"} className={`w-auto p-2 rounded flex flex-row items-center gap-4 border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ${pathname === '/' && 'bg-[#F4F4F4] text-[#797979] border-[#DDDDDD]'}`}>
                            <Image src={Home} alt="Home" width={24} height={24} />
                            Home
                        </Link>
                        <Link href={"/billing"} className={`w-auto p-2 rounded flex flex-row items-center gap-4 border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ${pathname === '/billing' && 'bg-[#F4F4F4] text-[#797979] border-[#DDDDDD]'}`}>
                            <Image src={Boards} alt="Boards" width={24} height={24} />
                            Billing
                        </Link>
                        <Link href={"/update"} className={`w-auto p-2 rounded flex flex-row items-center gap-4 border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ${pathname === '/update' && 'bg-[#F4F4F4] text-[#797979] border-[#DDDDDD]'}`}>
                            <Image src={Teams} alt="Teams" width={24} height={24} />
                            Update
                        </Link>
                        <Link href={"/bills"} className={`w-auto p-2 rounded flex flex-row items-center gap-4 border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ${pathname === '/bills' && 'bg-[#F4F4F4] text-[#797979] border-[#DDDDDD]'}`}>
                            <Image src={Settings} alt="Settings" width={24} height={24} />
                            Bills
                        </Link>

                    </div>
                    <button onClick={() => setCreateToggle(!createToggle)} className='rounded-lg bg-gradient-to-b from-[#FF8A08] to-[#FFC100] text-white py-[14px] text-center w-full flex flex-row justify-center gap-2' >
                        Create new Inventory
                        <Image src={create} alt='create' width={24} height={24} />
                    </button>
                </div>
                {/* <div className='p-2 flex-row flex gap-2 bg-[#F3F3F3]  rounded-lg'>
                <Image src={Doanload} alt='Doanload' width={40} height={20} />
                <div className='flex flex-col gap-1 text-[#666666] '>
                    <div className='text-[16px] font-semibold'>Download the app</div>
                    <div className='text-[13px]'>Get the full experience </div>
                </div>
            </div> */}

            </div>
            <div className={`fixed top-0 right-[-120vw] duration-300 ease-in-out w-full md:w-auto ${createToggle && 'translate-x-[-120vw] md:translate-x-[-120vw] z-30'}`}>
                <Create setCreateToggle={setCreateToggle} FetchAllInventories={FetchAllInventories} />
            </div>

            <div className={` absolute top-0 left-0 ${toggleMenu ? 'flex' : 'hidden'} flex-col gap-2 w-full h-screen p-4 md:hidden z-30 bg-white `}>
                <div className='flex flex-row w-full justify-between items-start'>
                    <div className="text-xl flex flex-row font-semibold pb-2 items-center gap-3">
                        <Image src={profile} alt="profile" width={60} height={60} className="" />
                        <div className="text-[#080808] text-ellipsis overflow-hidden w-full">{user ? user : <div className="h-5 my-1 bg-[#F4F4F4] rounded animate-pulse" />}</div>
                    </div>
                    <RxCross1 className='cursor-pointer' onClick={() => {
                        setToggleMenu(false)
                    }} />
                </div>
                <div className="pb-4">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row gap-5 items-center">
                            <Image src={bell} alt="profile" width={24} height={24} className="" />
                            <Image src={frame2} alt="profile" width={24} height={24} className="" />
                            <Image src={frame3} alt="profile" width={24} height={24} className="" />
                        </div>
                        <div onClick={handleLogout} className="text-[#797979] text-sm lg:text-base px-2 py-3 rounded bg-[#F4F4F4] cursor-pointer">Log Out</div>
                    </div>
                </div>
                <div className='flex flex-col gap-2 w-full'>
                    <Link href={"/"} className={`w-full p-2 rounded flex flex-row items-center gap-4 border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ${pathname === '/' && 'bg-[#F4F4F4] text-[#797979] border-[#DDDDDD]'}`}>
                        <Image src={Home} alt="Home" width={24} height={24} />
                        Home
                    </Link>
                    <Link href={"/billing"} className={`w-full p-2 rounded flex flex-row items-center gap-4 border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ${pathname === '/billing' && 'bg-[#F4F4F4] text-[#797979] border-[#DDDDDD]'}`}>
                        <Image src={Boards} alt="Boards" width={24} height={24} />
                        Billing
                    </Link>
                    <Link href={"/update"} className={`w-full p-2 rounded flex flex-row items-center gap-4 border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ${pathname === '/update' && 'bg-[#F4F4F4] text-[#797979] border-[#DDDDDD]'}`}>
                        <Image src={Teams} alt="Teams" width={24} height={24} />
                        Update
                    </Link>
                    <Link href={"/bills"} className={`w-full p-2 rounded flex flex-row items-center gap-4 border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ${pathname === '/bills' && 'bg-[#F4F4F4] text-[#797979] border-[#DDDDDD]'}`}>
                        <Image src={Settings} alt="Settings" width={24} height={24} />
                        Bills
                    </Link>
                </div>

            </div>
            {
                !toggleMenu &&
                <div className='fixed p-2 rounded-full shadow-3xl bottom-5 right-5 z-30 bg-[#FF8A08] text-white' onClick={() => setToggleMenu(true)}>
                    <RiMenu2Line className='text-xl font-semibold' />
                </div>
            }
        </>

    )
}

export default SideBar