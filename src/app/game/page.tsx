"use client";
import { useState,useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Header from "../components/Header";
import Preload from "../components/Preload";
const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL,{withCredentials: true});

interface Typedatauser {
    id:number;
    name:string;
    email:string;
    score:number;
}

export default function Game() {
    const [dataplayer,setdataplayer] = useState<Typedatauser>() ;
    const [datauser,setdatauser] = useState<Typedatauser[]>([]);
    const [onlineuser,setonlineuser] = useState<number>(0);
    const [wait,setwait] = useState<boolean>(true);
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;

    //!get data player
    
    useEffect(() => {
        const getDataPlayer = async () => {
            try{
                setwait(true);
                const res = await axios.get(url + "/user/verifyuser",{withCredentials:true});
                if (res.status === 200) {
                    console.log(res.data);
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

    //!get user 50 rows

    useEffect(() => {
        const abortcontroller:AbortController = new AbortController();

        const getDataUser = async () => {
            try{
                setwait(true);
                const res = await axios.get(url + "/user/getdatauser",{signal:abortcontroller.signal});
                if (res.status === 200) {
                    setdatauser(res.data);
                    setwait(false);
                }
            }
            catch(err) {}
        }

        getDataUser();

        return () => abortcontroller.abort();
    },[]);

    //!

    //!socket api client
        
    useEffect(() => {
        if (dataplayer) {
            socket.emit("useronline", dataplayer.id);
            socket.on("useronline", (online) => {
              setonlineuser(online.users.length);
            });

            socket.on("findmatch", (findmatch) => {
              ///
            });
        }

        return () => {
          socket.off("useronline");
          socket.off("findmatch");
        };
    },[dataplayer]);

    const play = () => {
        window.location.href = "/gameroom";
    }
    
    //!

    return(
        <div className="p-[20px]">
            <div>
                <Header/>
            </div>
            <div className="m-[50px_auto] h-[500px] max-w-[800px] flex gap-[10px]">
                <div className="bg-[#1b1b1b] w-[60%] rounded-[4px] p-[10px]">
                    <div className="text-center grid grid-cols-[50px_1fr_1fr] border-b border-[#ffffff68]">
                        <p>TOP</p>
                        <p>NAME</p>
                        <p>SCORE</p>
                    </div>
                    {wait ? 
                        <Preload/>
                        :
                        (datauser.map((e,i) => (
                            <div key={i} className="text-center grid grid-cols-[50px_1fr_1fr] mt-[10px] text-[#ffffff9e]">
                                <p>{i + 1}</p>
                                <p className="text-center">{e.name}</p>
                                <p className="text-center">{e.score}</p>
                            </div>
                        )))
                    }
                </div>
                <div className="w-[40%]">
                    <div className="bg-[#1b1b1b] rounded-[4px] h-[80px] text-center flex justify-center items-center text-[25px] font-bold">Online {onlineuser}</div>
                    <div onClick={() => play()} className="bg-[#0bd049bb] mt-[10px] rounded-[4px] text-center text-[20px] p-[25px_0] font-bold cursor-pointer">PLAY</div>
                </div>
            </div>
        </div>
    );
}