import { NextResponse,NextRequest } from "next/server";
import axios from "axios";

export async function middleware(req:NextRequest) {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const token = req.cookies.get('token')?.value;

    try{
        const res = await axios.get(url + "/user/verifyuser",{withCredentials:true,headers: {
          Authorization:token
        }});
        if (res.status === 200) {
            return NextResponse.next();
        }
    }
    catch(err) {
        return NextResponse.redirect(new URL("/",req.url));
    }
}

export const config = { matcher: ['/game'] }