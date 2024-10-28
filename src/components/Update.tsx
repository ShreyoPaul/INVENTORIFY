'use client'

import cross from '../../public/pic/cross.png'
import share from '../../public/pic/share.png'
import open from '../../public/pic/open.png'
import star from '../../public/pic/star.png'
import stts from '../../public/pic/status.png'
import pen from '../../public/pic/pen.png'
import cal from '../../public/pic/cal.png'
import priority from '../../public/pic/prio.png'
import Image from 'next/image'
import { GoPlus } from 'react-icons/go'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { useCookies } from 'next-client-cookies'
import { BaseURL } from '@/constants/baseUrl'
import { FaPlus } from 'react-icons/fa'
import toast, { Toaster } from 'react-hot-toast'
import { MdCancel } from 'react-icons/md'
import { AiFillProduct } from 'react-icons/ai'
import { IoMdArrowDroprightCircle, IoMdPricetags } from 'react-icons/io'

interface Product {
    ID: string
    Name: string
    Qty: number
    Amount: number
    Attributes: string[]
    CGST: any
    SGST: any
}

const UpdateProduct = ({ setCreateToggle, FetchAllProduct, prdt, setPrdt }: { setCreateToggle: any, FetchAllProduct: any, prdt: Product, setPrdt: any }) => {
    const [product, setProduct] = useState<Product>({
        Name: "", Attributes: [], Amount: 0, Qty: 0, CGST: 0, SGST: 0, ID: ""
    })

    const cookies = useCookies();
    const cookie = cookies.get('token')
    const today = new Date().toISOString().split('T')[0];
    // const [inputs, setInputs] = useState<any>(inventory.Attributes.map((x: string, i: number) => { return "" }))
    // console.log(product, inventory)

    // const [products, setProducts] = useState<Product[]>([])

    // const addProduct = () => {
    //     if (product.Name === "" || !product.Qty || !product.Amount) return toast.error("Fill product name, attributes correctly!")
    //     else if (!parseFloat(product.SGST) || !parseFloat(product.CGST)) return toast.error("CGST and SGST should be float!")
    //     product.CGST = parseFloat(product.CGST)
    //     product.SGST = parseFloat(product.SGST)
    //     setProducts(prev => [...prev, product])
    //     // setInputs(inventory.Attributes.map((x: string, i: number) => { return "" }))
    //     setProduct({
    //         Name: "", Attributes: [], Amount: 0, Qty: 0, CGST: 0, SGST: 0
    //     })
    // }

    const updateProduct = async () => {
        const body = [
            {
                ID: prdt.ID,
                Amount: product.Amount || prdt.Amount,
                Qty: product.Qty || prdt.Qty,
                CGST: parseFloat(product.CGST) || prdt.CGST,
                SGST: parseFloat(product.SGST) || prdt.SGST
            }
        ]
        if (!prdt.ID) return toast.error("Something went wrong!")
        let res = await fetch(`${BaseURL}/`, {
            mode: 'cors',
            method: 'PATCH',
            headers: {
                "content-type": "application/json",
                "Authorization": `${cookie}`
            },
            credentials: 'include',
            body: JSON.stringify(body)
        })
        res = await res.json()
        console.log(res)
        if (res) {
            FetchAllProduct()
        }
        setPrdt({
            Name: "", Attributes: [], Amount: 0, Qty: 0, CGST: 0, SGST: 0, ID: ""
        })
        setProduct({
            Name: "", Attributes: [], Amount: 0, Qty: 0, CGST: 0, SGST: 0, ID: ""
        })
        setCreateToggle(false)
        console.log("prdtID:", prdt.ID)
    }

    const handleMainInputs = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value } = e.target
        if (name === "Name") return setProduct(prev => ({ ...prev, [name]: value }))
        else if (name === "CGST" || name === "SGST") return setProduct(prev => ({ ...prev, [name]: value }))
        else return setProduct(prev => ({ ...prev, [name]: parseInt(value) }))
    }
    // console.log(product)
    return (
        <div className='px-6 py-4 bg-white w-full md:w-[670px] font-barlow h-screen overflow-auto'>
            {/* <Toaster /> */}
            <div className='flex flex-row w-full justify-between mb-4'>
                <div className='flex flex-row gap-4 items-center justify-center text-sm font-semibold'>
                    <Image src={cross} alt='cross' width={24} height={24} className='cursor-pointer' onClick={() => {
                        setCreateToggle(false)
                    }} />
                    {today}

                </div>
                <div className='flex flex-row gap-4 text-sm text-[#797979]'>
                    <button onClick={updateProduct} className='flex flex-row gap-1 justify-center items-center rounded p-2 bg-[#FF8A08] text-white'>
                        Update
                        <GoPlus className='text-2xl' />
                    </button>

                </div>
            </div>


            <div className='mb-[38px]'>
                <div className='text-3xl font-bold mb-4'>{prdt.Name}</div>
                <div className='flex flex-col text-sm gap-y-4 w-full'>
                    <div className='flex flex-row w-full items-center justify-start gap-[60px]'>
                        <div className='flex flex-row items-center gap-6 text-[#666666] w-[200px] whitespace-nowrap'>
                            <AiFillProduct className='text-xl' />
                            Quanitiy
                        </div>
                        <div className='flex flex-row gap-8 w-full'>
                            <input type='number' placeholder='Quanity' name='Qty' value={product.Qty} onChange={handleMainInputs} className='border-b outline-none w-[80px] ' />
                            <div>Previous: <span className='text-xs'>{prdt.Qty}</span></div>
                        </div>
                    </div>
                    <div className='flex flex-row w-full items-center justify-start gap-[60px]'>
                        <div className='flex flex-row items-center gap-6 text-[#666666] w-[200px] whitespace-nowrap'>
                            <IoMdPricetags className='text-xl' />
                            Amount
                        </div>
                        <div className='flex flex-row gap-8 w-full'>
                            <input type='number' placeholder='Amount' name='Amount' value={product.Amount} onChange={handleMainInputs} className='border-b outline-none w-[80px] ' />
                            <div>Previous: <span className='text-xs'>{prdt.Amount}</span></div>
                        </div>
                    </div>
                    <div className='flex flex-row w-full items-center justify-start gap-[60px]'>
                        <div className='flex flex-row items-center gap-6 text-[#666666] w-[200px] whitespace-nowrap'>
                            <IoMdPricetags className='text-xl' />
                            CGST (%)
                        </div>
                        <div className='flex flex-row gap-8 w-full'>
                            <input type='text' placeholder='CGST' name='CGST' value={product.CGST} onChange={handleMainInputs} className='border-b outline-none w-[80px] ' />
                            <div>Previous: <span className='text-xs'>{prdt.CGST}</span></div>
                        </div>
                    </div>
                    <div className='flex flex-row w-full items-center justify-start gap-[60px]'>
                        <div className='flex flex-row items-center gap-6 text-[#666666] w-[200px] whitespace-nowrap'>
                            <IoMdPricetags className='text-xl' />
                            SGST (%)
                        </div>
                        <div className='flex flex-row gap-8 w-full'>
                            <input type='text' placeholder='SGST' name='SGST' value={product.SGST} onChange={handleMainInputs} className='border-b outline-none w-[80px] ' />
                            <div>Previous: <span className='text-xs'>{prdt.SGST}</span></div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default UpdateProduct 