'use client'

import { useCookies } from 'next-client-cookies';
import Image from "next/image";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CiMenuFries, CiSearch } from "react-icons/ci";
import { MdHelpOutline } from "react-icons/md";
import profile from '../../public/pic/profile.png'
import bell from '../../public/pic/Frame.png'
import frame2 from '../../public/pic/Frame (1).png'
import frame3 from '../../public/pic/Frame (2).png'
import Home from '../../public/pic/Home.png'
import Boards from '../../public/pic/Boards.png'
import Analytics from '../../public/pic/Analytics.png'
import Settings from '../../public/pic/Settings.png'
import Teams from '../../public/pic/Teams.png'
import create from '../../public/pic/create.png'
import Doanload from '../../public/pic/Doanload.png'
import cal from '../../public/pic/cal.png'
import filter from '../../public/pic/filter.png'
import auto from '../../public/pic/auto.png'
import share from '../../public/pic/share.png'
import Create from '@/components/Create';
import { BaseURL } from '@/constants/baseUrl';
import { BiCopy } from 'react-icons/bi';
import toast, { Toaster } from 'react-hot-toast';
import SideBar from '@/components/SideBar';
import { env } from 'process';

export default function page() {
  const [toggleMenu, setToggleMenu] = useState(false)
  const pathname = usePathname()
  const cookies = useCookies();
  const cookie = cookies.get('token')
  const router = useRouter()
  const [inventories, setInventories] = useState([])
  const [createToggle, setCreateToggle] = useState(false)
  const [user, setUser] = useState("")
  const [isLoading, setIsLoading] = useState(false)


  const FetchAllInventories = async () => {
    setIsLoading(true)
    try {
      let result = await fetch(`${BaseURL}`, {
        method: 'GET',
        headers: {
          "content-type": "application/json",
          "Authorization": cookie
        },
        credentials: 'include'
      })
      result = await result.json()
      console.log(result)
      if (result.error) toast.error(result.error)
      if (result && result?.inventories) {
        setUser(result?.name)
        setInventories(result?.inventories)
      }
    } catch (error) {
      console.log(error)
    }
    return setIsLoading(false)
  }

  const handleCreate = (sts) => {
    setCreateToggle(true)
  }

  const handleLogout = () => {
    cookies.remove('token')
    router.push("/login")
  }

  useEffect(() => {
    FetchAllInventories()
  }, [])

  console.log(cookie)

  if (!cookie || cookie === undefined) return router.replace("/login")

  return (
    <main className="w-full max-h-screen overflow-hidden bg-whiteShade flex flex-row">
      <Toaster />
      {/* Side Layout  */}
      
      <SideBar user={user} FetchAllInventories={FetchAllInventories} createToggle={createToggle} setCreateToggle={setCreateToggle} />


      <div className="w-full relative overflow-y-auto overflow-x-hidden px-4 sm:px-8 pt-6 flex min-h-screen  bg-[#F7F7F7] flex-col items-center justify-start ">
        <div className={`w-[200px] bg-dark max-h-screen h-screen overflow-hidden text-whiteShade p-4 md:flex-col md:hidden absolute top-0 left-[-150vw] shadow-lg shadow-gray-500 duration-300 ease-in-out ${toggleMenu && 'translate-x-[150vw]'}`}>
          <div className="text-2xl p-2 pt-4 font-bold">PorductX</div>
          <div className="flex flex-col gap-1 w-full border-t-2 border-lightdark pt-4">
            <Link href={"/"} className="w-auto p-2 rounded hover:bg-lightdark border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ">Home</Link>
            <Link href={"/add-product"} className="w-auto p-2 rounded hover:bg-lightdark border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ">Add Product</Link>
            <Link href={"/"} className="w-auto p-2 rounded hover:bg-lightdark border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ">Create Bill</Link>
          </div>
        </div>
        {/* <div className={`fixed top-0 right-[-80vw] duration-300 ease-in-out ${createToggle && 'translate-x-[-80vw] z-30'}`}>
          <Create setCreateToggle={setCreateToggle} FetchAllInventories={FetchAllInventories} />
        </div> */}
        <div className="w-full flex flex-col justify-between items-center ">


          <div className="bg-lightdark absolute top-12 hover:bg-dark rounded-full p-2 text-white md:hidden" onClick={() => setToggleMenu(!toggleMenu)}>
            <CiMenuFries />
          </div>
          <div className='w-full font-barlow flex flex-row justify-between items-center pb-4'>
            <div className='text-3xl md:text-5xl font-bold'>Good morning, {user.split(" ")[0]}!</div>
            <div>
              <div className='flex flex-row px-2 gap-1 items-center justify-center text-xs sm:text-base'>
                Help & feedback
                <MdHelpOutline className='text-base' />
              </div>
            </div>
          </div>
          {/* <div className='flex flex-row gap-2 pb-4'>
            <div className='rounded-lg py-6 px-4 flex flex-row gap-2 items-center justify-between shadow-xl bg-white'>
              <Image src={tab1} alt='tab' width={76} height={40} className='w-[76px] h-[60px]' />
              <div>
                <div className='text-base text-[#757575] font-semibold'>Introducing tags</div>
                <div className='text-sm text-[#868686]'>Easily categorize and find your notes by adding tags. Keep your workspace clutter-free and efficient.</div>
              </div>
            </div>
            <div className='rounded-lg py-6 px-4 flex flex-row gap-2 items-center justify-between shadow-xl bg-white'>
              <Image src={tab2} alt='tab' width={76} height={76} className='w-[76px] h-[60px]' />
              <div>
                <div className='text-base text-[#757575] font-semibold'>Introducing tags</div>
                <div className='text-sm text-[#868686]'>Effortlessly share your notes with others via email or link. Enhance collaboration with quick sharing options..</div>
              </div>
            </div>
            <div className='rounded-lg py-6 px-4 flex flex-row gap-2 items-center justify-between shadow-xl bg-white'>
              <Image src={tab3} alt='tab' width={76} height={76} className='w-[76px] h-[70px]' />
              <div>
                <div className='text-base text-[#757575] font-semibold'>Introducing tags</div>
                <div className='text-sm text-[#868686]'>Sync your notes across all devices. Stay productive whether you're on your phone, tablet, or computer.</div>
              </div>
            </div>
          </div> */}

          <div className='w-full flex flex-row justify-between pb-4 gap-4'>
            <div className=' p-1 md:p-2 rounded-lg flex flex-row items-center bg-white w-48 md:w-auto'>
              <input type='text' placeholder='Search' className='outline-none w-full' />
              <CiSearch />
            </div>
            <div className='flex flex-row gap-4'>
              
              
              {/* <div className='flex flex-row items-center justify-center bg-[#F4F4F4] p-2 rounded text-[#797979] gap-[14px]'>
                Filter
                <Image src={filter} alt='filter' width={24} height={24} />
              </div> */}
              
              <button onClick={() => setCreateToggle(!createToggle)} className='rounded bg-gradient-to-b from-[#FF8A08] to-[#FFC100] text-white text-center px-2 flex flex-row items-center justify-center gap-2 text-xs sm:text-base'>
                Create new inventory
                <Image src={create} alt='create' width={24} height={24} />
              </button>
            </div>
          </div>

          {/* Task Dashboard */}
          <div className='flex flex-col mt-2 min-h-auto rounded-lg bg-transparent w-full justify-center items-center'>
            <div className='text-2xl w-full text-left font-semibold'>
              Inventories
            </div>
            <hr className='w-full' />
            {
              inventories.length < 1 && !isLoading ? <div className='my-6'>No inventory created</div>
                : (
                  !isLoading ?
                    <div className='w-full flex flex-row flex-wrap gap-3 text-sm  justify-center py-6'>
                      {inventories?.map((inventory, i) => {
                        return (
                          <Link href={`/${inventory.ID}`} key={i} className='rounded-lg p-4 bg-white shadow-md w-full sm:w-[40%] lg:w-[32%]'>
                            <div className='w-full flex flex-row justify-between items-center mb-8'>
                              <div className='font-semibold text-lg '>{inventory.Name}</div>
                              <BiCopy onClick={() => {
                                navigator.clipboard.writeText(inventory.ID)
                                toast.success("Inventory ID Copied!")
                              }} className=' p-[4px]  hover:bg-[#a7a7a7] hover:text-white ease-in-out duration-200 text-xl rounded-[4px]' />
                            </div>
                            {/* <div className='text-xs py-1'>ID <span className='font-semibold uppercase'>{inventory.ID}</span></div> */}
                            <div className='flex flex-row w-full flex-wrap gap-1'>
                              <span className='px-2 py-1 text-xs bg-[#FF8A08] text-white rounded-[4px]'>Qty</span>
                              <span className='px-2 py-1 text-xs bg-[#FF8A08] text-white rounded-[4px]'>Amount</span>
                              {
                                inventory.Attributes?.map((attribute, i) => {
                                  return (<span className='px-2 py-1 text-xs bg-[#FF8A08] text-white rounded-[4px]'>{attribute.slice(0, 1).toUpperCase() + attribute.slice(1,)}</span>)
                                })
                              }
                            </div>

                          </Link>
                        )
                      })}
                    </div>
                    : <div className='rounded-md h-8 w-8 border-4 border-t-4 border-[#FF8A08] animate-spin my-6'></div>
                )
            }
          </div>

        </div>
      </div>
    </main>
  );
}
