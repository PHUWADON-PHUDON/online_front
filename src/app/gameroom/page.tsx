"use client";
import { useState,useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Preload from "../components/Preload";
const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);

interface Typedatauser {
    id:number;
    name:string;
    email:string;
    score:number;
}

export default function Gameroom() {
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
                    setdataplayer(res.data);
                    setwait(false);
                }
            }
            catch(err) {
                console.log(err);
            }
        }

        getDataPlayer();
    },[]);

    //!

    //!socket api client

    useEffect(() => {
        if (dataplayer) {
            socket.emit("useronline", dataplayer.id);

            socket.emit("findmatch", dataplayer.id);
            socket.on("findmatch", (foundmatch) => {
              console.log(foundmatch);
            });
        }

        return () => {
          socket.off("useronline");
          socket.off("findmatch");
        };
    },[dataplayer]);

    //!

    return(
        <div className="h-full flex justify-center items-center">
            <div>
                <p className="text-[30px] font-bold">FIND MATCH</p>
                <Preload/>
            </div>
        </div>
    );
}