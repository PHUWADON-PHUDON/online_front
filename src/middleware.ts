import { NextResponse,NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req:NextRequest) {
    //const token = req.cookies.get('token')?.value;

    try{
        

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

export const config = { matcher: ["/gamea","/gamerooma"] }