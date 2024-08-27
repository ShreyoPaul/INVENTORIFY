'use client'

import cross from '../../public/pic/cross.png'
import Image from 'next/image'
import { GoPlus } from 'react-icons/go'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { useCookies } from 'next-client-cookies'
import { BaseURL } from '@/constants/baseUrl'
import { FaPen, FaPlus } from 'react-icons/fa'
import toast, { Toaster } from 'react-hot-toast'
import { MdCancel } from 'react-icons/md'
import { AiFillProduct } from 'react-icons/ai'
import { IoMdArrowDroprightCircle, IoMdPricetags } from 'react-icons/io'
import { VscSymbolProperty } from 'react-icons/vsc'

interface Product {
    Name: string
    Qty: number
    Amount: number
    Attributes: string[]
    CGST: any
    SGST: any
}

interface Inventory {
    Name: string
    Attributes: string[]
    Products: string[]
}

export interface InventoryProps {
    ID: String,
    Name: String,
    Attributes: String[]
    Products: Product[]
}

const Create = ({ setCreateToggle, FetchAllInventories }: any) => {

    const [inventory, setInventory] = useState<Inventory>({
        Name: "", Attributes: [], Products: []
    })

    const handleInputs = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value } = e.target
        setInventory(prev => ({ ...prev, [name]: value }))
    }

    const [attribute, setAttribute] = useState('');
    const cookies = useCookies();
    const cookie = cookies.get('user')
    const today = new Date().toISOString().split('T')[0];

    const addAttribute = () => {
        if (attribute === "") return toast.error("Add attribute name!")
        const inv = inventory
        inv.Attributes.push(attribute)
        setInventory(inv)
        setAttribute("")
    }

    const deleteAttribute = (a: string) => {
        setInventory((prev: Inventory) => {
            const x = prev.Attributes.filter(at => at != a)
            return { ...prev, "Attributes": x }
        })
    }

    const createInventory = async () => {
        // console.log("hvjdbc", title, desc, status)
        if (!inventory.Name) return toast.error("Give the inventory name!")
        let res = await fetch(`${BaseURL}`, {
            mode: 'cors',
            method: 'POST',
            headers: {
                "content-type": "application/json",
                "Authorization": `${cookie}`
            },
            credentials: 'include',
            body: JSON.stringify(inventory)
        })
        res = await res.json()
        // console.log(res)
        if (res) {
            FetchAllInventories()
        }
        setInventory({ Name: "", Attributes: [], Products: [] })
        setCreateToggle(false)

    }


    return (
        <div className='px-6 py-4 bg-white w-full md:w-[670px] font-barlow h-screen'>
            {/* <Toaster /> */}
            <div className='flex flex-row w-full justify-between mb-[27px]'>
                <div className='flex flex-row gap-4 items-center justify-center text-sm font-semibold'>
                    <Image src={cross} alt='cross' width={24} height={24} className='cursor-pointer' onClick={() => {
                        setAttribute("")
                        setCreateToggle(false)
                    }} />
                    {today}
                </div>
                <div className='flex flex-row gap-4 text-sm text-[#797979]'>
                    <button onClick={createInventory} className='flex flex-row gap-1 justify-center items-center rounded p-2 bg-[#FF8A08] text-white'>
                        Create
                        <GoPlus className='text-2xl' />
                    </button>

                </div>
            </div>
            <div className='mb-[38px]'>
                <input type='text' placeholder='Inventory name' name='Name' value={inventory.Name} onChange={handleInputs} className='text-2xl md:text-5xl mb-8 outline-none font-semibold' />
                <div className='flex flex-col gap-y-8 w-full'>


                    <div className='flex flex-row w-full items-center justify-start gap-9 md:gap-14'>
                        <div className='flex flex-row items-center gap-3 md:gap-6 text-sm md:text-base text-[#666666] min-w-1/3 whitespace-nowrap'>
                            <VscSymbolProperty className='text-base' />
                            Default properties
                        </div>
                        <div className='flex flex-row gap-2 w-full'>
                            <div className='bg-[#FF8A08] text-white p-2 text-xs rounded-sm'>Quantoty</div>
                            <div className='bg-[#FF8A08] text-white p-2 text-xs rounded-sm'>Amount</div>
                        </div>
                    </div>
                    <div className='flex flex-row w-full justify-start gap-9 md:gap-14'>
                        <div className='flex flex-row items-center gap-3 md:gap-6 text-sm md:text-base text-[#666666] min-w-1/3 whitespace-nowrap'>
                            <FaPen className='text-base' />
                            Add Property
                        </div>
                        <div className='flex flex-row gap-4'>
                            <input type='attribute' placeholder='Attribute' value={attribute} onChange={e => setAttribute(e.target.value)} className='border-b outline-none w-32 sm:w-auto text-sm md:text-base' />
                            <FaPlus onClick={addAttribute} className='p-1 text-lg rounded bg-[#FF8A08] text-white' />
                        </div>
                    </div>

                </div>
            </div>
            <div className='flex flex-col gap-2 mb-9 '>
                <div className=''> Custom attributes</div>
                <div className='flex flex-row gap-2'>
                    {
                        inventory.Attributes.map((a, i) => {
                            return (
                                <div className='bg-[#ffa136] hover:bg-[#FF8A08] duration-500 ease-in-out text-white p-2 text-xs rounded-sm flex flex-row gap-1'>{a} <MdCancel onClick={() => deleteAttribute(a)} className='text-base cursor-pointer' /></div>
                            )
                        })
                    }
                </div>
            </div>
            {/* <hr className='border w-full' /> */}
        </div>
    )
}

