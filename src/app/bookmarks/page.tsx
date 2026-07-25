import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import { BookmarksClient } from "@/components/bookmarks/BookmarksClient";
export const metadata: Metadata={title:"Bookmarks — Qira", description:"Ayat yang Anda simpan untuk dibaca kembali di Qira.", alternates:{canonical:"/bookmarks"}, robots:{index:false,follow:true}, openGraph:{title:"Bookmarks — Qira", description:"Ayat yang Anda simpan untuk dibaca kembali di Qira.", url:absoluteUrl("/bookmarks"), type:"website"}};
export default function BookmarksPage(){return <BookmarksClient/>}
