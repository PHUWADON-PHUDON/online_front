import { NextResponse,NextRequest } from "next/server";
import axios from "axios";

export async function middleware(req:NextRequest) {
     const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    // const token = req.cookies.get('token')?.value;

    // try{
    //     const res = await axios.get(url + "/user/verifyuser",{withCredentials:true,headers: {
    //       Authorization:token
    //     }});
    //     if (res.status === 200) {
    //         return NextResponse.next();
    //     }
    // }
    // catch(err) {
    //     return NextResponse.redirect(new URL("/",req.url));
    // }

    try{
        console.log("mid ",url);
        const res = await fetch(`${url}/user/verifyuser`, {
            method: "GET",
            headers: {
              Cookie: req.headers.get("cookie") || "",
            },
            credentials: "include",
        });
        const resdata = await res.json();

        console.log("this is middleware ",resdata);

        if (res.ok) {
            return NextResponse.next();
        }
        else {
            return NextResponse.redirect(new URL("/",req.url));
        }
    }
    catch(err) {
        return NextResponse.redirect(new URL("/",req.url));
    }
}

export const config = { matcher: ["/game","/gameroom"] }