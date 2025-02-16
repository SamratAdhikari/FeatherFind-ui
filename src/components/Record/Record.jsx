import { useRef, useState, useEffect, useContext } from "react";
import { CirclePause, Mic, Send } from "lucide-react";
import server, { SERVER_IP } from "../../lib/axios/axios.instance";
import { MapContext } from "../../pages/Map";

const AudioRecorderSpectrogram = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);
    const { setBirdclass } = useContext(MapContext);

    const canvasRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const streamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const animationRef = useRef(null);
    const chunksRef = useRef([]);

    // Function to encode audio data as WAV
    const encodeWAV = (samples, sampleRate) => {
        const buffer = new ArrayBuffer(44 + samples.length * 2);
        const view = new DataView(buffer);

        // Write WAV header
        writeString(view, 0, "RIFF");
        view.setUint32(4, 36 + samples.length * 2, true);
        writeString(view, 8, "WAVE");
        writeString(view, 12, "fmt ");
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, "data");
        view.setUint32(40, samples.length * 2, true);

        floatTo16BitPCM(view, 44, samples);

        return new Blob([view], { type: "audio/wav" });
    };

    const writeString = (view, offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    const floatTo16BitPCM = (view, offset, input) => {
        for (let i = 0; i < input.length; i++, offset += 2) {
            const s = Math.max(-1, Math.min(1, input[i]));
            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }
    };

    const startRecording = async () => {
        try {
            setAudioBlob(null);
            setAudioUrl(null);
            setPredictionResult(null);
            chunksRef.current = [];

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            streamRef.current = stream;

            audioContextRef.current = new (window.AudioContext ||
                window.webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 2048;

            const source =
                audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);

            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: "audio/webm;codecs=opus",
                audioBitsPerSecond: 128000,
            });

            mediaRecorderRef.current.ondataavailable = (e) => {
                chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const blob = new Blob(chunksRef.current, {
                    type: "audio/webm",
                });

                const audioContext = new (window.AudioContext ||
                    window.webkitAudioContext)();
                const arrayBuffer = await blob.arrayBuffer();
                const audioBuffer = await audioContext.decodeAudioData(
                    arrayBuffer
                );

                const samples = audioBuffer.getChannelData(0);
                const wavBlob = encodeWAV(samples, audioBuffer.sampleRate);

                setAudioBlob(wavBlob);
                setAudioUrl(URL.createObjectURL(wavBlob));
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            drawScrollingSpectrogram();
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== "inactive"
        ) {
            mediaRecorderRef.current.stop();
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        setIsRecording(false);
    };

    const drawScrollingSpectrogram = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            const imageData = ctx.getImageData(
                1,
                0,
                canvas.width - 1,
                canvas.height
            );
            ctx.putImageData(imageData, 0, 0);

            for (let i = 0; i < bufferLength; i++) {
                const value = dataArray[i];
                const intensity = value / 255;
                const h = 240 * (1 - intensity);
                const s = 100;
                const l = intensity * 50;

                ctx.fillStyle = `hsl(${h}, ${s}%, ${l}%)`;
                const y = canvas.height - (i / bufferLength) * canvas.height;
                ctx.fillRect(
                    canvas.width - 1,
                    y,
                    1,
                    canvas.height / bufferLength
                );
            }
        };

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        draw();
    };

    const submitToApi = async () => {
        if (!audioBlob) return;

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("audio", audioBlob, "recording.wav");

            const response = await server.post("/birds/predict/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("response is", response);

            // Store the response data
            const predictionData = response.data;
            setPredictionResult(predictionData);
            setBirdclass(predictionData);

            // eslint-disable-next-line no-undef
            console.log(predictionData["wiki-url"]);

            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const locationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        timestamp: new Date().toISOString(),
                    };

                    try {
                        await server.post(
                            `/locations/bird/${predictionData.bird_id}/`,
                            locationData
                        );
                    } catch (error) {
                        console.error("Error sending location data:", error);
                    }

                    // Only call onBirdDetected if it exists
                    // if (onBirdDetected) {
                    //     onBirdDetected({
                    //         ...predictionData,  // Use predictionData instead of data
                    //         ...locationData
                    //     });
                    // }
                });
            }
        } catch (error) {
            console.error("Error submitting to API:", error);
            alert("Error submitting audio: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
            stopRecording();
        };
    }, []);

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-gray-100 rounded-lg">
            <div className="relative">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={400}
                    className="bg-black rounded-lg shadow-lg"
                />
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-white text-sm p-2">
                    <span>20kHz</span>
                    <span>10kHz</span>
                    <span>5kHz</span>
                    <span>2kHz</span>
                    <span>1kHz</span>
                    <span>500Hz</span>
                    <span>200Hz</span>
                    <span>50Hz</span>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-colors ${
                        isRecording
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                    {isRecording ? (
                        <>
                            <CirclePause className="w-4 h-4" /> Stop Recording
                        </>
                    ) : (
                        <>
                            <Mic className="w-4 h-4" /> Start Recording
                        </>
                    )}
                </button>

                {audioUrl && (
                    <>
                        <audio src={audioUrl} controls className="h-12" />

                        <button
                            onClick={submitToApi}
                            disabled={isSubmitting}
                            className="flex z-10 items-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-green-500 hover:bg-green-600 disabled:bg-green-300 transition-colors"
                        >
                            <>
                                <Send className="w-4 h-4" />
                                {isSubmitting ? "Analyzing..." : "Analyze"}
                            </>
                        </button>
                    </>
                )}
            </div>
            {predictionResult && (
                <div className="mt-6 p-6 bg-white rounded-lg shadow-md w-full max-w-2xl">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-4 w-full">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {predictionResult.predicted_class}
                            </h2>
                            <p className="text-gray-600">
                                Confidence:{" "}
                                {predictionResult.confidence.toFixed(2)}%
                            </p>
                            <a
                                href={`${predictionResult["wiki-url"]}`}
                                target="_blank"
                                className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium"
                            >
                                Learn more about this bird →
                            </a>
                        </div>
                        {predictionResult.image && (
                            <img
                                src={`${SERVER_IP}/${predictionResult.image}`}
                                alt={predictionResult.predicted_class}
                                className="rounded-lg shadow-md w-32 h-32 object-cover ml-6"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AudioRecorderSpectrogram;
