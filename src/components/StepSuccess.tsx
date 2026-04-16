interface Props {
  prenom: string;
  email: string;
}

export default function StepSuccess({ prenom, email }: Props) {
  return (
    <div className="animate-fadeIn text-center py-4">
      {/* Animated checkmark */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-100 to-green-100
          flex items-center justify-center shadow-lg shadow-emerald-100 animate-scaleIn">
          <svg
            className="w-14 h-14 text-emerald-500 animate-checkmark"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <div className="absolute inset-0 rounded-full bg-emerald-300 opacity-20 animate-ping"/>
      </div>

      <h2 className="text-2xl font-bold text-slate-700 mb-2">Envoi réussi ! 🎉</h2>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
        Merci <span className="font-semibold text-slate-700">{prenom}</span> !
        Votre réponse a bien été envoyée.
        Un e-mail de confirmation a été adressé à{" "}
        <span className="font-semibold text-blue-500">{email}</span>.
      </p>

      {/* Summary card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100
        rounded-2xl p-5 text-left mb-6">
        <h3 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Récapitulatif de l'envoi
        </h3>
        <ul className="space-y-2 text-xs text-slate-500">
          {[
            "Un e-mail de confirmation vous a été envoyé",
            "Votre réponse a été transmise au responsable",
            "Vos données sont traitées de manière confidentielle",
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-300 rounded-full flex-shrink-0"/>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-slate-400 mb-3">
        Vous pouvez fermer cette page ou recommencer une nouvelle session.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="py-2.5 px-6 bg-white border border-slate-200 text-slate-500 font-semibold
          rounded-xl text-sm hover:bg-slate-50 transition-all duration-200 inline-flex
          items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25
               8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
        </svg>
        Recommencer
      </button>
    </div>
  );
}
