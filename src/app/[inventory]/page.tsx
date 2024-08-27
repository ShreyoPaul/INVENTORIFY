'use client'
import Image from "next/image";
import Link from "next/link";
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
import toast, { Toaster } from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { BaseURL } from "@/constants/baseUrl";
import { useEffect, useState } from "react";
import { MdHelpOutline } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import Create, { CreateProduct, InventoryProps } from "@/components/Create";
import SideBar from "@/components/SideBar";

interface Attribute {
    Key: String
    Value: String
}

interface Product {
    Name: String
    Attributes: Attribute[]
}

// interface Inventory {
//     ID: String,
//     Name: String,
//     Attributes: String[]
//     Products: Product[]
// }

export default function page({ params }: { params: { inventory: string } }) {

    const pathname = usePathname()
    const cookies = useCookies();
    const cookie = cookies.get('token')
    const router = useRouter()

    const [createToggle, setCreateToggle] = useState(false)
    const [createToggleInv, setCreateToggleInv] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState("")
    const [inventory, setInventory] = useState<InventoryProps>({
        ID: "",
        Name: "",
        Attributes: [],
        Products: []
    })
    const [productAttribute, setProductAttribute] = useState<any>([])

    const FetchAllProduct = async () => {
        setIsLoading(true)
        try {
            let result: any = await fetch(`${BaseURL}/${params.inventory}`, {
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
                setInventory({
                    ID: result.result[0].ID,
                    Name: result.result[0].Name,
                    Attributes: result.result[0].Attributes,
                    Products: result.result[0].Products,
                })
                // const z = result.result[0].Attributes.map((x: any, i: any) => {
                //     return {
                //         Key: x,
                //         Value: ""
                //     }
                // })
                // console.log(z, result.result[0].Attributes)
                // setProductAttribute(z)
            }
        } catch (error) {
            console.log(error)
            alert("Something went wrong!")
            return router.replace("/")
        }
        return setIsLoading(false)
    }

    const handleLogout = () => {
        cookies.remove('token')
        router.push("/login")
    }

    useEffect(() => {
        FetchAllProduct()
    }, [])

    // console.log(inventory.Products)

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
                            <div className={`fixed top-0 right-[-80vw] duration-300 ease-in-out ${createToggle && 'translate-x-[-80vw] z-30'}`}>
                                <CreateProduct setCreateToggle={setCreateToggle} FetchAllProsucts={FetchAllProduct} inventory={inventory} productAttribute={productAttribute} setProductAttribute={setProductAttribute} />
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
                    <button onClick={() => setCreateToggle(!createToggle)} className='rounded-lg bg-gradient-to-b from-[#FF8A08] to-[#FFC100] text-white py-[14px] text-center w-full flex flex-row justify-center gap-2' >
                        Create new Product
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

            <div className="w-full relative overflow-y-auto overflow-x-hidden px-8 pt-6 flex min-h-screen  bg-[#F7F7F7] flex-col items-center justify-start ">
                <div className='w-full font-barlow flex flex-row justify-between items-center pb-4'>
                    <div className='text-4xl font-bold'>{inventory.Name !== "" ? inventory.Name : <div className=" w-80 h-8 my-1 rounded animate-pulse bg-[#cacaca] z-10" />}</div>
                    <div>
                        <div className='flex flex-row px-2 gap-1 items-center justify-center'>
                            Help & feedback
                            <MdHelpOutline />
                        </div>
                    </div>
                </div>

                <div className='w-full flex flex-row justify-between pb-4'>
                    <div className='p-2 rounded-lg flex flex-row items-center bg-white'>
                        <input type='text' placeholder='Search' className='outline-none' />
                        <CiSearch />
                    </div>
                    <div className='flex flex-row gap-4'>
                        {/* <div className='flex flex-row items-center justify-center bg-[#F4F4F4] p-2 rounded text-[#797979] gap-[14px]'>
                            Calendar view
                            <Image src={cal} alt='cal' width={24} height={24} />
                        </div> */}
                        

                    </div>
                </div>

                <hr className="w-full mb-4" />

                {
                    inventory.Products.length < 1 && !isLoading ? <div>No inventory created</div>
                        : (
                            !isLoading ?
                                // <div className='w-full flex flex-col flex-wrap gap-2 text-sm  items-center'>
                                //     <div className="w-full flex flex-row border-b-black">
                                //         <span className="p-2">Sl.</span>
                                //         <span className="p-2 min-w-[33%]">Name</span>
                                //         {
                                //             inventory.Attributes?.map((attribute, i) => {
                                //                 return (
                                //                     <span key={i} className="p-2">{attribute}</span>
                                //                 )
                                //             })
                                //         }
                                //     </div>
                                //     {inventory.Products?.map((product: any, i) => {
                                //         return (
                                //             <div key={i} className='w-full'>
                                //                 <span className="p-2">{i + 1}</span>
                                //                 <span className="p-2  min-w-[33%]">{product.Name}</span>
                                //                 {
                                //                     product.Attributes?.map((attribute: any, i: any) => {
                                //                         console.log(attribute.Value)
                                //                         return (
                                //                             <span key={i} className="p-2">{attribute.Value}</span>
                                //                         )
                                //                     })
                                //                 }
                                //             </div>
                                //         )
                                //     })}
                                // </div>
                                (
                                    <div className="relative overflow-x-auto w-full bg-white p-4 rounded-lg">
                                        <table className="w-full text-sm text-left text-gray-500 ">
                                            <thead className="text-xs text-white uppercase bg-[#FF8A08] ">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 rounded-s-lg">
                                                        Product name
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        qty
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        amount
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        CGST
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        SGST
                                                    </th>
                                                    {inventory.Attributes?.map((attribute, i) => {
                                                        if (i === inventory.Attributes?.length - 1) {
                                                            return (
                                                                <th scope="col" className="px-6 py-3 rounded-r-lg">
                                                                    {attribute}
                                                                </th>
                                                            )
                                                        } else return (
                                                            <th scope="col" className="px-6 py-3 uppercase">
                                                                {attribute}
                                                            </th>
                                                        )
                                                    })}

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {inventory.Products?.map((product: any, i) => {
                                                    return (
                                                        <tr className="border-b" key={i}>
                                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                                                {product.Name}
                                                            </th>
                                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                                                {product.Qty}
                                                            </th>
                                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                                                {product.Amount}
                                                            </th>
                                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                                                {product.CGST}
                                                            </th>
                                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                                                {product.SGST}
                                                            </th>
                                                            {
                                                                product.Attributes?.map((attribute: any, i: any) => {
                                                                    // console.log(attribute.Value)
                                                                    return (
                                                                        <td className="px-6 py-4">{attribute !== "" ? attribute : "-"}</td>
                                                                    )
                                                                })
                                                            }
                                                        </tr>
                                                    )
                                                })}

                                            </tbody>
                                            {/* <tfoot>
                                                <tr className="font-semibold text-gray-900 ">
                                                    <th scope="row" className="px-6 py-3 text-base">Total</th>
                                                    <td className="px-6 py-3">3</td>
                                                </tr>
                                            </tfoot> */}
                                        </table>
                                    </div>
                                )
                                : <div className='rounded-md h-8 w-8 border-4 border-t-4 border-[#FF8A08] animate-spin'></div>
                        )
                }




            </div>
        </main>
    )
}
