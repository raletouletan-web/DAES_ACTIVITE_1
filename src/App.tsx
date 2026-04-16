import { useState } from "react";
import emailjs from "@emailjs/browser";
import ProgressBar from "./components/ProgressBar";
import StepIdentification from "./components/StepIdentification";
import StepQuestion from "./components/StepQuestion";
import StepReview from "./components/StepReview";
import StepSuccess from "./components/StepSuccess";

/* ─── EmailJS config ─── */
const SVC_ID    = "service_6gsqvxg";
const TPL_ID    = "template_5ccegro";
const PUBLIC_KEY = "9d3bsPq_clwKINxP3";

const QUESTION_TEXT =
  "Activité 1 - Accompagnement et soins de la personne dans les activités de sa vie " +
  "quotidienne et de sa vie sociale en repérant les fragilités. Au moins un type de " +
  "soins ou d'activité de la vie quotidienne est attendu. Dans votre expérience, " +
  "décrivez une situation où vous avez réalisé ces soins.";

interface UserData { prenom: string; nom: string; email: string; }

export default function App() {
  const [step,      setStep]      = useState<1 | 2 | 3 | 4>(1);
  const [userData,  setUserData]  = useState<UserData>({ prenom: "", nom: "", email: "" });
  const [answer,    setAnswer]    = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  /* ── navigation ── */
  const handleIdentificationNext = (data: UserData) => {
    setUserData(data);
    setStep(2);
    scrollTop();
  };

  const handleQuestionNext = () => { setStep(3); scrollTop(); };
  const handleReviewBack   = () => { setStep(2); scrollTop(); };

  /* ── send via EmailJS ── */
  const handleConfirmSend = async () => {
    setIsSending(true);
    setSendError("");

    const payload = {
      prenom:           userData.prenom,
      nom:              userData.nom,
      email_utilisateur: userData.email,
      reponse_1:        answer.trim() || "(Aucune réponse)",
    };

    try {
      /* 1) Send to candidate */
      await emailjs.send(SVC_ID, TPL_ID, { ...payload, to_email: userData.email }, PUBLIC_KEY);
      /* 2) Send to admin */
      await emailjs.send(SVC_ID, TPL_ID, { ...payload, to_email: "raletouletan@gmail.com" }, PUBLIC_KEY);

      setStep(4);
      scrollTop();
    } catch (err: unknown) {
      console.error("EmailJS error:", err);
      const e = err as { text?: string; message?: string };
      setSendError(
        e?.text || e?.message || "Une erreur est survenue lors de l'envoi. Veuillez réessayer."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">

      {/* ── Header ── */}
      <header className="w-full bg-white/80 backdrop-blur-sm border-b border-slate-100
        shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500
            flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813
                   a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846
                   .813a4.5 4.5 0 00-3.09 3.09z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-700 leading-tight">
              Questions Activité 1
            </h1>
            <p className="text-xs text-slate-400">Aide Soignant — Évaluation des compétences</p>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-2xl">

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border
            border-slate-100 p-6 md:p-8">

            {/* Progress bar (steps 1–3) */}
            {step <= 3 && <ProgressBar currentStep={step} totalSteps={4} />}

            {/* ── Step 1 : Identification ── */}
            {step === 1 && (
              <StepIdentification onNext={handleIdentificationNext} />
            )}

            {/* ── Step 2 : Question ── */}
            {step === 2 && (
              <div className="animate-fadeIn">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-slate-700 mb-1">Votre réponse</h2>
                  <p className="text-slate-400 text-sm">
                    Répondez par écrit ou à l'oral. Votre réponse est sauvegardée automatiquement.
                  </p>
                </div>
                <StepQuestion
                  questionNumber={1}
                  questionText={QUESTION_TEXT}
                  answer={answer}
                  onAnswerChange={setAnswer}
                  onNext={handleQuestionNext}
                />
              </div>
            )}

            {/* ── Step 3 : Review ── */}
            {step === 3 && (
              <>
                <StepReview
                  answers={[answer]}
                  onAnswerChange={(_, val) => setAnswer(val)}
                  onConfirm={handleConfirmSend}
                  onBack={handleReviewBack}
                  isSending={isSending}
                />
                {sendError && (
                  <div className="mt-4 bg-rose-50 border border-rose-100 rounded-xl p-3
                    text-xs text-rose-500 flex items-start gap-2">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4
                           c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <span>{sendError}</span>
                  </div>
                )}
              </>
            )}

            {/* ── Step 4 : Success ── */}
            {step === 4 && (
              <StepSuccess prenom={userData.prenom} email={userData.email} />
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-400 mt-6">
            © 2025 Questions Activité 1 — Aide Soignant ·{" "}
            Toutes les données sont traitées de manière confidentielle.
          </p>
        </div>
      </main>
    </div>
  );
}
