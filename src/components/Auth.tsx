/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, ShieldCheck, Clock3, Shirt, ArrowRight } from 'lucide-react';
import LaundryHero from '@/src/assets/laundry-hero.svg';

interface AuthProps {
  onLogin: () => Promise<void>;
  isLoading: boolean;
  errorMessage?: string | null;
}

export function Auth({ onLogin, isLoading, errorMessage }: AuthProps) {
  const benefits = [
    { icon: Clock3, title: 'Real-time order tracking', desc: 'Follow every garment from drop-off to pickup.' },
    { icon: ShieldCheck, title: 'Secure access', desc: 'Google authentication with protected business data.' },
    { icon: Sparkles, title: 'Cleaner operations', desc: 'Fast workflows for intake, processing, and delivery.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-8 md:px-10 lg:px-14">
      <div className="mx-auto grid w-full max-w-7xl overflow-hidden rounded-3xl border border-border/80 bg-white shadow-[0_20px_60px_-35px_rgba(37,99,235,0.35)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 text-white lg:flex">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-400/25 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="relative space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-100/90">
              <Shirt className="h-4 w-4" />
              DryClean Pro Suite
            </div>
            <div>
              <h1 className="max-w-xl text-5xl font-bold leading-tight">
                Laundry operations that look and feel premium.
              </h1>
              <p className="mt-4 max-w-xl text-base text-slate-200/90">
                Run your entire dry-cleaning workflow in one polished dashboard built for speed, clarity, and better customer service.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-2 shadow-2xl">
              <img
                src={LaundryHero}
                alt="Laundry operations illustration"
                className="h-[260px] w-full rounded-xl object-cover"
              />
            </div>
          </div>

          <div className="relative space-y-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="rounded-lg bg-white/10 p-2">
                  <benefit.icon className="h-4 w-4 text-emerald-200" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{benefit.title}</p>
                  <p className="text-xs text-slate-300">{benefit.desc}</p>
                </div>
              </div>
            ))}
            <p className="pt-2 text-xs text-slate-400">Trusted by modern laundry teams for consistent, transparent service.</p>
          </div>
        </div>

        <div className="flex items-center p-6 sm:p-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <Shirt className="h-4 w-4" />
                DryClean Pro
              </div>
              <h2 className="text-3xl font-bold text-foreground">Manage your laundry floor faster.</h2>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Welcome back</p>
              <h2 className="text-4xl font-bold text-foreground">Sign in to continue</h2>
              <p className="text-sm text-muted-foreground">
                Access orders, update statuses, and keep customers informed from one clean workspace.
              </p>
            </div>

            <div className="mt-8 space-y-5">
              <Button
                onClick={onLogin}
                disabled={isLoading}
                className="h-12 w-full rounded-xl bg-primary text-primary-foreground shadow-lg shadow-blue-500/20 transition hover:bg-primary/90"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M21.35 11.1H12v2.98h5.38c-.24 1.56-1.9 4.59-5.38 4.59-3.23 0-5.86-2.67-5.86-5.95 0-3.29 2.63-5.96 5.86-5.96 1.84 0 3.07.8 3.77 1.49l2.57-2.51C16.7 4.26 14.57 3.4 12 3.4 7.05 3.4 3 7.5 3 12.72 3 17.92 7.05 22 12 22c6.93 0 9.6-4.95 9.6-7.52 0-.5-.05-.86-.11-1.24l-.14-.14Z"
                    fill="currentColor"
                  />
                </svg>
                {isLoading ? 'Signing in...' : 'Continue with Google'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {errorMessage ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-700" role="alert">
                    {errorMessage}
                  </p>
                </div>
              ) : null}

              <div className="rounded-xl border border-border bg-secondary/60 px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  Protected login with OAuth. Your customer and order data stays secured in your Firebase project.
                </p>
              </div>
            </div>

            <div className="mt-10 border-t border-border pt-6 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {new Date().getFullYear()} DryClean Pro
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Built for modern laundry and dry-cleaning teams.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
