"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

const quranVerses = [
  {
    text: "Indeed, Allah is with the patient.",
    reference: "Surah Al-Baqarah 2:153, Sahih International",
  },
  {
    text: "So remember Me; I will remember you.",
    reference: "Surah Al-Baqarah 2:152, Sahih International",
  },
  {
    text: "And whoever relies upon Allah - then He is sufficient for him.",
    reference: "Surah At-Talaq 65:3, Sahih International",
  },
  {
    text: "Indeed, with hardship will be ease.",
    reference: "Surah Ash-Sharh 94:6, Sahih International",
  },
  {
    text: "And Allah is the best of providers.",
    reference: "Surah Al-Jumu'ah 62:11, Sahih International",
  },
  {
    text: "And your Lord is going to give you, and you will be satisfied.",
    reference: "Surah Ad-Duhaa 93:5, Sahih International",
  },
  {
    text: "So be patient. Indeed, the promise of Allah is truth.",
    reference: "Surah Ar-Rum 30:60, Sahih International",
  },
  {
    text: "Unquestionably, by the remembrance of Allah hearts are assured.",
    reference: "Surah Ar-Ra'd 13:28, Sahih International",
  },
  {
    text: "And He found you lost and guided you.",
    reference: "Surah Ad-Duhaa 93:7, Sahih International",
  },
  {
    text: "And Allah loves the doers of good.",
    reference: "Surah Aal-E-Imran 3:134, Sahih International",
  },
  {
    text: "Our Lord, accept from us. Indeed You are the Hearing, the Knowing.",
    reference: "Surah Al-Baqarah 2:127, Sahih International",
  },
  {
    text: "My success is not but through Allah.",
    reference: "Surah Hud 11:88, Sahih International",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleOptions, setRoleOptions] = useState<
    { role: string; label: string }[]
  >([]);
  const [verse] = useState(
    () => quranVerses[Math.floor(Math.random() * quranVerses.length)]
  );

  async function completeSignIn(role?: string) {
    setError("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      role,
      redirect: false,
      callbackUrl: "/",
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    window.location.href = result?.url ?? "/";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setRoleOptions([]);
    setIsSubmitting(true);

    const response = await fetch("/api/auth/role-options", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = (await response.json()) as {
      roles?: { role: string; label: string }[];
    };
    const roles = data.roles ?? [];

    setIsSubmitting(false);

    if (roles.length === 0) {
      setError("Invalid email or password.");
      return;
    }

    if (roles.length === 1) {
      await completeSignIn(roles[0].role);
      return;
    }

    setRoleOptions(roles);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F7FB] px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-5 rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="text-center">
          <p className="text-sm font-medium uppercase text-[#770FC2]">
            Digiart Creation
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-[#1F2937]">
            Welcome back to Digiart Creation Office Space
          </h1>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-[#1F2937]">Email</span>
          <input
            className="rounded-md border border-[#E5E7EB] px-3 py-2"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-[#1F2937]">Password</span>
          <input
            className="rounded-md border border-[#E5E7EB] px-3 py-2"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {roleOptions.length > 1 ? (
          <div className="grid gap-2 rounded-md border border-[#E5E7EB] bg-[#F8F7FB] p-3">
            <p className="text-sm font-medium text-[#1F2937]">
              Select workspace
            </p>
            {roleOptions.map((option) => (
              <button
                key={option.role}
                type="button"
                onClick={() => completeSignIn(option.role)}
                className="rounded-md border border-[#A05DD0]/40 bg-white px-3 py-2 text-left text-sm font-medium text-[#770FC2] transition hover:bg-[#F3E8FF]"
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}

        <blockquote className="rounded-md border border-[#E5E7EB] bg-[#F8F7FB] p-4 text-sm leading-6 text-[#4B5563]">
          <p>&quot;{verse.text}&quot;</p>
          <footer className="mt-2 text-xs font-medium text-[#770FC2]">
            - {verse.reference}
          </footer>
        </blockquote>

        <button
          className="rounded-md bg-[#770FC2] px-4 py-2 font-medium text-white transition hover:bg-[#6B1BBD] disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
