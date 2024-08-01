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
import tab1 from '../../public/pic/tab1.png'
import tab2 from '../../public/pic/tab2.png'
import tab3 from '../../public/pic/tab3.png'
import cal from '../../public/pic/cal.png'
import filter from '../../public/pic/filter.png'
import auto from '../../public/pic/auto.png'
import share from '../../public/pic/share.png'
import clock from '../../public/pic/clock.png'
import { DndProvider } from 'react-dnd';
// import { Finished, InProgress, Todo, UnderReview } from '@/components/Task';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrop } from 'react-dnd'
import { useDrag } from 'react-dnd'
import toast, { Toaster } from 'react-hot-toast'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import bars from '../../public/pic/bars.png'
import { GoPlus } from 'react-icons/go';
import Create from '@/components/Create';
import { createContext } from 'react';
import { BaseURL } from '@/constants/baseUrl';

export const statusContext = createContext(null);

function getTimeDifference(startTime, endTime) {
  const differenceInMillis = endTime - startTime;

  const seconds = Math.floor(differenceInMillis / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days >= 1) {
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours >= 1) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (minutes >= 1) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''}`;
  }
}


export default function page() {
  const [toggleMenu, setToggleMenu] = useState(false)
  const pathname = usePathname()
  const cookies = useCookies();
  const cookie = cookies.get('user')
  const router = useRouter()
  const [todo, setTodo] = useState([])
  const [_status, set_status] = useState('')
  const [inprogress, setInprogress] = useState([])
  const [underreview, setUnderreview] = useState([])
  const [finished, setFinished] = useState([])
  const [createToggle, setCreateToggle] = useState(false)
  const [user, setUser] = useState("")



  const FetchAllTasks = async () => {
    let result = await fetch(`${BaseURL}`, {
      method: 'GET',
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${cookie}`
      }
    })
    result = await result.json()
    console.log(result)
    if (result.data && result.data.tasks) {
      setUser(result.data?.name)
      setTodo(result.data?.tasks?.filter((task) => {
        return task.status === "TODO"
      }))
      setInprogress(result.data?.tasks?.filter((task) => {
        return task.status === "IN_PROGRESS"
      }))
      setUnderreview(result.data?.tasks?.filter((task) => {
        return task.status === "UNDER_REVIEW"
      }))
      setFinished(result.data?.tasks?.filter((task) => {
        return task.status === "FINISHED"
      }))
    }
  }

  const handleCreate = (sts) => {
    set_status(sts)
    setCreateToggle(true)
  }

  const handleLogout = () => {
    cookies.remove('user')
    router.push("/login")
  }

  useEffect(() => {
    FetchAllTasks()
  }, [])

  if (!cookie) return router.replace("/login")

  const Task = ({ listItem }) => {

    const [{ isDragging }, drag] = useDrag(() => ({
      type: "task",
      item: { listItem },
      collect: monitor => ({
        isDragging: !!monitor.isDragging(),
      }),
    }))
    console.log(listItem)
    const y = new Date(listItem.updatedAt)
    return (
      <div ref={drag} className={`task flex flex-col justify-center items-start p-[14px] border rounded-lg border-[#DEDEDE] w-full bg-[#F9F9F9] ${isDragging ? "text-gray-400" : ""}`}>
        <div className='text-base text-[#606060] font-semibold'>{listItem.title}</div>
        <div className='text-[#797979] text-[14px] pt-1 pb-[13px] text-ellipsis overflow-hidden w-full'>{listItem.desc}</div>
        {listItem.priority && <div className={`${listItem.priority === 'Urgent' ? 'bg-[#FF6B6B]' : listItem.priority === 'Medium' ? 'bg-[#FFA235]' : 'bg-[#0ECC5A]'} py-[6px] px-2 text-xs text-white rounded-lg mb-[13px]`}>{listItem.priority}</div>}
        {listItem.deadline && <div className='text-[14px] text-[#606060] flex flex-row gap-2 mb-4 font-semibold'>
          <Image src={clock} alt='bar' width={24} height={24} />
          {/* {`${x.getFullYear()}-${x.getMonth() + 1}-${x.getDate()}`} */}
          {listItem.deadline}
        </div>}
        <div className='text-[#797979] text-[14px]'>{getTimeDifference(y, new Date())} ago</div>

      </div>
    )
  }

  const Todo = ({ todo }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: "task",
      drop: async ({ listItem }) => {
        console.log("Dropped", listItem)
        if (listItem.status != "TODO") {
          let result = await fetch(`${BaseURL}/${listItem._id}`, {
            method: 'PATCH',
            mode: 'cors',
            headers: {
              "Content-Type": "application/json",
              "authorization": `Bearer ${cookie}`
            },
            body: JSON.stringify({ task: listItem.task, desc: listItem.desc, priority: listItem.priority, status: "TODO" })
          })
          result = await result.json()
          FetchAllTasks()
          toast.success("Task status is changed!")
        }
      }, collect: monitor => ({
        isOver: !!monitor.isOver(),
      }),
    }))
    return (
      <div ref={drop} className={`lg:w-[24%] w-[320px] pb-5 flex flex-col justify-start p-3 items-start ${isOver ? "bg-gray-100 rounded" : ""} `}>
        <div className='flex flex-row w-full justify-between items-center pb-4'>
          <div className='text-center rounded text-[20px] font-semibold'>Todo</div>
          <Image src={bars} alt='bar' width={24} height={24} />
        </div>
        <div className={`flex flex-col mb-4 w-full gap-4 ${isOver ? "bg-gray-100" : ""} `}>
          {
            todo?.map((listItem, key) => {
              return (
                <Task key={key} listItem={listItem} />
              )
            })
          }

        </div>
        <div onClick={() => handleCreate("TODO")} className='w-full text-white p-2 rounded-lg bg-gradient-to-b from-[#3A3A3A] to-[#202020] flex flex-row justify-between items-center cursor-pointer'>
          Add new
          <GoPlus />
        </div>
      </div>
    )
  }

  const InProgress = ({ inprogress }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: "task",
      drop: async ({ listItem }) => {
        console.log("Dropped", listItem)
        if (listItem.status != "IN_PROGRESS") {
          let result = await fetch(`${BaseURL}/${listItem._id}`, {
            method: 'PATCH',
            mode: 'cors',
            headers: {
              "Content-Type": "application/json",
              "authorization": `Bearer ${cookie}`
            },
            body: JSON.stringify({ task: listItem.task, desc: listItem.desc, priority: listItem.priority, status: "IN_PROGRESS" })
          })
          result = await result.json()
          FetchAllTasks()
          toast.success("Task status is changed!")
        }
      }, collect: monitor => ({
        isOver: !!monitor.isOver(),
      }),
    }))
    return (
      <div ref={drop} className={`lg:w-[24%] w-[320px] pb-5 flex flex-col justify-start p-3 items-start ${isOver ? "bg-gray-100 rounded" : ""} `}>
        <div className='flex flex-row w-full justify-between items-center pb-4'>
          <div className='text-center rounded text-[20px] font-semibold'>In Progress</div>
          <Image src={bars} alt='bar' width={24} height={24} />
        </div>
        <div className={`flex flex-col mb-4 w-full gap-4 ${isOver ? "bg-gray-100" : ""} `}>
          {
            inprogress?.map((listItem, key) => {
              return (
                <Task key={key} listItem={listItem} />
              )
            })
          }
        </div>
        <div onClick={() => handleCreate("IN_PROGRESS")} className='w-full text-white p-2 rounded-lg bg-gradient-to-b from-[#3A3A3A] to-[#202020] flex flex-row justify-between items-center cursor-pointer'>
          Add new
          <GoPlus />
        </div>
      </div>
    )
  }

  const UnderReview = ({ underreview }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: "task",
      drop: async ({ listItem }) => {
        console.log("Dropped", listItem)
        if (listItem.status != "UNDER_REVIEW") {
          let result = await fetch(`${BaseURL}/${listItem._id}`, {
            method: 'PATCH',
            mode: 'cors',
            headers: {
              "Content-Type": "application/json",
              "authorization": `Bearer ${cookie}`
            },
            body: JSON.stringify({ task: listItem.task, desc: listItem.desc, priority: listItem.priority, status: "UNDER_REVIEW" })
          })
          result = await result.json()
          FetchAllTasks()
          toast.success("Task status is changed!")
        }
      }, collect: monitor => ({
        isOver: !!monitor.isOver(),
      }),
    }))
    return (
      <div ref={drop} className={`lg:w-[24%] w-[320px] pb-5 flex flex-col justify-start p-3 items-start ${isOver ? "bg-gray-100 rounded" : ""} `}>
        <div className='flex flex-row w-full justify-between items-center pb-4'>
          <div className='text-center rounded text-[20px] font-semibold'>Under Review</div>
          <Image src={bars} alt='bar' width={24} height={24} />
        </div>
        <div className={`flex flex-col mb-4 w-full gap-4 ${isOver ? "bg-gray-100" : ""} `}>
          {
            underreview?.map((listItem, key) => {
              return (
                <Task key={key} listItem={listItem} />
              )
            })
          }
        </div>
        <div onClick={() => handleCreate("UNDER_REVIEW")} className='w-full text-white p-2 rounded-lg bg-gradient-to-b from-[#3A3A3A] to-[#202020] flex flex-row justify-between items-center cursor-pointer'>
          Add new
          <GoPlus />
        </div>
      </div>
    )
  }

  const Finished = ({ finished }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: "task",
      drop: async ({ listItem }) => {
        console.log("Dropped", listItem)
        if (listItem.status != "FINISHED") {
          let result = await fetch(`${BaseURL}/${listItem._id}`, {
            method: 'PATCH',
            mode: 'cors',
            headers: {
              "Content-Type": "application/json",
              "authorization": `Bearer ${cookie}`
            },
            body: JSON.stringify({ task: listItem.task, desc: listItem.desc, priority: listItem.priority, status: "FINISHED" })
          })
          result = await result.json()
          FetchAllTasks()
          toast.success("Task status is changed!")
        }
      }, collect: monitor => ({
        isOver: !!monitor.isOver(),
      }),
    }))
    return (
      <div ref={drop} className={`lg:w-[24%] w-[320px] pb-5 flex flex-col justify-start p-3 items-start ${isOver ? "bg-gray-100 rounded" : ""} `}>
        <div className='flex flex-row w-full justify-between items-center pb-4'>
          <div className='text-center rounded text-[20px] font-semibold'>Done</div>
          <Image src={bars} alt='bar' width={24} height={24} />
        </div>
        <div className={`flex flex-col mb-4 w-full gap-4 ${isOver ? "bg-gray-100" : ""} `}>
          {
            finished?.map((listItem, key) => {
              return (
                <Task key={key} listItem={listItem} />
              )
            })
          }
        </div>
        <div onClick={() => handleCreate("FINISHED")} className='w-full text-white p-2 rounded-lg bg-gradient-to-b from-[#3A3A3A] to-[#202020] flex flex-row justify-between items-center cursor-pointer'>
          Add new
          <GoPlus />
        </div>
      </div>
    )
  }
  return (
    <main className="w-full max-h-screen overflow-hidden bg-whiteShade flex flex-row">
      <statusContext.Provider value={{ _status, set_status }}>
        {/* Side Layout  */}
        <div className="w-[300px] bg-white border-r-[#DEDEDE] border-2 max-h-screen h-screen overflow-hidden text-whiteShade px-4 py-6 pt-8 hidden md:flex md:flex-col justify-between">
          <div>
            <div className="text-xl flex flex-row font-semibold pb-2">
              <Image src={profile} alt="profile" width={31} height={31} className="pr-2" />
              <div className="text-[#080808] text-ellipsis overflow-hidden w-full">{user}</div>
            </div>
            <div className="pb-4">
              <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-5 items-center">
                  <Image src={bell} alt="profile" width={24} height={24} className="" />
                  <Image src={frame2} alt="profile" width={24} height={24} className="" />
                  <Image src={frame3} alt="profile" width={24} height={24} className="" />
                </div>
                <div onClick={handleLogout} className="text-[#797979] text-base px-2 py-3 rounded bg-[#F4F4F4] cursor-pointer">Log Out</div>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-ful pb-4">
              <Link href={"/"} className={`w-auto p-2 rounded flex flex-row items-center gap-4 border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ${pathname === '/' && 'bg-[#F4F4F4] text-[#797979] border-[#DDDDDD]'}`}>
                <Image src={Home} alt="Home" width={24} height={24} />
                Home
              </Link>
              <Link href={"/boards"} className={`w-auto p-2 rounded flex flex-row items-center gap-4 border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ${pathname === '/boards' && 'bg-[#F4F4F4] text-[#797979] border-[#DDDDDD]'}`}>
                <Image src={Boards} alt="Boards" width={24} height={24} />
                Boards
              </Link>
              <Link href={"/settings"} className={`w-auto p-2 rounded flex flex-row items-center gap-4 border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ${pathname === '/settings' && 'bg-[#F4F4F4] text-[#797979] border-[#DDDDDD]'}`}>
                <Image src={Settings} alt="Settings" width={24} height={24} />
                Settings
              </Link>
              <Link href={"/teams"} className={`w-auto p-2 rounded flex flex-row items-center gap-4 border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ${pathname === '/teams' && 'bg-[#F4F4F4] text-[#797979] border-[#DDDDDD]'}`}>
                <Image src={Teams} alt="Teams" width={24} height={24} />
                Teams
              </Link>
              <Link href={"/analytics"} className={`w-auto p-2 rounded flex flex-row items-center gap-4 border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ${pathname === '/analytics' && 'bg-[#F4F4F4] text-[#797979] border-[#DDDDDD]'}`}>
                <Image src={Analytics} alt="Analytics" width={24} height={24} />
                Analytics
              </Link>
            </div>
            <button onClick={() => setCreateToggle(!createToggle)} className='rounded-lg bg-gradient-to-b from-[#4B36CC] to-[#9C93D4] text-white py-[14px] text-center w-full flex flex-row justify-center gap-2' >
              Create new task
              <Image src={create} alt='create' width={24} height={24} />
            </button>
          </div>
          <div className='p-2 flex-row flex gap-2 bg-[#F3F3F3]  rounded-lg'>
            <Image src={Doanload} alt='Doanload' width={40} height={20} />
            <div className='flex flex-col gap-1 text-[#666666] '>
              <div className='text-[16px] font-semibold'>Download the app</div>
              <div className='text-[13px]'>Get the full experience </div>
            </div>
          </div>
        </div>

        <div className="w-full relative overflow-y-auto overflow-x-hidden pl-4 pr-8 pt-6 flex min-h-screen  bg-[#F7F7F7] flex-col items-center justify-start ">
          <div className={`w-[200px] bg-dark max-h-screen h-screen overflow-hidden text-whiteShade p-4 md:flex-col md:hidden absolute top-0 left-[-150vw] shadow-lg shadow-gray-500 duration-300 ease-in-out ${toggleMenu && 'translate-x-[150vw]'}`}>
            <div className="text-2xl p-2 pt-4 font-bold">PorductX</div>
            <div className="flex flex-col gap-1 w-full border-t-2 border-lightdark pt-4">
              <Link href={"/"} className="w-auto p-2 rounded hover:bg-lightdark border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ">Home</Link>
              <Link href={"/add-product"} className="w-auto p-2 rounded hover:bg-lightdark border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ">Add Product</Link>
              <Link href={"/"} className="w-auto p-2 rounded hover:bg-lightdark border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ">Create Bill</Link>
            </div>
          </div>
          <div className={`fixed top-0 right-[-80vw] duration-300 ease-in-out ${createToggle && 'translate-x-[-80vw] z-30'}`}>
            <Create status={_status} set_status={set_status} setCreateToggle={setCreateToggle} fetchAllTasks={FetchAllTasks} />
          </div>
          <div className="w-full flex flex-col justify-between items-center ">


            <div className="bg-lightdark absolute top-12 hover:bg-dark rounded-full p-2 text-white md:hidden" onClick={() => setToggleMenu(!toggleMenu)}>
              <CiMenuFries />
            </div>
            <div className='w-full font-barlow flex flex-row justify-between items-center pb-4'>
              <div className='text-5xl font-bold'>Good morning, {user.split(" ")[0]}!</div>
              <div>
                <div className='flex flex-row px-2 gap-1 items-center justify-center'>
                  Help & feedback
                  <MdHelpOutline />
                </div>
              </div>
            </div>
            <div className='flex flex-row gap-2 pb-4'>
              <div className='rounded-lg py-6 px-4 flex flex-row gap-2 items-center justify-between bg-[#F4F4F4]'>
                <Image src={tab1} alt='tab' width={76} height={40} className='w-[76px] h-[60px]' />
                <div>
                  <div className='text-base text-[#757575] font-semibold'>Introducing tags</div>
                  <div className='text-sm text-[#868686]'>Easily categorize and find your notes by adding tags. Keep your workspace clutter-free and efficient.</div>
                </div>
              </div>
              <div className='rounded-lg py-6 px-4 flex flex-row gap-2 items-center justify-between bg-[#F4F4F4]'>
                <Image src={tab2} alt='tab' width={76} height={76} className='w-[76px] h-[60px]' />
                <div>
                  <div className='text-base text-[#757575] font-semibold'>Introducing tags</div>
                  <div className='text-sm text-[#868686]'>Effortlessly share your notes with others via email or link. Enhance collaboration with quick sharing options..</div>
                </div>
              </div>
              <div className='rounded-lg py-6 px-4 flex flex-row gap-2 items-center justify-between bg-[#F4F4F4]'>
                <Image src={tab3} alt='tab' width={76} height={76} className='w-[76px] h-[70px]' />
                <div>
                  <div className='text-base text-[#757575] font-semibold'>Introducing tags</div>
                  <div className='text-sm text-[#868686]'>Sync your notes across all devices. Stay productive whether you're on your phone, tablet, or computer.</div>
                </div>
              </div>
            </div>

            <div className='w-full flex flex-row justify-between pb-4'>
              <div className='p-2 rounded-lg flex flex-row items-center bg-white'>
                <input type='text' placeholder='Search' className='outline-none' />
                <CiSearch />
              </div>
              <div className='flex flex-row gap-4'>
                <div className='flex flex-row items-center justify-center bg-[#F4F4F4] p-2 rounded text-[#797979] gap-[14px]'>
                  Calendar view
                  <Image src={cal} alt='cal' width={24} height={24} />
                </div>
                <div className='flex flex-row items-center justify-center bg-[#F4F4F4] p-2 rounded text-[#797979] gap-[14px]'>
                  Automation
                  <Image src={auto} alt='auto' width={24} height={24} />
                </div>
                <div className='flex flex-row items-center justify-center bg-[#F4F4F4] p-2 rounded text-[#797979] gap-[14px]'>
                  Filter
                  <Image src={filter} alt='filter' width={24} height={24} />
                </div>
                <div className='flex flex-row items-center justify-center bg-[#F4F4F4] p-2 rounded text-[#797979] gap-[14px]'>
                  Share
                  <Image src={share} alt='share' width={24} height={24} />
                </div>
                <button onClick={() => setCreateToggle(!createToggle)} className='rounded bg-gradient-to-b from-[#4B36CC] to-[#9C93D4] text-white text-center px-2 flex flex-row items-center justify-center gap-2'>
                  Create new task
                  <Image src={create} alt='create' width={24} height={24} />
                </button>
              </div>
            </div>

            {/* Task Dashboard */}
            <DndProvider backend={HTML5Backend}>
              <div className='flex flex-row flex-wrap gap-2 p-4 w-full rounded-lg bg-white'>
                <Toaster />

                <Todo todo={todo} />
                <InProgress inprogress={inprogress} />
                <UnderReview underreview={underreview} />
                <Finished finished={finished} />
              </div>
            </DndProvider>

          </div>
        </div>
      </statusContext.Provider>
    </main>
  );
}
