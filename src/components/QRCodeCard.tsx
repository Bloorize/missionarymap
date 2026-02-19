"use client"

import React from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

interface QRCodeCardProps {
    url: string
    slug: string
}

export function QRCodeCard({ url, slug }: QRCodeCardProps) {
    const [copied, setCopied] = React.useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="bg-white p-4 rounded-lg border-2 border-slate-200">
                <QRCodeSVG value={url} size={200} level="H" />
            </div>

            <div className="text-center space-y-2">
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Join Code</p>
                <p className="text-3xl font-bold tracking-widest font-mono text-slate-900">{slug}</p>
            </div>

            <div className="flex w-full items-center space-x-2">
                <div className="flex-1 bg-slate-50 p-2 rounded text-xs font-mono truncate text-slate-600">
                    {url}
                </div>
                <Button size="icon" variant="outline" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
            {copied && <p className="text-xs text-green-600 font-medium animate-in fade-in">Copied to clipboard!</p>}
        </div>
    )
}
