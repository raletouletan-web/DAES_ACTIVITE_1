interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const STEPS = [
  { label: "Identification", icon: "👤" },
  { label: "Question",       icon: "🎤" },
  { label: "Relecture",      icon: "📝" },
  { label: "Envoi",          icon: "📧" },
];

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-start justify-between">
        {STEPS.map((step, index) => {
          const num       = index + 1;
          const completed = num < currentStep;
          const active    = num === currentStep;

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              {/* connector + circle row */}
              <div className="flex items-center w-full">
                {/* left connector */}
                {index > 0 && (
                  <div
                    className={`flex-1 h-1 rounded-full transition-all duration-700 ${
                      completed ? "bg-blue-400" : "bg-blue-100"
                    }`}
                  />
                )}

                {/* circle */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                    transition-all duration-500 shadow-sm flex-shrink-0
                    ${completed
                      ? "bg-blue-400 text-white"
                      : active
                        ? "bg-blue-500 text-white scale-110 ring-4 ring-blue-100"
                        : "bg-white border-2 border-blue-100 text-blue-300"
                    }`}
                >
                  {completed ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{num}</span>
                  )}
                </div>

                {/* right connector */}
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 rounded-full transition-all duration-700 ${
                      completed ? "bg-blue-400" : "bg-blue-100"
                    }`}
                  />
                )}
              </div>

              {/* label */}
              <span
                className={`mt-2 text-[10px] font-semibold tracking-wide text-center transition-colors duration-300 ${
                  active ? "text-blue-600" : completed ? "text-blue-400" : "text-slate-300"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* overall progress bar */}
      <div className="mt-4 h-1.5 bg-blue-50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full transition-all duration-700"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
