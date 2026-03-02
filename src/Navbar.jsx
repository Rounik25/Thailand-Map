export function Navbar({ dark, setDark }) {
    console.log(dark)
    return (
        <div className="h-16 px-4 flex items-center justify-between bg-slate-100 dark:bg-black border-slate-200 border-2 shadow-sm" >
            <div className="font-bold text-xl">
                Thailand Dashboard
            </div>
            <button onClick={() => setDark((p) => !p)}>{dark
                ? <img src="src\assets\sun.svg" alt="sun logo" />
                : <img src="src\assets\moon.svg " alt="moon logo" />
            }</button>
        </div>
    );
}