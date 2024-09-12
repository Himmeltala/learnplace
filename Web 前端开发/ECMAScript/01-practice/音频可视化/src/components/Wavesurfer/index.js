import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import "./index.css";

function Wavesurfer() {
  const wavesurferRef = useRef();
  const cursorRef = useRef(); // 用于光标的 ref
  const [wavesurfer, setWavesurfer] = useState();
  const [audioData, setAudioData] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0); // 光标位置

  useEffect(() => {
    const instance = WaveSurfer.create({
      container: wavesurferRef.current,
      height: 200,
      waveColor: "#F66A14",
      progressColor: "#E0C5AA"
    });

    instance.on("ready", () => {
      setWavesurfer(instance);
      setDuration(instance.getDuration());
    });

    instance.on("audioprocess", () => {
      setCurrentTime(instance.getCurrentTime());
    });

    setWavesurfer(instance);

    return () => {
      instance?.destroy();
    };
  }, []);

  useEffect(() => {
    wavesurfer?.load(audioData);
  }, [audioData]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const waveContainer = wavesurferRef.current;
      const { left, width } = waveContainer.getBoundingClientRect();
      const mouseX = e.clientX - left;
      const hoverTime = (mouseX / width) * duration;
      setHoverTime(hoverTime);
      setCursorPosition(mouseX);
    };

    const waveContainer = wavesurferRef.current;
    waveContainer.addEventListener("mousemove", handleMouseMove);

    return () => {
      waveContainer.removeEventListener("mousemove", handleMouseMove);
    };
  }, [duration]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      setAudioData(event.target.result);
    };

    reader.readAsDataURL(file);
  };

  const handlePlayPause = () => {
    if (!wavesurfer.isPlaying()) {
      wavesurfer.play();
    } else {
      wavesurfer.pause();
    }

    setIsPlaying(wavesurfer.isPlaying());
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <div style={{ position: "relative" }}>
        <div ref={wavesurferRef} />
        {/* 使用 cursorPosition 动态设置光标的位置 */}
        <div
          className="cursor"
          style={{
            left: cursorPosition
          }}
          ref={cursorRef}
        ></div>
        <div className="hoverTime" style={{ left: cursorPosition }}>
          {hoverTime}
        </div>
      </div>
      <div>
        <span>{currentTime}</span>/<span>{duration}</span>
      </div>
      <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
    </div>
  );
}

export default Wavesurfer;
