'use client'
import { BaseURL } from "@/constants/baseUrl";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";
import toast, { Toaster } from 'react-hot-toast';

const page = () => {
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const passref = useRef(null)
    const [eyeClose, setEye] = useState(true)


    const cookies = useCookies();
    const cookie = cookies.get('token')
    const router = useRouter()
    const handleBorder = () => {
        if (passref.current) passref.current.parentNode.style.borderColor = '#999999'
    }
    const blurBorder = () => {
        if (passref.current) passref.current.parentNode.style.borderColor = ''
    }
    const loginHandle = async () => {
        const payload = {
            Email: email,
            Pass: pass
        }
        let res = await fetch(`${BaseURL}/login`, {
            mode: 'cors',
            method: "POST",
            headers: {
                "content-type": "application/json",
                    "Authorization": `${cookie}`
            },
            body: JSON.stringify(payload)
        })
        res = await res.json()
        console.log(res)
        if (res.error) {
            return toast.error(res.error)
        }
        if (res) {
            cookies.set('token', res.token)
            router.push("/")
            return toast.success(res.msg)

        }

    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#FFC10040] ">
            <Toaster />
            <div className='p-[60px] font-barlow bg-gradient-to-b from-[#F7F7F7] to-[#F0F0F0] rounded-2xl shadow-2xl'>
                <div className='text-[30px] pb-[32px]  font-bold'>
                    Welcome to <span className='text-[#FF8A08] '>Inventorify</span>!
                </div>
                <div className='w-full flex flex-col pb-8'>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type='text' placeholder='Your email' className='px-3 py-4 rounded-lg mb-6 text-[#999999] bg-[#EBEBEB] outline-[#999999]' />
                    <div className="flex flex-row items-center justify-center border-2 text-[#999999] bg-[#EBEBEB] w-full px-3 py-4 rounded-lg mb-5 ">
                        <input value={pass} onChange={(e) => setPass(e.target.value)} ref={passref} onBlur={blurBorder} onFocus={handleBorder} type={eyeClose ? 'password' : 'text'} placeholder='Password' className='bg-[#EBEBEB] outline-none w-full' />
                        <div className="px-2 font-semibold" onClick={() => setEye(!eyeClose)}>{eyeClose ? <GoEyeClosed /> : <GoEye />}</div>
                    </div>
                    <button onClick={loginHandle} className='rounded-lg bg-gradient-to-b from-[#FF8A08] to-[#FFC100] text-white py-[14px] text-center'>Login</button>
                </div>
                <div className="text-basic w-full text-center">
                    Don’t have an account? Create a
                    <Link href={"/signup"} className="text-[#FF8A08] pl-1">new account</Link>.
                </div>
            </div>
        </main>
    )
}

export default page