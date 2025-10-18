import { NextResponse,NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req:NextRequest) {
    const token = req.cookies.get('token')?.value;

    try{
        if (!token) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        console.log(1)
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        console.log(2)
        const  {payload}:any = await jwtVerify(token,secret);
        console.log(3)

        console.log(payload);

        return NextResponse.next();

        // if (payload) {
        //     return NextResponse.next();
        // }
        // else {
        //     return NextResponse.redirect(new URL("/",req.url));
        // }
    }
    catch(err) {
        return NextResponse.redirect(new URL("/",req.url));
    }
}

export const config = { matcher: ["/game","/gameroom"] }