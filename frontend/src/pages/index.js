import { useRef, useState } from "react";
import Default from "../components/default";
import http from "http";
import Router from "next/router";
import { useRouter } from "next/router";
import RangeInput from "./home/components/rangeInput";

const defaultGradient = " ¨'³•µðEÆ";

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
  const gradientInputRef = useRef(null);

  const [ascii, setAscii] = useState("");
  const [fileState, setFileState] = useState(null);

  const [saturation, setSaturation] = useState(0.5);
  const [contrast, setContrast] = useState(0.0);
  const [gradient, setGradient] = useState(defaultGradient);

  function updateAscii(file, sat, cont, grad) {
    asciiViewerRef.current.className = "hidden";
    uploadFormRef.current.className = "hidden";
    loaderRef.current.className = "visible";

    const data = new FormData();

    data.append("file", file);

    fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/asciify?saturation=${sat}&contrast=${cont}&gradient=${encodeURIComponent(grad)}`,
      {
        method: "POST",
        body: data,
        agent: new http.Agent({ keepAlive: true, timeout: 300000 }),
      }
    )
      .then((res) => {
        res
          .json()
          .then((data) => {
            setAscii(new DOMParser().parseFromString(data, "text/html").body.children[0].innerHTML);

            loaderRef.current.className = "hidden";
            asciiViewerRef.current.className = "visible";
          })
          .catch(handleASCIIfyerError);
      })
      .catch(handleASCIIfyerError);
  }

  function updateFile(e) {
    setFileState(e.target.files[0]);
    updateAscii(e.target.files[0], saturation, contrast);
  }

  return (
    <Default>
      <div className="flex flex-col justify-center items-center h-full py-10 overflow-x-hidden">
        {/* file upload */}
        <div ref={uploadFormRef}>
          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={updateFile}
          />
          <label
            htmlFor="fileInput"
            className="flex flex-col pt-5 pb-3 px-8 border-dashed border-2 rounded border-teal-200 border-opacity-70 space-y-2 hover:bg-teal-900 hover:bg-opacity-10 items-center"
          >
            <i className="fa-solid fa-arrow-up-from-bracket text-4xl text-white" />
            <span className="text-white">Select Image To ASCII-fy</span>
          </label>
        </div>

        {/* loader */}
        <div ref={loaderRef} className="hidden">
          <i className="text-white text-6xl fa-solid fa-spinner animate-spin" />
        </div>

        {/* ascii viewer */}
        <div ref={asciiViewerRef} className="hidden">
          <div className="flex flex-col space-y-5 items-center h-full scale-50 md:scale-75 lg:scale-90 pt-32">
            <div className="font-mono whitespace-pre text-center bg-black bg-opacity-20 border-2 border-black border-opacity-0 rounded-lg">
              <div dangerouslySetInnerHTML={{ __html: ascii }} />
            </div>

            <div className="flex flex-row space-x-4 justify-center">
              <button
                className="p-3 border-2 rounded border-teal-100 border-opacity-70 hover:bg-teal-900 hover:bg-opacity-10"
                onClick={() => router.reload(window.location.pathname)}
              >
                <span className="text-xl text-white">ASCII-fy Another</span>
              </button>

              <div className="flex flex-col space-y-1 justify-center">
                <RangeInput
                  name="Saturation"
                  defaultValue="0.5"
                  min="-1"
                  max="1"
                  changeHook={setSaturation}
                  endChangeHook={() => updateAscii(fileState, saturation, contrast, gradient)}
                />
                <RangeInput
                  name="Contrast"
                  defaultValue="0"
                  min="0"
                  max="0.95"
                  changeHook={setContrast}
                  endChangeHook={() => updateAscii(fileState, saturation, contrast, gradient)}
                />
              </div>
            </div>

            <div className="flex flex-row space-x-4 justify-center">
              <span className="text-white self-center">ASCII Gradient</span>
              <input
                className="font-mono rounded-md text-center"
                type="text"
                defaultValue={defaultGradient}
                onChange={(e) => setGradient(e.target.value)}
                ref={gradientInputRef}
                maxLength="100"
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    if (gradient.length < 1) {
                      setGradient(defaultGradient);
                      gradientInputRef.current.value = defaultGradient;
                    } else {
                      updateAscii(fileState, saturation, contrast, gradient);
                    }
                  }
                }}
              />
              <button
                className="p-1 border-2 rounded border-teal-100 border-opacity-70 hover:bg-teal-900 hover:bg-opacity-10"
                onClick={() => {
                  if (gradient.length < 1) {
                    setGradient(defaultGradient);
                    gradientInputRef.current.value = defaultGradient;
                  } else {
                    updateAscii(fileState, saturation, contrast, gradient);
                  }
                }}
              >
                <span className="text-white">UPDATE</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Default>
  );
}
