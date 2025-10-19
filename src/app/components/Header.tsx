"use client";
import { useState,useEffect } from "react";
import axios from "axios";
import Preload from "./Preload";

interface Typedatauser {
    id:number;
    name:string;
    email:string;
    score:number;
}

export default function Header() {
    const [dataplayer,setdataplayer] = useState<Typedatauser>() ;
    const [wait,setwait] = useState<boolean>(true);
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;

    //!get data player
    
    useEffect(() => {
        const getDataPlayer = async () => {
            try{
                setwait(true);
                const res = await axios.get(url + "/user/verifyuser",{withCredentials:true});
                if (res.status === 200) {
                    if (res.data.status) {
                        setdataplayer(res.data.data);
                        setwait(false);
                    }
                    else {
                        window.location.href = "/";
                    }
                }
            }
            catch(err) {
                console.log(err);
            }
        }

        getDataPlayer();
    },[]);

    //!

    return(
        <div>
            <div className="flex items-center justify-between">
                <p className="text-[25px] font-bold bg-linear-to-l/decreasing from-indigo-500 to-teal-400 bg-clip-text text-transparent">X O Online</p>
                <div className="h-[40px] flex justify-center items-center gap-[20px]">
                    <p className="font-bold bg-linear-to-r/decreasing from-indigo-500 to-teal-400 bg-clip-text text-transparent">{dataplayer?.name}</p>
                    {wait ? 
                        <Preload/>
                        :
                        <p className="font-bold text-[#6bf46b]">{dataplayer?.score}</p>
                    }
                </div>
            </div>
        </div>
    );
}