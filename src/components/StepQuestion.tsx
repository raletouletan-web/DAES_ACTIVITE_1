import { useState, useRef, useEffect } from "react";

interface Props {
  questionNumber: number;
  questionText: string;
  answer: string;
  onAnswerChange: (val: string) => void;
  onNext: () => void;
}

/* ── Web Speech API type shims ── */
interface ISpeechResult {
  readonly isFinal: boolean;
  [index: number]: { transcript: string };
}
interface ISpeechResultList {
  readonly length: number;
  [index: number]: ISpeechResult;
}
interface ISpeechEvent extends Event {
  readonly resultIndex: number;
  readonly results: ISpeechResultList;
}
interface ISpeechErrorEvent extends Event {
  readonly error: string;
}
interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onstart:  ((ev: Event) => void) | null;
  onresult: ((ev: ISpeechEvent) => void) | null;
  onerror:  ((ev: ISpeechErrorEvent) => void) | null;
  onend:    ((ev: Event) => void) | null;
  start(): void;
  stop():  void;
  abort(): void;
}
declare global {
  interface Window {
    SpeechRecognition:       new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

export default function StepQuestion({
  questionNumber, questionText, answer, onAnswerChange, onNext,
}: Props) {
  const [isRecording,       setIsRecording]       = useState(false);
  const [isTranscribing,    setIsTranscribing]     = useState(false);
  const [speechError,       setSpeechError]        = useState("");
  const [supportsSpeech,    setSupportsSpeech]     = useState(true);

  const recognitionRef   = useRef<ISpeechRecognition | null>(null);
  const accumulatedRef   = useRef<string>("");

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) setSupportsSpeech(false);
    return () => recognitionRef.current?.abort();
  }, []);

  /* ── start recording ── */
  const startRecording = () => {
    setSpeechError("");
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSpeechError("La reconnaissance vocale n'est pas supportée par votre navigateur. Utilisez Chrome.");
      return;
    }

    const rec = new SR();
    rec.lang            = "fr-FR";
    rec.interimResults  = true;
    rec.continuous      = true;
    rec.maxAlternatives = 1;

    accumulatedRef.current = answer;

    rec.onstart = () => {
      setIsRecording(true);
      setIsTranscribing(false);
    };

    rec.onresult = (ev: ISpeechEvent) => {
      let interim       = "";
      let finalSoFar    = accumulatedRef.current;

      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const r = ev.results[i];
        if (r.isFinal) {
          finalSoFar += (finalSoFar ? " " : "") + r[0].transcript;
          accumulatedRef.current = finalSoFar;
        } else {
          interim += r[0].transcript;
        }
      }
      onAnswerChange(finalSoFar + (interim ? " " + interim : ""));
    };

    rec.onerror = (ev: ISpeechErrorEvent) => {
      if (ev.error !== "no-speech") {
        setSpeechError("Erreur lors de la reconnaissance vocale. Veuillez réessayer.");
      }
      setIsRecording(false);
      setIsTranscribing(false);
    };

    rec.onend = () => {
      setIsRecording(false);
      setIsTranscribing(false);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  /* ── stop recording ── */
  const stopRecording = () => {
    setIsTranscribing(true);
    recognitionRef.current?.stop();
  };

  const handleVoiceBtn = () => isRecording ? stopRecording() : startRecording();

  return (
    <div className="animate-fadeIn">
      {/* Question block */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-400
            flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white font-bold text-sm">{questionNumber}</span>
          </div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
            Question {questionNumber}
          </span>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100
          rounded-2xl p-5 shadow-sm">
          <p className="text-slate-700 text-sm leading-relaxed font-medium">{questionText}</p>
        </div>
      </div>

      {/* Answer textarea */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">
            Votre réponse
          </label>
          <div className="relative">
            <textarea
              value={answer}
              onChange={e => onAnswerChange(e.target.value)}
              placeholder="Écrivez votre réponse ici, ou utilisez la reconnaissance vocale ci-dessous…"
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700
                text-sm placeholder-slate-300 bg-white focus:outline-none focus:ring-2
                focus:ring-blue-200 focus:border-blue-300 transition-all duration-200
                resize-none leading-relaxed"
            />
            {answer && (
              <div className="absolute bottom-3 right-3">
                <span className="text-xs text-slate-300 bg-white px-2 py-0.5 rounded-lg border border-slate-100">
                  {answer.length} car.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Voice section */}
        {supportsSpeech && (
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            {/* header row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5
                       M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
                <span className="text-xs font-semibold text-slate-500">Répondre à l'oral</span>
              </div>
              {isRecording && (
                <span className="flex items-center gap-1.5 text-xs text-red-400 font-semibold">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  Enregistrement…
                </span>
              )}
              {isTranscribing && !isRecording && (
                <span className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold">
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Transcription en cours…
                </span>
              )}
            </div>

            {/* Voice button */}
            <button
              onClick={handleVoiceBtn}
              disabled={isTranscribing}
              className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all
                duration-200 flex items-center justify-center gap-2 ${
                isRecording
                  ? "bg-red-50 border-2 border-red-300 text-red-500 hover:bg-red-100 animate-recordPulse"
                  : isTranscribing
                    ? "bg-slate-100 border-2 border-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-white border-2 border-blue-200 text-blue-500 hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              {isTranscribing ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Transcription en cours…
                </>
              ) : isRecording ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="2"/>
                  </svg>
                  Arrêter l'enregistrement
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75
                         0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                  Répondre à l'oral
                </>
              )}
            </button>

            {speechError && (
              <p className="mt-2 text-xs text-rose-500 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"/>
                </svg>
                {speechError}
              </p>
            )}

            <p className="mt-2 text-xs text-slate-400 text-center">
              Parlez clairement en français. La transcription apparaît en temps réel et peut être modifiée.
            </p>
          </div>
        )}

        {!supportsSpeech && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs
            text-amber-600 flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            La reconnaissance vocale n'est pas disponible dans ce navigateur. Utilisez Chrome pour cette fonctionnalité.
          </div>
        )}
      </div>

      {/* Next button */}
      <div className="mt-7 flex justify-end">
        <button
          onClick={onNext}
          className="py-3 px-8 bg-gradient-to-r from-blue-400 to-indigo-500
            hover:from-blue-500 hover:to-indigo-600 text-white font-semibold rounded-xl
            shadow-md shadow-blue-100 hover:shadow-blue-200 hover:scale-[1.01]
            active:scale-[0.99] transition-all duration-200 text-sm flex items-center gap-2"
        >
          Voir le récapitulatif
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
