import { useRef, useState } from "react";
import Default from '../components/default';
import http from "http";
import Router from "next/router";
import { useRouter } from "next/router";

const converterOptions = {
  gradient: " ¨'³•µðEÆ",
  height: 32,
  x_stretch: 2,
};

export default function Home() {
  const router = useRouter();
  const uploadFormRef = useRef(null);
  const asciiViewerRef = useRef(null);
  const loaderRef = useRef(null);
  const [ascii, setAscii] = useState("");

  function onChange(e) {
    let file = e.target.files[0];

    if (!file) return;

    uploadFormRef.current.className = "hidden";
    loaderRef.current.className = "visible";

    const data = new FormData();

    data.append("file", file);
    data.append("options", JSON.stringify(converterOptions));

    function handleASCIIfyerError(e) {
      console.error(e);
      alert("An error ocurred while ASCII-fying that image...");
      Router.reload(window.location.pathname);
    }

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/asciify`, { method: "POST", body: data, agent: new http.Agent({ keepAlive: true, timeout: 300000 }) })
    .then(res => {
      res.json()
      .then(data => {
        setAscii(data);
        loaderRef.current.className = "hidden";
        asciiViewerRef.current.className = "visible";
      })
      .catch(handleASCIIfyerError);
    })
    .catch(handleASCIIfyerError);
  }

  return (
    <Default>
        <div className="flex justify-center items-center h-full">
          {/* file upload */}
          <div ref={uploadFormRef}>
            <input id="fileInput" type="file" className="hidden" accept="image/*" onChange={onChange} />
            <label htmlFor="fileInput" className="flex flex-col py-5 px-8 border-dashed border-2 rounded border-teal-200 border-opacity-70 space-y-2 hover:bg-teal-900 hover:bg-opacity-10 items-center">
              <i className="fa-solid fa-arrow-up-from-bracket text-4xl text-white" />
              <span className="text-white">Select Image To ASCII-fy</span>
            </label>
          </div>

          {/* loader */}
          <div ref={loaderRef} className="hidden">
            <i className="text-white text-6xl fa-solid fa-spinner animate-spin"></i>
          </div>

          {/* ascii viewer */}
          <div ref={asciiViewerRef} className="hidden">
            <div className="flex flex-col space-y-5 items-center h-full text-mono">
              <div dangerouslySetInnerHTML={{__html: ascii}} />
              
              <button className="p-3 border-2 rounded border-teal-100 border-opacity-70 hover:bg-teal-900 hover:bg-opacity-10" onClick={() => router.reload(window.location.pathname)}><span className="text-xl text-white">ASCII-fy Another</span></button>
            </div>
          </div>
        </div>
    </Default>
  )
}
