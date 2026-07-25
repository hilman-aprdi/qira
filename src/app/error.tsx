"use client";
import { ErrorState } from "@/components/shared/ErrorState";
export default function Error({reset}:{error:Error&{digest?:string};reset:()=>void}){return <div className="container py-12"><ErrorState message="Layanan Quran sedang tidak tersedia." retry={reset}/></div>}
