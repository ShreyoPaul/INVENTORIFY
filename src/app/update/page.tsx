'use client'

import { BaseURL } from "@/constants/baseUrl";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import profile from '../../../public/pic/profile.png'
import bell from '../../../public/pic/Frame.png'
import frame2 from '../../../public/pic/Frame (1).png'
import frame3 from '../../../public/pic/Frame (2).png'
import Home from '../../../public/pic/Home.png'
import Boards from '../../../public/pic/Boards.png'
import Analytics from '../../../public/pic/Analytics.png'
import Settings from '../../../public/pic/Settings.png'
import Teams from '../../../public/pic/Teams.png'
import create from '../../../public/pic/create.png'
import Doanload from '../../../public/pic/Doanload.png'
import cal from '../../../public/pic/cal.png'
import filter from '../../../public/pic/filter.png'
import auto from '../../../public/pic/auto.png'
import share from '../../../public/pic/share.png'
import { MdHelpOutline } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import UpdateProduct from "@/components/Update";
import SideBar from "@/components/SideBar";
import Create from "@/components/Create";

interface Product {
    ID: string,
    Name: string
    Qty: number
    Amount: number
    Attributes: string[]
    CGST: number
    SGST: number
}

const page = () => {
    const pathname = usePathname()
    const cookies = useCookies();
    const cookie = cookies.get('token')
    const router = useRouter()

    const [createToggle, setCreateToggle] = useState(false)
    const [createToggleInv, setCreateToggleInv] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [product, setProduct] = useState<Product>({
        Name: "", Attributes: [], Amount: 0, Qty: 0, CGST: 0, SGST: 0, ID: ""
    })
    const [user, setUser] = useState("")
    const [constProducts, setconstProducts] = useState([])
    const [search, setSearch] = useState("")

    const FetchAllProduct = async () => {
        setIsLoading(true)
        try {
            let result: any = await fetch(`${BaseURL}/pipeline`, {
                method: 'GET',
                headers: {
                    "content-type": "application/json",
                    "Authorization": `${cookie}`
                },
                credentials: 'include'
            })
            result = await result.json()
            console.log(result)
            if (result.error) return toast.error(result.error)
            if (result.user && result?.result) {
                setUser(result.user)
                setProducts(result.result)
                setconstProducts(result.result)
            }
        } catch (error) {
            console.log(error)
            alert("Something went wrong!")
            return router.replace("/")
        }
        return setIsLoading(false)
    }
    useEffect(() => {
        FetchAllProduct()
    }, [])


    const handleSelect = (p: Product) => {
        setProduct(p)
        setCreateToggle(true)
    }


    useEffect(() => {
        if (search) {
            setProducts((prev: any) => {
                return prev.filter((x: any) => {
                    return ["Party"].some((newItem) => {
                        return (
                            x
                                .Name
                                .toString()
                                .toLowerCase()
                                .indexOf(search.toLowerCase()) > -1
                        );
                    });
                });
            })
        } else {
            setProducts(constProducts)
        }
    }, [search])

    return (
        <main className="w-full max-h-screen overflow-hidden bg-whiteShade flex flex-row">
            <Toaster />
            {/* Side Layout  */}
            {/* <div className="w-[300px] z-10 bg-white shadow-lg max-h-screen h-screen overflow-hidden text-whiteShade px-4 py-6 pt-8 hidden md:flex md:flex-col justify-between">
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
                    <button className='rounded-lg bg-gradient-to-b from-[#FF8A08] to-[#FFC100] text-white py-[14px] text-center w-full flex flex-row justify-center gap-2' >
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
            </div> */}
            <SideBar user={user} FetchAllInventories={() => { }} createToggle={createToggleInv} setCreateToggle={setCreateToggleInv} />


            <div className="w-full relative overflow-y-auto overflow-x-hidden px-8 py-6 flex min-h-screen  bg-[#F7F7F7] flex-col items-center justify-start ">
                <div className='w-full font-barlow flex flex-row justify-between items-center pb-4'>
                    <div className='text-2xl md:text-4xl font-bold'>Update Product</div>
                    <div className='flex flex-row px-2 gap-1 items-center justify-center text-xs sm:text-base'>
                        Help & feedback
                        <MdHelpOutline className='text-base' />
                    </div>
                </div>

                <div className='w-full flex flex-row justify-between pb-4'>
                    <div className='p-2 rounded-lg flex flex-row items-center bg-white'>
                        <input value={search} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} type='text' placeholder='Search' className='outline-none' />
                        <CiSearch />
                    </div>
                    <div className='flex flex-row gap-4'>
                        {/* <div className='flex flex-row items-center justify-center bg-[#F4F4F4] p-2 rounded text-[#797979] gap-[14px]'>
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
                        </div> */}

                    </div>
                </div>

                <hr className="w-full" />
                <div className="flex flex-row flex-wrap justify-center gap-4 w-full pt-6">
                    {
                        products?.map((product: Product, i: any) => {
                            return (
                                <div onClick={() => handleSelect(product)} className=" duration-300 ease-in-out rounded-lg p-4 bg-white shadow-lg w-full sm:w-[32.5%] lg:w-[23.8%] hover:scale-105 cursor-pointer">
                                    <div className="text-xl font-semibold">{product.Name}</div>
                                    <hr />
                                    <div className="flex flex-row justify-between w-full mt-2">
                                        <div className="text-sm">Qty: <span className="font-semibold text-base">{product.Qty}</span></div>
                                        <div className="text-sm">Amount <span className="font-semibold text-base">{product.Amount}</span></div>
                                    </div>
                                    <div className="flex flex-row justify-between w-full">
                                        <div className="text-sm">CGST: <span className="font-semibold text-base">{product.CGST}</span></div>
                                        <div className="text-sm">SGST <span className="font-semibold text-base">{product.SGST}</span></div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className={`fixed top-0 right-[-180vw] duration-300 ease-in-out w-full md:w-auto  ${createToggle && 'translate-x-[-180vw] z-30'}`}>
                    <UpdateProduct setCreateToggle={setCreateToggle} FetchAllProduct={FetchAllProduct} prdt={product} setPrdt={setProduct} />
                </div>


            </div>



        </main>
    )
}

export default page