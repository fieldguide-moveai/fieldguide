import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { submitVoiceReport } from "../services/voiceReportService";
import { MobileHeader } from "../components/MobileHeader";
import { Mic, Square, Loader2 } from "lucide-react";

export const VoiceReport: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo, currentOrder, addPoints } = useApp();

  const [recordingStarted, setRecordingStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);

  // MediaRecorder 생성
  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      console.warn("이 브라우저에서는 음성 녹음을 지원하지 않습니다.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        audioStreamRef.current = stream;

        const recorder = new MediaRecorder(stream);

        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];

        // 녹음 데이터 저장
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        // 최종 녹음 종료 시 Blob 생성
        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });

          setRecordedBlob(blob);
        };
      })
      .catch((err) => {
        console.warn("마이크 권한이 거부되었습니다:", err);
      });

    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }

      audioStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // 녹음 시간
  useEffect(() => {
    if (!isRecording) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev >= 120) {
          const recorder = mediaRecorderRef.current;

          if (recorder && recorder.state === "recording") {
            recorder.stop();
          }

          setIsRecording(false);
          return 120;
        }

        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRecording]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // 녹음 시작 / 일시정지 / 재개
  const handleToggleRecord = () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder) return;

    // 처음 녹음 시작
    if (!recordingStarted) {
      audioChunksRef.current = [];
      setRecordedBlob(null);

      recorder.start();

      setRecordingStarted(true);
      setIsRecording(true);

      return;
    }

    // 녹음 중 → 일시정지
    if (recorder.state === "recording") {
      recorder.pause();
      setIsRecording(false);

      return;
    }

    // 일시정지 → 다시 녹음
    if (recorder.state === "paused") {
      recorder.resume();
      setIsRecording(true);
    }
  };

  // 제보 완료
  const handleSubmit = async () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder) {
      alert("녹음 장치를 찾을 수 없습니다.");
      return;
    }

    // 아직 녹음 중이라면 제출할 수 없도록 함
    if (recorder.state === "recording") {
      alert("먼저 녹음을 일시정지해주세요.");
      return;
    }

    // 녹음이 시작되지 않았다면 제출할 수 없음
    if (!recordingStarted) {
      alert("먼저 녹음을 시작해주세요.");
      return;
    }

    setSubmitting(true);

    try {
      // 일시정지 상태라면 최종적으로 stop
      if (recorder.state === "paused") {
        recorder.stop();
      }

      // onstop에서 Blob이 만들어질 때까지 기다림
      let blob = recordedBlob;

      if (!blob) {
        blob = await new Promise<Blob>((resolve) => {
          recorder.onstop = () => {
            const finalBlob = new Blob(audioChunksRef.current, {
              type: "audio/webm",
            });

            setRecordedBlob(finalBlob);
            resolve(finalBlob);
          };

          if (recorder.state === "paused") {
            recorder.stop();
          }
        });
      }

      const hubId = currentOrder?.hubId || "hub_gimpo_01";

      // 실제 녹음 파일을 BE로 전송
      const result = await submitVoiceReport(blob);

      addPoints(result.pointsEarned);

      navigate("/report/complete", {
        state: { result },
      });
    } catch (err: any) {
      alert("제보 등록 실패: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-[#F5F6F8] flex flex-col w-full max-w-md mx-auto shadow-lg overflow-hidden">
      <MobileHeader title="현장 경험 남기기" showBack={true} />

      <main className="flex-1 overflow-y-auto p-5 flex flex-col items-center pt-8 pb-6 text-center">
        <h2 className="text-base text-gray-800 font-medium mb-12 leading-relaxed">
          다음 운송인에게도 도움이 될 현장 정보나
          <br />
          주의사항을 음성으로 알려주세요.
        </h2>

        {/* Microphone Ripple Animation Container */}
        <div className="flex flex-col items-center justify-center mb-10">
          <button
            onClick={handleToggleRecord}
            disabled={submitting}
            className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording
                ? "bg-green-100 animate-recording-ripple border-4 border-green-200"
                : "bg-gray-100 border-4 border-gray-300 hover:bg-gray-200"
            }`}
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
              {!recordingStarted ? null : isRecording ? (
                <Mic className="w-10 h-10 text-[#2E7D32]" />
              ) : (
                <Square className="w-8 h-8 text-gray-700 fill-gray-700" />
              )}
            </div>
          </button>

          <p
            className={`text-sm font-bold mt-6 ${
              isRecording ? "text-[#2E7D32] animate-pulse" : "text-gray-500"
            }`}
          >
            {!recordingStarted
              ? "녹음 시작"
              : isRecording
                ? "녹음 중..."
                : "녹음 일시정지"}
          </p>

          <div className="w-20 h-0.5 bg-gray-200 my-4" />

          {/* Timer */}
          <div className="flex items-baseline gap-1 text-gray-900 font-mono">
            <span className="text-2xl font-extrabold">
              {formatTimer(seconds)}
            </span>

            <span className="text-xs font-semibold text-gray-400">/ 02:00</span>
          </div>
        </div>

        {/* Guidelines */}
        <div className="w-full text-left bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-1.5">
          <p className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            최대 2분까지 녹음할 수 있어요.
          </p>

          <p className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            개인 정보는 AI에 의해 자동으로 비식별 처리돼요.
          </p>
        </div>
      </main>

      {/* Submit */}
      <div className="p-4 pb-20 bg-white border-t border-gray-100 shrink-0">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full h-14 bg-[#1A2B5C] text-white text-base font-bold rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI 음성 태깅 및 제보 등록 중...
            </>
          ) : (
            "제보 완료"
          )}
        </button>
      </div>
    </div>
  );
};
