import { useState } from "react";

interface FormData {
  prenom: string;
  nom: string;
  email: string;
}

interface Props {
  onNext: (data: FormData) => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: FormData): Partial<FormData> {
  const errors: Partial<FormData> = {};
  if (!data.prenom.trim()) errors.prenom = "Le prénom est obligatoire.";
  if (!data.nom.trim())    errors.nom    = "Le nom est obligatoire.";
  if (!data.email.trim()) {
    errors.email = "L'adresse e-mail est obligatoire.";
  } else if (!emailRegex.test(data.email)) {
    errors.email = "Veuillez entrer une adresse e-mail valide.";
  }
  return errors;
}

export default function StepIdentification({ onNext }: Props) {
  const [form,    setForm]    = useState<FormData>({ prenom: "", nom: "", email: "" });
  const [errors,  setErrors]  = useState<Partial<FormData>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const handleChange = (field: keyof FormData, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) setErrors(validate(updated));
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ prenom: true, nom: true, email: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) onNext(form);
  };

  const fieldClass = (field: keyof FormData) =>
    `w-full px-4 py-3 rounded-xl border text-slate-700 text-sm placeholder-slate-300
     bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${
      errors[field] && touched[field]
        ? "border-rose-300 focus:ring-rose-200 bg-rose-50"
        : "border-slate-200 focus:ring-blue-200 focus:border-blue-300"
    }`;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
          bg-gradient-to-br from-blue-100 to-indigo-100 mb-4 shadow-sm">
          <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-700 mb-1">Identification</h2>
        <p className="text-slate-400 text-sm">
          Renseignez vos informations avant de commencer.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Prénom */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5" htmlFor="prenom">
            Prénom <span className="text-rose-400">*</span>
          </label>
          <input
            id="prenom" type="text" autoComplete="given-name"
            value={form.prenom} placeholder="Votre prénom"
            onChange={e => handleChange("prenom", e.target.value)}
            onBlur={() => handleBlur("prenom")}
            className={fieldClass("prenom")}
          />
          {errors.prenom && touched.prenom && <ErrorMsg msg={errors.prenom} />}
        </div>

        {/* Nom */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5" htmlFor="nom">
            Nom <span className="text-rose-400">*</span>
          </label>
          <input
            id="nom" type="text" autoComplete="family-name"
            value={form.nom} placeholder="Votre nom"
            onChange={e => handleChange("nom", e.target.value)}
            onBlur={() => handleBlur("nom")}
            className={fieldClass("nom")}
          />
          {errors.nom && touched.nom && <ErrorMsg msg={errors.nom} />}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5" htmlFor="email">
            Adresse e-mail <span className="text-rose-400">*</span>
          </label>
          <input
            id="email" type="email" autoComplete="email"
            value={form.email} placeholder="votre@email.fr"
            onChange={e => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            className={fieldClass("email")}
          />
          {errors.email && touched.email && <ErrorMsg msg={errors.email} />}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-blue-400 to-indigo-500
            hover:from-blue-500 hover:to-indigo-600 text-white font-semibold rounded-xl
            shadow-md shadow-blue-100 hover:shadow-blue-200 hover:scale-[1.01]
            active:scale-[0.99] transition-all duration-200 text-sm flex items-center
            justify-center gap-2"
        >
          Commencer
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </form>
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd" />
      </svg>
      {msg}
    </p>
  );
}
