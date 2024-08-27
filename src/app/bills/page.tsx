'use client'

import { BaseURL } from "@/constants/baseUrl";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import cal from '../../../public/pic/cal.png'
import filter from '../../../public/pic/filter.png'
import auto from '../../../public/pic/auto.png'
import share from '../../../public/pic/share.png'
import { MdHelpOutline } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import SideBar from "@/components/SideBar";

const page = () => {
    const pathname = usePathname()
    const cookies = useCookies();
    const cookie = cookies.get('token')
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [createToggleInv, setCreateToggleInv] = useState(false)
    const [bills, setBills] = useState([])
    const [user, setUser] = useState("")
    const [constBills, setconstBills] = useState([])
    const [search, setSearch] = useState("")

    const FetchAllBills = async () => {
        setIsLoading(true)
        try {
            let result: any = await fetch(`${BaseURL}/billing`, {
                method: 'GET',
                headers: {
                    "content-type": "application/json",
                    "Authorization": `${cookie}`
                },
                credentials: 'include'
            })
            result = await result.json()
            console.log(result)
            if (result.error) {
                console.log(result.error)
                return toast.error(result.error)
            }
            if (result && result?.result) {
                setUser(result.name)
                setBills(result.result)
                setconstBills(result.result)
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong!")
            return
        }
        return setIsLoading(false)
    }
    useEffect(() => {
        FetchAllBills()
    }, [])


    useEffect(() => {
        if (search) {
            setBills((prev: any) => {
                return prev.filter((x: any) => {
                    return ["Party"].some((newItem) => {
                        console.log(x[newItem].Name)
                        return (
                            x[newItem]
                                .Name
                                .toString()
                                .toLowerCase()
                                .indexOf(search.toLowerCase()) > -1
                        );
                    });
                });
            })
        } else {
            setBills(constBills)
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
                        <Link href={"/billing"} className={`w-auto p-2 rounded flex flex-row items-center gap-4 border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ${pathname === '/boards' && 'bg-[#F4F4F4] text-[#797979] border-[#DDDDDD]'}`}>
                            <Image src={Boards} alt="Boards" width={24} height={24} />
                            Billing
                        </Link>
                        <Link href={"/update"} className={`w-auto p-2 rounded flex flex-row items-center gap-4 border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ${pathname === '/teams' && 'bg-[#F4F4F4] text-[#797979] border-[#DDDDDD]'}`}>
                            <Image src={Teams} alt="Teams" width={24} height={24} />
                            Update
                        </Link>
                        <Link href={"/bills"} className={`w-auto p-2 rounded flex flex-row items-center gap-4 border border-transparent cursor-pointer transform duration-[300ms] ease-in-out ${pathname === '/settings' && 'bg-[#F4F4F4] text-[#797979] border-[#DDDDDD]'}`}>
                            <Image src={Settings} alt="Settings" width={24} height={24} />
                            Bills
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
                    <div className='text-4xl font-bold'>Bills</div>
                    <div>
                        <div className='flex flex-row px-2 gap-1 items-center justify-center'>
                            Help & feedback
                            <MdHelpOutline />
                        </div>
                    </div>
                </div>

                <div className='w-full flex flex-row justify-between pb-4'>
                    <div className='p-2 rounded-lg flex flex-row items-center bg-white'>
                        <input value={search} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} type='text' placeholder='Search' className='outline-none' />
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

                    </div>
                </div>

                <hr className="w-full mb-4" />

                {
                    bills.length < 1 && !isLoading ? <div>No bill created</div>
                        : (
                            !isLoading ?
                                (
                                    <div className="relative overflow-x-auto w-full rounded-lg flex flex-col gap-4">
                                        {
                                            bills?.map((bill: any, i: number) => {
                                                const productArr = bill?.Products?.map((x: any, i: number) => {
                                                    const price = x.Amount * x.Qty
                                                    return (price + price * x.CGST / 100 + price * x.SGST / 100)
                                                })
                                                console.log(productArr)
                                                const total = productArr.length >= 1 ? productArr.reduce((a: any, b: any) => a + b) : 0
                                                return (
                                                    <div key={i} className="w-full bg-white rounded-lg p-4">
                                                        <div className="w-full flex flex-row justify-between pb-2">
                                                            <div className="text-[#666666] text-sm">
                                                                Party:
                                                                <span className="text-black font-semibold text-xl md:text-lg sm:text-base pl-2">{bill.Party.Name}</span>
                                                            </div>
                                                            <div className="text-sm">{bill.CreatedAt}</div>
                                                        </div>
                                                        <hr />
                                                        <div className="flex flex-row gap-4 pb-2">
                                                            <div className="flex flex-col flex-1">
                                                                <div className="text-lg font-semibold">{bill.Shop.S_Name}</div>
                                                                <div className="text-[12px] text-[#666666]">{bill.Shop.S_Email}</div>
                                                                <div className="text-[12px] text-[#666666]">{bill.Shop.S_address}</div>
                                                                <div className="text-[12px] text-[#666666]">{bill.Shop.S_phone}</div>
                                                            </div>
                                                            <div className="flex flex-col flex-1">
                                                                <div className="text-lg font-semibold">{bill.Party.Name}</div>
                                                                <div className="text-[12px] text-[#666666]">{bill.Party.S_Email}</div>
                                                                <div className="text-[12px] text-[#666666]">{bill.Party.Address}</div>
                                                                <div className="text-[12px] text-[#666666]">{bill.Party.Email}</div>
                                                                <div className="text-[12px] text-[#666666]">{bill.Party.Phone}</div>
                                                                <div className="text-[12px] text-[#666666]">{bill.Party.Pan}</div>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div>
                                                            <table className="w-full text-[12px] text-left text-gray-500 ">
                                                                <thead className=" text-gray-700 border-b">
                                                                    <tr>
                                                                        <th scope="col" className="px-2 py-1">
                                                                            Sl.
                                                                        </th>
                                                                        <th scope="col" className="px-2 py-1">
                                                                            Product name
                                                                        </th>
                                                                        <th scope="col" className="px-2 py-1">
                                                                            Qty
                                                                        </th>
                                                                        <th scope="col" className="px-2 py-1">
                                                                            Amount
                                                                        </th>
                                                                        <th scope="col" className="px-2 py-1">
                                                                            CGST (%)
                                                                        </th>
                                                                        <th scope="col" className="px-2 py-1">
                                                                            SGST (%)
                                                                        </th>
                                                                        <th scope="col" className="px-2 py-1">
                                                                            Amount after Tax
                                                                        </th>


                                                                    </tr>
                                                                </thead>
                                                                <tbody className="">
                                                                    {
                                                                        bill.Products?.map((product: any, i: number) => {
                                                                            return (
                                                                                <tr key={i} className=" ">
                                                                                    <td className="px-2 py-1">
                                                                                        {i + 1}
                                                                                    </td>
                                                                                    <th scope="row" className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap ">
                                                                                        {product.Name}
                                                                                    </th>
                                                                                    <td className="px-2 py-1">
                                                                                        {product.Qty}
                                                                                    </td>
                                                                                    <td className="px-2 py-1">
                                                                                        {product.Amount * product.Qty}
                                                                                    </td>
                                                                                    <td className="px-2 py-1">
                                                                                        {product.CGST}
                                                                                    </td>
                                                                                    <td className="px-2 py-1">
                                                                                        {product.SGST}
                                                                                    </td>
                                                                                    <td className="px-2 py-1">
                                                                                        {productArr[i]}
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }


                                                                </tbody>
                                                                <tfoot className="border-y text-[14px]">
                                                                    <tr className="font-semibold ">
                                                                        <th scope="row" className="px-2 py-2 text-base">Total</th>
                                                                        <td className="px-2 py-2"></td>
                                                                        <td className="px-2 py-2"></td>
                                                                        <td className="px-2 py-2"></td>
                                                                        <td className="px-2 py-2"></td>
                                                                        <td className="px-2 py-2"></td>
                                                                        <td className="px-2 py-2">{total}</td>
                                                                    </tr>
                                                                </tfoot>
                                                            </table>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            )
                                        }
                                    </div>
                                )
                                : <div className='rounded-md h-8 w-8 border-4 border-t-4 border-[#FF8A08] animate-spin'></div>
                        )
                }

            </div>


        </main>
    )
}

export default page