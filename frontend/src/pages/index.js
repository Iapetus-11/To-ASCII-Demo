import { useRef, useState } from "react";
import Default from '../components/default';
import http from "http";
import Router from "next/router";
import { useRouter } from "next/router";

function handleASCIIfyerError(e) {
  console.error(e);
  alert("An error ocurred while ASCII-fying that image...");
  Router.reload(window.location.pathname);
}

export default function Home() {
  const router = useRouter();
  const uploadFormRef = useRef(null);
  const asciiViewerRef = useRef(null);
  const loaderRef = useRef(null);
  const [ascii, setAscii] = useState("");
  const [saturation, setSaturation] = useState(0.5);
  const [contrast, setContrast] = useState(0.0);
  const [fileState, setFileState] = useState(null);

  function updateAscii(file, sat, cont) {
    asciiViewerRef.current.className = "hidden";
    uploadFormRef.current.className = "hidden";
    loaderRef.current.className = "visible";
    
    const data = new FormData();

    data.append("file", file);

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/asciify?saturation=${sat}&contrast=${cont}`, { method: "POST", body: data, agent: new http.Agent({ keepAlive: true, timeout: 300000 }) })
    .then(res => {
      res.json()
      .then(data => {
        setAscii(new DOMParser().parseFromString(data, "text/html").body.children[0].innerHTML);

        loaderRef.current.className = "hidden";
        asciiViewerRef.current.className = "visible";
      })
      .catch(handleASCIIfyerError);
    })
    .catch(handleASCIIfyerError);
  }

  function onFileChange(e) {
    setFileState(e.target.files[0]);
    updateAscii(e.target.files[0], saturation, contrast);
  }

  return (
    <Default>
        <div className="flex justify-center items-center h-full">
          {/* file upload */}
          <div ref={uploadFormRef}>
            <input id="fileInput" type="file" className="hidden" accept="image/*" onChange={onFileChange} />
            <label htmlFor="fileInput" className="flex flex-col pt-5 pb-3 px-8 border-dashed border-2 rounded border-teal-200 border-opacity-70 space-y-2 hover:bg-teal-900 hover:bg-opacity-10 items-center">
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
            <div className="flex flex-col space-y-5 items-center h-full portrait:text-[]">
              <div className="font-mono whitespace-pre text-center bg-black bg-opacity-20 border-2 border-black border-opacity-0 rounded-lg portrait:text-1.95vw landscape:text-1.75vh">
                <div dangerouslySetInnerHTML={{__html: ascii}} />
              </div>
              
              <div className="flex flex-row space-x-4 justify-center">
                <button className="p-3 border-2 rounded border-teal-100 border-opacity-70 hover:bg-teal-900 hover:bg-opacity-10" onClick={() => router.reload(window.location.pathname)}><span className="text-xl text-white">ASCII-fy Another</span></button>
                
                <div className="flex flex-col space-y-1 justify-center">
                  <div className="flex flex-row space-x-2 justify-between">
                    <span className="text-white pb-1">Saturation</span>
                    <input type="range" onChange={(e) => setSaturation(e.target.value)} onMouseUp={(e) => updateAscii(fileState, saturation, contrast)} onTouchEnd={(e) => updateAscii(fileState, saturation, contrast)} min="-1" max="1" step="0.05" />
                  </div>
                  <div className="flex flex-row space-x-2 justify-between">
                    <span className="text-white pb-1">Contrast</span>
                    <input type="range" onChange={(e) => setContrast(e.target.value)} onMouseUp={(e) => updateAscii(fileState, saturation, contrast)} onTouchEnd={(e) => updateAscii(fileState, saturation, contrast)} min="0" max="0.95" step="0.05" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </Default>
  )
}
