import React from 'react'

export default function Button({ text, action, className }) {
    return (
        <button
            className={`rounded-md p-3 transform hover:-translate-y-0.5   uppercase w-32  ${className}`}
            onClick={action} >
            {text}
        </button >
    )
}
