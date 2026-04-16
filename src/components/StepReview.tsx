interface Props {
  answers: string[];
  onAnswerChange: (index: number, value: string) => void;
  onConfirm: () => void;
  onBack: () => void;
  isSending: boolean;
}

export default function StepReview({ answers, onAnswerChange, onConfirm, onBack, isSending }: Props) {
  const isEmpty = answers.some(a => !a.trim());

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
          bg-gradient-to-br from-indigo-100 to-blue-100 mb-4 shadow-sm">
          <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-700 mb-1">Relecture & Correction</h2>
        <p className="text-slate-400 text-sm">Vérifiez et modifiez votre réponse avant l'envoi.</p>
      </div>

      {/* Answer card */}
      {answers.map((answer, idx) => (
        <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100
              flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xs">{idx + 1}</span>
            </div>
            <span className="text-sm font-semibold text-slate-600">Réponse {idx + 1}</span>
          </div>
          <textarea
            value={answer}
            onChange={e => onAnswerChange(idx, e.target.value)}
            rows={9}
            placeholder="Aucune réponse fournie…"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700
              text-sm placeholder-slate-300 bg-slate-50 focus:bg-white focus:outline-none
              focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all
              duration-200 resize-none leading-relaxed"
          />
          <div className="mt-1.5 flex justify-end">
            <span className="text-xs text-slate-300">{answer.length} caractères</span>
          </div>
        </div>
      ))}

      {/* Empty warning */}
      {isEmpty && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2 mb-4">
          <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p className="text-xs text-amber-600">
            Votre réponse est vide. Vous pouvez tout de même envoyer, mais assurez-vous que c'est voulu.
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={onBack}
          disabled={isSending}
          className="py-3 px-5 bg-white border border-slate-200 text-slate-500 font-semibold
            rounded-xl transition-all duration-200 hover:bg-slate-50 text-sm flex items-center
            gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
          </svg>
          Retour
        </button>

        <button
          onClick={onConfirm}
          disabled={isSending}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-400 to-indigo-500
            hover:from-blue-500 hover:to-indigo-600 text-white font-semibold rounded-xl
            shadow-md shadow-blue-100 hover:shadow-blue-200 hover:scale-[1.01]
            active:scale-[0.99] transition-all duration-200 text-sm flex items-center
            justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isSending ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Envoi en cours…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
              </svg>
              Confirmer l'envoi
            </>
          )}
        </button>
      </div>
    </div>
  );
}
