'use client';
import { useLocale, useTranslations, } from 'next-intl';
import { useRouter, usePathname } from 'next-intl/client'
import React, { useState } from 'react'

export default function NavBar() {
    const [lang, setLang] = useState(useLocale())
    const router = useRouter()
    const path = usePathname()

    const handleChange = (e) => {
        e.preventDefault()
        const locale = e.target.value
        setLang(locale)
        router.push(path, { locale })
    }
    return (
        <div className=' px-4 py-5 bg-purple-500 w-full m-auto justify-center align-middle content-center'>
            <div className=' flex flex-row  justify-end'>
                <select value={lang}
                    onChange={handleChange}
                    className='uppercase rounded-sm p-1 bg-slate-300 text-slate-700'>
                    <option value={"en"}>en</option>
                    <option value={'fr'}>fr</option>
                </select>
            </div>
        </div>
    )
}
