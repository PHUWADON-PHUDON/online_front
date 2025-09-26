"use client";
import { useState,useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../components/Header";
const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);

interface Typedatauser {
    name:string;
    email:string;
    score:number;
}

export default function Game() {
    const [datauser,setdatauser] = useState<Typedatauser[]>([]);
    const [dataplayer,setdataplayer] = useState<Typedatauser>();
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;

    //!get data player
    
    useEffect(() => {
        const getDataPlayer = async () => {
            try{
                const res = await axios.get(url + "/user/verifyuser",{withCredentials:true});
                if (res.status === 200) {
                    setdataplayer(res.data);
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
                const res = await axios.get(url + "/user/getdatauser",{signal:abortcontroller.signal});
                if (res.status === 200) {
                    setdatauser(res.data)
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
        socket.emit("useronline", "");
        socket.on("useronline", (online) => {
          console.log(online);
        });

        return () => {
          socket.off("useronline");
        };
    },[]);

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
                    {datauser.map((e,i) => (
                        <div key={i} className="text-center grid grid-cols-[50px_1fr_1fr] mt-[10px] text-[#ffffff9e]">
                            <p>{i + 1}</p>
                            <p className="text-center">{e.name}</p>
                            <p className="text-center">{e.score}</p>
                        </div>
                    ))}
                </div>
                <div className="w-[40%]">
                    <div className="bg-[#1b1b1b] rounded-[4px] h-[80px] text-center flex justify-center items-center text-[25px] font-bold">Online 100</div>
                    <div className="bg-[#0bd049bb] mt-[10px] rounded-[4px] text-center text-[20px] p-[25px_0] font-bold">PLAY</div>
                </div>
            </div>
        </div>
    );
}