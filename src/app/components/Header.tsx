"use client";

export default function Header() {

    return(
        <div>
            <div className="flex items-center justify-between">
                <p className="text-[25px] font-bold bg-linear-to-l/decreasing from-indigo-500 to-teal-400 bg-clip-text text-transparent">X O Online</p>
                <div className="flex justify-center gap-[20px]">
                    <p className="font-bold bg-linear-to-r/decreasing from-indigo-500 to-teal-400 bg-clip-text text-transparent">Phuwadon Swanasrt</p>
                    <p className="font-bold text-[#6bf46b]">100</p>
                </div>
            </div>
        </div>
    );
}