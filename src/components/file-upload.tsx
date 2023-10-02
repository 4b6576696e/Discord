"use client";

import { UploadDropzone } from '@/lib/uploadthing';
import { deleteImage } from '@/serveractions/delete-image';

import "@uploadthing/react/styles.css";


import { FileIcon, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { AlertDestructive } from './alert';
import { cn } from '@/lib/utils';

interface FileUploadProps {
    endpoint: "serverImage" | "attachmentFile",
    value: string,
    onChange: (url?: string) => void;
    image?: "box";
}

function FileUpload({
    endpoint, value, onChange, image
}: FileUploadProps) {

    const [key, setKey] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    console.log(key);

    const type = value?.split(".").pop();

    if (type !== "pdf" && value) {
        return <div className={cn('relative bg-gray-100 ',
            image === "box" ? "w-[250px] h-[250px] rounded-lg" : "w-20 h-20 rounded-full"
        )} >
            <Image
                placeholder='blur'
                blurDataURL={value}
                fill
                src={value}
                alt='server-image'
                className={cn('object-cover', image === "box" ? "aspect-[1/2] rounded-lg" : 'rounded-full')}
            />
            <button
                className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                type="button"
                onClick={() => {
                    onChange("");
                    deleteImage(key);
                }}
            >
                <X className="h-4 w-4" />
            </button>

        </div>;
    }

    if (value && type === "pdf") {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline text-ellipsis"
                >
                    {value}
                </a>
                <button
                    onClick={() => onChange("")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }


    return (
        <>
            <UploadDropzone
                className='border-0  outline-none'
                endpoint={endpoint}
                onClientUploadComplete={(res) => {
                    setErrorMessage("");
                    if (!res) return;

                    console.log(res);

                    setKey(res[0].key);
                    onChange(res[0].url);
                }}
                onUploadError={(error: Error) => {
                    setErrorMessage(error.message);
                }}
                onUploadProgress={() => {
                    setErrorMessage("");
                }}
            />
            {errorMessage && <AlertDestructive message={errorMessage} />}
        </>
    );
}

export default React.memo(FileUpload);