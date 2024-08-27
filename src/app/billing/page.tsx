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
import toast, { Toaster } from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { BaseURL } from "@/constants/baseUrl";
import { ChangeEvent, ReactEventHandler, useEffect, useState } from "react";
import { MdCancel, MdHelpOutline } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import PrintComponents from "react-print-components"
import SideBar from "@/components/SideBar";

interface Product {
    ID: string,
    Name: string
    Qty: number
    Amount: number
    Attributes: string[]
    CGST: number
    SGST: number
}

interface Bill {
    Product: Product
    CSGT_Amount: number
    SGST_Amount: number
}

export default function page({ params }: { params: { inventory: string } }) {

    const pathname = usePathname()
    const cookies = useCookies();
    const cookie = cookies.get('token')
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [createToggleInv, setCreateToggleInv] = useState(false)
    const [user, setUser] = useState("")
    const [products, setProducts] = useState<Product[]>([])
    const [date, setDate] = useState<Date>(new Date)
    const [billingProductes, setBillingProductes] = useState<Product[]>([])
    const [options, setOptions] = useState<Product[]>([])
    const [qty, setQty] = useState<number>(0)
    const [selectedOption, setSelectedOption] = useState<number>(-1)
    const [selectedOptionObj, setSelectedOptionObj] = useState<Product>({
        Amount: 0,
        Name: "",
        Attributes: [],
        Qty: 0,
        ID: "",
        CGST: 0,
        SGST: 0
    })
    const [addedProducts, setAddedProducts] = useState<Product[]>([])
    const [shop, setShop] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    })
    const [party, setParty] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        pan: "",
        gstin: ""
    })
    const [invoiceBTN, setInvoiceBTN] = useState<boolean>(true)

    const handleShop = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value } = e.target
        setShop(prev => ({ ...prev, [name]: value }))
    }
    const handleParty = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        const { name, value } = e.target
        setParty(prev => ({ ...prev, [name]: value }))
    }

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
            // console.log(result)
            if (result.error) {
                console.log(result)
                return
            }
            if (result.user && result?.result) {
                setUser(result.user)
                setProducts(result.result)
                setOptions(result.result)
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong!")
            return
        }
        return setIsLoading(false)
    }

    const handleBilling = async () => {
        setIsLoading(true)
        if (!invoiceBTN || addedProducts.length < 1) {
            setIsLoading(false)
            console.log(invoiceBTN, addedProducts.length)
            return toast.error("No product added!")
        }
        const bill = {
            Shop: {
                S_Name: shop.name,
                S_Email: shop.email,
                S_phone: shop.phone,
                S_address: shop.address
            },
            Party: {
                Name: party.name,
                Email: party.email,
                Phone: party.phone,
                Address: party.address,
                Pan: party.pan,
                Gstin: party.gstin
            },
            Products: addedProducts
        }
        try {
            let result: any = await fetch(`${BaseURL}/bill`, {
                method: 'PATCH',
                headers: {
                    "content-type": "application/json",
                    "Authorization": `${cookie}`
                },
                credentials: 'include',
                body: JSON.stringify(addedProducts)
            })
            console.log(bill)
            let result2: any = await fetch(`${BaseURL}/billing`, {
                method: 'POST',
                headers: {
                    "content-type": "application/json",
                    "Authorization": `${cookie}`
                },
                credentials: 'include',
                body: JSON.stringify(bill)
            })
            result = await result.json()
            // console.log(result)
            if (result.error || result2.error) {
                setIsLoading(false)
                return toast.error(result.error || result2.error)
            }
            if (result.user && result?.result && result2?.result) {
                console.log(result2.result)
                toast.success("Invoice is generated successfully!")
            }
        } catch (error) {
            console.log(error)
            // alert("Something went wrong!")
            toast.error("Error occured!")
        }
        return setIsLoading(false)
    }

    const handleLogout = () => {
        cookies.remove('token')
        router.push("/login")
    }

    const addProduct = () => {
        console.log("test", qty, typeof (qty))
        if (selectedOption === -1 || qty < 1) return toast.error("Select product & quantity before adding!")
        console.log(qty)

        let arr = addedProducts
        const i = arr.findIndex(a => a.ID === selectedOptionObj.ID)
        let remains = options
        const j = remains.findIndex(a => a.ID === selectedOptionObj.ID)
        if (remains[j].Qty < qty) return toast.error("Don't have enough in stock!")
        remains[j].Qty -= qty
        setOptions(remains)
        if (i < 0) {
            setAddedProducts((prev: Product[]) => [...prev, {
                Amount: selectedOptionObj.Amount,
                Name: selectedOptionObj.Name,
                Qty: qty,
                Attributes: selectedOptionObj.Attributes,
                ID: selectedOptionObj.ID,
                CGST: selectedOptionObj.CGST,
                SGST: selectedOptionObj.SGST
            }])
        }
        else {
            arr[i].Qty += qty
            setAddedProducts(arr)
        }

        setSelectedOptionObj({
            Amount: 0,
            Name: "",
            Attributes: [],
            Qty: 0,
            ID: "",
            CGST: 0,
            SGST: 0
        })
        setSelectedOption(-1)
        setQty(0)
        return toast.success("Product Added successfully!")
    }

    const deleteProduct = (productId: string) => {
        let added = options
        added[added.findIndex(a => a.ID === productId)].Qty += addedProducts.filter((product: Product) => {
            return product.ID === productId
        })[0].Qty
        setOptions(added)
        setAddedProducts(addedProducts.filter((product: Product) => {
            return product.ID != productId
        }))

    }

    useEffect(() => {
        if (selectedOption === -1) {
            return
        }
        setSelectedOptionObj({
            Amount: options[selectedOption].Amount,
            Name: options[selectedOption].Name,
            Attributes: options[selectedOption].Attributes,
            Qty: options[selectedOption].Qty,
            ID: options[selectedOption].ID,
            CGST: options[selectedOption].CGST,
            SGST: options[selectedOption].SGST
        })

    }, [selectedOption])

    useEffect(() => {
        FetchAllProduct()
    }, [])

    useEffect(() => {
        if (addedProducts.length < 1) return setInvoiceBTN(false)
        if (addedProducts.length > 0) return setInvoiceBTN(true)
        return () => setInvoiceBTN(true)
    }, [addedProducts])

    // console.log(addedProducts)

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
                <div className='w-full font-barlow flex flex-row justify-between items-center pb-4 '>
                    <div className='text-2xl md:text-4xl font-bold'>Create Invoice</div>
                    <div className='flex flex-row px-2 gap-1 items-center justify-center text-xs sm:text-base'>
                        Help & feedback
                        <MdHelpOutline className='text-base' />
                    </div>
                </div>
                <hr className="w-full mb-2 md:mb-4" />

                <div className="flex lg:flex-row flex-col gap-4 mt-2 lg:mt-4 w-full">
                    <div className="flex flex-col flex-1  p-3 w-full ">
                        <div className="text-2xl font-bold">Invoice Details <span className="text-xs pl-4 font-medium">Date: {date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()}</span></div>
                        <div >
                            <div className="mt-4 flex flex-col gap-4">
                                <div className="text-[#FF8A08] text-lg font-semibold">Shop Detailes</div>
                                <div className="flex flex-col gap-2 text-[14px]">
                                    Shop *
                                    <input name="name" value={shop.name} onChange={handleShop} type="text" placeholder="Party Name" className="py-2 px-4 rounded outline-none " />
                                </div>
                                <div className="flex flex-col gap-2 text-[14px]">
                                    Address *
                                    <input name="address" value={shop.address} onChange={handleShop} type="text" placeholder="Shop Address" className="py-2 px-4 rounded outline-none" />
                                </div>
                                <div className="flex flex-col gap-2 text-[14px]">
                                    Mobile No. *
                                    <input name="phone" value={shop.phone} onChange={handleShop} type="text" placeholder="Mobile No." className="py-2 px-4 rounded outline-none" />
                                </div>
                                <div className="flex flex-col gap-2 text-[14px]">
                                    Email *
                                    <input name="email" value={shop.email} onChange={handleShop} type="email" style={{ resize: 'none' }} placeholder="Email Address" className="py-2 px-4 rounded outline-none" />
                                </div>
                            </div>
                        </div>
                        {/* Party-------------------- */}
                        <div className="mt-4 flex flex-col gap-4">
                            <div className="text-[#FF8A08] text-lg font-semibold">Party Detailes</div>
                            <div className="flex flex-col gap-2 text-[14px]">
                                Party Details *
                                <input name="name" value={party.name} onChange={handleParty} type="text" placeholder="Party Details" className="py-2 px-4 rounded outline-none " />
                            </div>
                            <div className="flex flex-col gap-2 text-[14px]">
                                Party PAN *
                                <input name="pan" value={party.pan} onChange={handleParty} type="text" placeholder="Party PAN" className="py-2 px-4 rounded outline-none uppercase" />
                            </div>
                            <div className="flex flex-col gap-2 text-[14px]">
                                Party Mobile No. *
                                <input name="phone" value={party.phone} onChange={handleParty} type="text" placeholder="Party Mobile No." className="py-2 px-4 rounded outline-none" />
                            </div>
                            <div className="flex flex-col gap-2 text-[14px]">
                                Party Email *
                                <input name="email" value={party.email} onChange={handleParty} type="text" placeholder="Party Email" className="py-2 px-4 rounded outline-none" />
                            </div>
                            <div className="flex flex-col gap-2 text-[14px]">
                                Address *
                                <textarea name="address" value={party.address} onChange={handleParty} style={{ resize: 'none' }} placeholder="Party Address" className="py-2 px-4 rounded outline-none" />
                            </div>
                            <div className="flex flex-col gap-2 text-[14px]">
                                Party GSTIN / UIN *
                                <input name="gstin" value={party.gstin} onChange={handleParty} type="text" placeholder="Party GSTIN / UIN " className="py-2 px-4 rounded outline-none" />
                            </div>
                        </div>

                        {/* Table-------------------- */}
                        <div className="mt-4 flex flex-col gap-4">
                            <div className="text-[#FF8A08] text-lg font-semibold">Party Detailes</div>
                            <div className="flex flex-col gap-2 text-[14px]">
                                Product *
                                <div className="flex flex-row w-full gap-4">
                                    <select id="select" value={selectedOption} onChange={(event: any) => setSelectedOption(event.target.value)} className="py-2 px-4 rounded outline-none w-full">
                                        <option value={-1} disabled>Select product</option>
                                        {options.map((option, i) => (
                                            <option key={option.Name} value={i}>
                                                {option.Name}
                                                {/* <label className="text-xs pl-4">  */}
                                                {option.Amount}/-
                                                {/* </label> */}
                                            </option>
                                        ))}
                                    </select>
                                    <input value={qty} onChange={(e) => { return setQty(parseInt(e.target.value)) }} type="number" placeholder="Quantity" max={selectedOptionObj.Qty} className="py-2 px-4 rounded outline-none w-1/3" />
                                    <button onClick={addProduct} className="py-2 px-4 rounded bg-[#FF8A08] text-white">Add</button>
                                </div>
                                <div className="text-xs">{selectedOption && `${selectedOptionObj.Name} available qty- ${selectedOptionObj.Qty}`}</div>
                                <div>CGST: {selectedOptionObj.CGST}%</div>
                                <div>SGST: {selectedOptionObj.SGST}%</div>

                                {
                                    addedProducts.length >= 1 &&
                                    <div className="flex flex-col gap-2 mt-4">
                                        {
                                            addedProducts.map((product, i) => {
                                                return (
                                                    <div key={i} className="flex flex-row items-baseline justify-between py-2 px-3 border-b text-sm">
                                                        <div className="flex flex-row  gap-3">
                                                            <div className="w-1/2 text-ellipsis">{product.Name}</div>
                                                            <div className="text-xs text-[#999999]">qty:{product.Qty}</div>
                                                            <div className="text-xs text-[#999999]">amount:{product.Amount}</div>
                                                        </div>
                                                        <MdCancel className="text-base cursor-pointer" onClick={() => deleteProduct(product.ID)} />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 max-w-full  w-full p-3 min-h-screen h-auto">
                        <div className="text-2xl font-bold mb-8">Preview</div>
                        <div className="rounded-lg bg-white p-3 w-full min-h-[600px] flex flex-col items-center ">

                            <Bill shop={shop} party={party} products={addedProducts} />

                        </div>
                        <div className="mt-8 flex flex-row gap-2 w-full justify-end">
                            <button onClick={handleBilling} className="p-2 text-sm text-white bg-[#FF8A08] rounded">Generate</button>
                            <PrintBill shop={shop} party={party} products={addedProducts} />
                            <button onClick={() => {
                                setAddedProducts([])
                            }} className="p-2 text-sm text-white bg-[#FF8A08] rounded">Reset the table</button>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    )
}

const Bill = ({ shop, party, products }: { shop: any, party: any, products: Product[] }) => {
    const productArr = products?.map(x => {
        const price = x.Amount * x.Qty
        return (price + price * x.CGST / 100 + price * x.SGST / 100)
    })
    console.log(productArr)
    const total = productArr.length >= 1 ? productArr.reduce((a, b) => a + b) : 0
    return (
        <div className="flex flex-col items-center border w-full h-full py-6 rounded-sm text-sm">
            <div className=" flex flex-col items-center w-3/4 text-wrap break-words">
                <div className="text-xl font-bold text-center w-full  break-words">{shop.name || "Emaple Enterprise"}</div>
                <div className="text-xs text-center w-full break-words">{shop.address || "Raiganj, Mohanbati, UD-733134"}</div>
                <div className="text-[10px] text-center w-full ">+91{shop.phone || "XXXXXXXXXX"}</div>
            </div>
            <div className="border-y flex flex-row w-full text-[8px] leading-[12px]">
                <div className="flex-1 p-1 border-r w-full break-words">
                    <div className="font-bold">Party Details:</div>
                    <div className="uppercase">{party.name || "Laxmi xyz pvt. Ltd."}</div>
                    <div>{"Raiganj, Mohanbati, UD-733134"}</div>

                    <div className="flex flex-row mt-1">
                        <span className="font-bold w-2/5">Party PAN</span>
                        <span className="w-full text-wrap">: {party.pan || "XXXXXXXXXX"}</span>
                    </div>
                    <div className="flex flex-row">
                        <span className="font-bold w-2/5">Party Mobile</span>
                        <span className="w-full text-wrap">: {party.phone || "XXXXXXXXXX"}</span>
                    </div>
                    <div className="flex flex-row">
                        <span className="font-bold w-2/5">GSTIN / UIN</span>
                        <span className="w-full text-wrap">: {party.gstin || ""}</span>
                    </div>
                </div>
                <div className="flex-1 p-1">
                    <div className="flex flex-row ">
                        <span className="font-bold w-2/5">Invoice No.</span>
                        <span className="w-full text-wrap">: XXXXXXXXXX</span>
                    </div>
                    <div className="flex flex-row">
                        <span className="font-bold w-2/5">Place of Supply</span>
                        <span className="w-full text-wrap">: XXXXXXXXXXXXXXXXXXXX, XXXXXXXXXXX</span>
                    </div>
                    <div className="flex flex-row">
                        <span className="font-bold w-2/5">Transport</span>
                        <span className="w-full text-wrap">: XXXXXXXXXX67899</span>
                    </div>
                </div>

            </div>
            <div className="relative overflow-x-auto w-full min-h-1/3">
                <table className="w-full text-[10px] text-left text-gray-500 ">
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
                            products?.map((product: Product, i: number) => {
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
                    {/* <tfoot className="border-y text-[10px]">
                        <tr className="font-semibold ">
                            <th scope="row" className="px-2 py-2 text-base">Total</th>
                            <td className="px-2 py-2"></td>
                            <td className="px-2 py-2"></td>
                            <td className="px-2 py-2">21,000</td>
                        </tr>
                    </tfoot> */}
                </table>
            </div>
            <div className="relative overflow-x-auto w-full text-[10px] border-y p-2 flex flex-row justify-end gap-3">
                {/* <table className="w-full text-[10px] text-left text-gray-500 ">
                    <tfoot className="border-y">
                        <tr className="font-semibold ">
                            <th className="px-2 py-2">Total</th>
                            <td className="px-2 py-2">21,000</td>
                        </tr>
                    </tfoot>
                </table> */}
                <span>Total : </span>
                <span className="w-[10vw]">{total}</span>
            </div>
        </div>
    )
}



const PrintBill = ({ shop, party, products }: { shop: any, party: any, products: any }) => {
    return (
        <PrintComponents className="h-full" trigger={
            <button className="p-2 text-sm text-white bg-[#FF8A08] rounded">Print</button>
        }>
            <div className="w-screen h-screen"><Bill2 shop={shop} party={party} products={products} /></div>

        </PrintComponents>
    )
}

const Bill2 = ({ shop, party, products }: { shop: any, party: any, products: Product[] }) => {
    const productArr = products?.map(x => {
        const price = x.Amount * x.Qty
        return (price + price * x.CGST / 100 + price * x.SGST / 100)
    })
    console.log(productArr)
    const total = productArr.length >= 1 ? productArr.reduce((a, b) => a + b) : 0
    return (
        <div className="flex flex-col items-center border w-full h-full py-6 rounded-sm text-sm">
            <div className=" flex flex-col items-center w-3/4 text-wrap break-words">
                <div className="text-xl font-bold text-center w-full  break-words">{shop.name || "Emaple Enterprise"}</div>
                <div className="text-xs text-center w-full break-words">{shop.address || "Raiganj, Mohanbati, UD-733134"}</div>
                <div className="text-[10px] text-center w-full ">+91{shop.phone || "XXXXXXXXXX"}</div>
            </div>
            <div className="border-y flex flex-row w-full text-[10px] leading-[14px]">
                <div className="flex-1 p-1 border-r w-full break-words">
                    <div className="font-bold">Party Details:</div>
                    <div className="uppercase">{party.name || "Laxmi xyz pvt. Ltd."}</div>
                    <div>{"Raiganj, Mohanbati, UD-733134"}</div>

                    <div className="flex flex-row mt-1">
                        <span className="font-bold w-2/5">Party PAN</span>
                        <span className="w-full text-wrap">: {party.pan || "XXXXXXXXXX"}</span>
                    </div>
                    <div className="flex flex-row">
                        <span className="font-bold w-2/5">Party Mobile</span>
                        <span className="w-full text-wrap">: {party.phone || "XXXXXXXXXX"}</span>
                    </div>
                    <div className="flex flex-row">
                        <span className="font-bold w-2/5">GSTIN / UIN</span>
                        <span className="w-full text-wrap">: {party.gstin || ""}</span>
                    </div>
                </div>
                <div className="flex-1 p-1">
                    <div className="flex flex-row ">
                        <span className="font-bold w-2/5">Invoice No.</span>
                        <span className="w-full text-wrap">: XXXXXXXXXX</span>
                    </div>
                    <div className="flex flex-row">
                        <span className="font-bold w-2/5">Place of Supply</span>
                        <span className="w-full text-wrap">: XXXXXXXXXXXXXXXXXXXX, XXXXXXXXXXX</span>
                    </div>
                    <div className="flex flex-row">
                        <span className="font-bold w-2/5">Transport</span>
                        <span className="w-full text-wrap">: XXXXXXXXXX67899</span>
                    </div>
                </div>

            </div>
            <div className="relative overflow-x-auto w-full min-h-1/3">
                <table className="w-full text-[10px] text-left text-gray-500 ">
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
                            products?.map((product: Product, i: number) => {
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
                    {/* <tfoot className="border-y text-[10px]">
                        <tr className="font-semibold ">
                            <th scope="row" className="px-2 py-2 text-base">Total</th>
                            <td className="px-2 py-2"></td>
                            <td className="px-2 py-2"></td>
                            <td className="px-2 py-2">21,000</td>
                        </tr>
                    </tfoot> */}
                </table>
            </div>
            <div className="relative overflow-x-auto w-full text-[10px] border-y p-2 flex flex-row justify-end gap-3">
                {/* <table className="w-full text-[10px] text-left text-gray-500 ">
                    <tfoot className="border-y">
                        <tr className="font-semibold ">
                            <th className="px-2 py-2">Total</th>
                            <td className="px-2 py-2">21,000</td>
                        </tr>
                    </tfoot>
                </table> */}
                <span>Total : </span>
                <span className="w-[10vw]">{total}</span>
            </div>
        </div>
    )
}