const CreateProduct = ({ setCreateToggle, FetchAllProsucts, inventory, productAttribute, setProductAttribute }: { setCreateToggle: any, FetchAllProsucts: any, inventory: any | InventoryProps, productAttribute: any, setProductAttribute: any }) => {
    const [product, setProduct] = useState<Product>({
        Name: "", Attributes: [], Amount: 0, Qty: 0, CGST: 0, SGST: 0
    })

    const [inputs, setInputs] = useState<any>(inventory.Attributes.map((x: string, i: number) => { return "" }))
    // console.log(product, inventory)

    const [products, setProducts] = useState<Product[]>([])

    const addProduct = () => {
        if (product.Name === "" || !product.Qty || !product.Amount) return toast.error("Fill product name, attributes correctly!")
        else if (!parseFloat(product.SGST) || !parseFloat(product.CGST)) return toast.error("CGST and SGST should be float!")
        product.CGST = parseFloat(product.CGST)
        product.SGST = parseFloat(product.SGST)
        setProducts(prev => [...prev, product])
        setInputs(inventory.Attributes.map((x: string, i: number) => { return "" }))
        setProduct({
            Name: "", Attributes: [], Amount: 0, Qty: 0, CGST: 0, SGST: 0
        })
    }

    const deleteAttribute = (i: number) => {
        setProducts((prev: Product[]) => {
            const x = prev.filter((_, j) => j !== i)
            return x
        })
    }

    const pushToInventory = async () => {
        if (products.length < 1) return toast.error("No product added!")
        let res = await fetch(`${BaseURL}/${inventory.ID}`, {
            mode: 'cors',
            method: 'POST',
            headers: {
                "content-type": "application/json",
                "Authorization": `${cookie}`
            },
            credentials: 'include',
            body: JSON.stringify(products)
        })
        res = await res.json()
        console.log(res)
        if (res) {
            FetchAllProsucts()
        }
        setProducts([])
        setCreateToggle(false)

    }

    const handleMainInputs = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value } = e.target
        if (name === "Name") return setProduct(prev => ({ ...prev, [name]: value }))
        else if (name === "CGST" || name === "SGST") return setProduct(prev => ({ ...prev, [name]: value }))
        else return setProduct(prev => ({ ...prev, [name]: parseInt(value) }))
    }
    const handleInputs = (e: ChangeEvent<HTMLInputElement>, i: number) => {
        e.preventDefault();
        const { name, value } = e.target
        setInputs((prev: any) => {
            const x = prev
            x[i] = value
            return x
        })
        setProduct((prev: any) => {
            return { ...prev, "Attributes": inputs }
        })
    }

    const [attribute, setAttribute] = useState('');
    const cookies = useCookies();
    const cookie = cookies.get('user')
    const today = new Date().toISOString().split('T')[0];

    console.log(product)
    return (
        <div className='px-6 py-4 bg-white w-full md:w-[670px] font-barlow h-screen overflow-auto'>
            {/* <Toaster /> */}
            <div className='flex flex-row w-full justify-between mb-[27px]'>
                <div className='flex flex-row gap-4 items-center justify-center text-sm font-semibold'>
                    <Image src={cross} alt='cross' width={24} height={24} className='cursor-pointer' onClick={() => {
                        setAttribute("")
                        setCreateToggle(false)
                    }} />
                    {today}

                </div>
                <div className='flex flex-row gap-4 text-sm text-[#797979]'>
                    <button onClick={pushToInventory} className='flex flex-row gap-1 justify-center items-center rounded p-2 bg-[#FF8A08] text-white'>
                        Push to Inventoory
                        <GoPlus className='text-2xl' />
                    </button>

                </div>
            </div>
            <div>
                <span className='text-base p-3 rounded bg-[#FF8A08] text-white w-auto mb-4'>{inventory.Name} <span className='text-xs fsemi'>({inventory.ID})</span></span>
            </div>

            <div className='mb-[38px]'>
                <input type='text' placeholder='Product name' name='Name' value={product.Name} onChange={handleMainInputs} className='text-3xl my-8 outline-none font-semibold' />
                <div className='flex flex-col text-sm gap-y-3 w-full'>
                    <div className='flex flex-row w-full items-center justify-start gap-[60px]'>
                        <div className='flex flex-row items-center gap-6 text-[#666666] w-1/3 whitespace-nowrap'>
                            <AiFillProduct className='text-xl' />
                            Quanitiy (default)
                        </div>
                        <div className='flex flex-row gap-2 w-full'>
                            <input type='number' placeholder='Quanity' name='Qty' value={product.Qty} onChange={handleMainInputs} className='border-b outline-none  ' />
                        </div>
                    </div>
                    <div className='flex flex-row w-full items-center justify-start gap-[60px]'>
                        <div className='flex flex-row items-center gap-6 text-[#666666] w-1/3 whitespace-nowrap'>
                            <IoMdPricetags className='text-xl' />
                            Amount (default)
                        </div>
                        <div className='flex flex-row gap-2 w-full'>
                            <input type='number' placeholder='Amount' name='Amount' value={product.Amount} onChange={handleMainInputs} className='border-b outline-none  ' />
                        </div>
                    </div>
                    <div className='flex flex-row w-full items-center justify-start gap-[60px]'>
                        <div className='flex flex-row items-center gap-6 text-[#666666] w-1/3 whitespace-nowrap'>
                            <IoMdPricetags className='text-xl' />
                            CGST (%)
                        </div>
                        <div className='flex flex-row gap-2 w-full'>
                            <input type='text' placeholder='CGST' name='CGST' value={product.CGST} onChange={handleMainInputs} className='border-b outline-none  ' />
                        </div>
                    </div>
                    <div className='flex flex-row w-full items-center justify-start gap-[60px]'>
                        <div className='flex flex-row items-center gap-6 text-[#666666] w-[250px] whitespace-nowrap'>
                            <IoMdPricetags className='text-xl' />
                            SGST (%)
                        </div>
                        <div className='flex flex-row gap-2 w-full'>
                            <input type='text' placeholder='SGST' name='SGST' value={product.SGST} onChange={handleMainInputs} className='border-b outline-none  ' />
                        </div>
                    </div>


                </div>
            </div>
            <div className='flex flex-col gap-2 mb-9 text-sm'>
                <div className='font-bold text-lg mb-4'> Custom attributes</div>
                <div className='flex flex-col gap-y-3'>
                    {
                        inventory.Attributes?.map((attr: any, i: number) => {
                            return (
                                <div key={i} className='flex flex-row w-full items-center justify-start gap-[60px]'>
                                    <div className='flex flex-row items-center gap-6 text-[#666666] w-1/3 whitespace-nowrap'>
                                        <IoMdArrowDroprightCircle className='text-xl' />
                                        {attr.slice(0, 1).toUpperCase() + attr.slice(1,)}
                                    </div>
                                    <div className='flex flex-row gap-2 w-full'>
                                        <input type='text' placeholder={attr} name={attr.Key} value={attr.Value} onChange={(e) => handleInputs(e, i)} className='border-b outline-none  ' />
                                    </div>
                                </div>
                            )
                        })
                    }


                </div>
                <div className=' flex cursor-pointer mt-3' onClick={addProduct}>
                    <span className='w-auto flex flex-row gap-2 items-center text-sm p-2 rounded border border-[#FF8A08] text-[#FF8A08]'>Add Product <FaPlus className='text-base' /></span>
                </div>
                <div className='flex flex-row gap-2 mt-4 w-full flex-wrap'>
                    {
                        products.map((a, i) => {
                            return (
                                <div className='bg-[#ffa136] hover:bg-[#FF8A08] duration-500 ease-in-out text-white p-2 text-sm rounded-sm flex flex-row gap-1 items-center font-semibold'>
                                    <span className='mr-1'>{a.Name}</span>
                                    <span className='font-normal text-xs'>(Qty:{a.Qty}</span>
                                    <span className='font-normal text-xs'>Amount:{a.Amount})</span>
                                    <MdCancel onClick={() => deleteAttribute(i)} className='text-base cursor-pointer ml-6' />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {/* <hr className='border w-full' /> */}
        </div>
    )
}

export default Create
export { CreateProduct }