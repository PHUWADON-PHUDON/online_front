import { NextResponse,NextRequest } from "next/server";
import axios from "axios";

export async function middleware(req:NextRequest) {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const token = req.cookies.get('token')?.value;

    try{
        //const res = await axios.get(url + "/user/verifyuser",{withCredentials:true,headers: {Authorization:token}});
        const res = await fetch(url + "/user/verifyuser", {
            headers: { "Authorization": `Bearer ${token}` },
            credentials: "include" // browser จะส่ง cookie ไป
        });

        if (!res.ok) return NextResponse.redirect(new URL("/",req.url));

        const resdata = await res.json();
        if (resdata) {
            return NextResponse.next();
        }
    }
    catch(err) {
        return NextResponse.redirect(new URL("/",req.url));
    }
}

export const config = { matcher: ["/game","/gameroom"] }