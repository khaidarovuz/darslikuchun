import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Pack, Player } from '../types/game';
import { PlayerCard } from './PlayerCard';
import { sounds } from '../utils/sound';
import { Sparkles, Coins, ArrowRight, RotateCcw, FastForward, Shield, Trophy } from 'lucide-react';

interface PackAnimationProps {
  pack: Pack;
  players: Player[];
  onFinish: (players: Player[]) => void;
  onOpenAnother: (pack: Pack) => void;
  onQuickSellAll: (players: Player[], totalValue: number) => void;
  coinsBalance: number;
}

type WalkoutStep = 'PACK_IDLE' | 'RIPPING' | 'NATION' | 'POSITION' | 'CLUB' | 'WALKOUT_REVEAL' | 'SUMMARY';

export const PackAnimation: React.FC<PackAnimationProps> = ({
  pack,
  players,
  onFinish,
  onOpenAnother,
  onQuickSellAll,
  coinsBalance,
}) => {
  const [step, setStep] = useState<WalkoutStep>('PACK_IDLE');
  const bestPlayer = players[0] || null;
  const isWalkout = bestPlayer && (bestPlayer.ovr >= 86 || bestPlayer.tier === 'toty' || bestPlayer.tier === 'icon' || bestPlayer.tier === 'ballon_dor');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#38BDF8', '#10B981', '#E11D48', '#FFFFFF'],
      });
    } catch {
      // safe fallback if confetti blocked
    }
  };

  const handleStartRip = () => {
    sounds.playPackTear();
    setStep('RIPPING');

    timerRef.current = setTimeout(() => {
      if (isWalkout) {
        // Start walkout sequence
        sounds.playHeartbeat();
        setStep('NATION');
        sounds.playRevealStinger(0.9);

        timerRef.current = setTimeout(() => {
          sounds.playHeartbeat();
          setStep('POSITION');
          sounds.playRevealStinger(1.1);

          timerRef.current = setTimeout(() => {
            sounds.playHeartbeat();
            setStep('CLUB');
            sounds.playRevealStinger(1.3);

            timerRef.current = setTimeout(() => {
              sounds.playWalkoutDrop();
              triggerConfetti();
              setStep('WALKOUT_REVEAL');
            }, 1800);
          }, 1800);
        }, 1800);
      } else {
        // Direct reveal for lower rated packs
        sounds.playCrowdCheer();
        setStep('SUMMARY');
      }
    }, 1200);
  };

  const handleSkip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (isWalkout && step !== 'WALKOUT_REVEAL' && step !== 'SUMMARY') {
      sounds.playWalkoutDrop();
      triggerConfetti();
      setStep('WALKOUT_REVEAL');
    } else {
      setStep('SUMMARY');
    }
  };

  const totalPackValue = players.reduce((acc, p) => acc + p.value, 0);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-neutral-950 overflow-hidden select-none">
      {/* Dynamic Stadium Lighting Arena */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Stadium Floodlights & Volumetric Beams */}
        <div className="absolute top-0 left-1/4 w-32 h-full bg-gradient-to-b from-sky-400/25 via-blue-500/5 to-transparent blur-3xl animate-spotlight-left" />
        <div className="absolute top-0 right-1/4 w-32 h-full bg-gradient-to-b from-amber-400/25 via-yellow-500/5 to-transparent blur-3xl animate-spotlight-right" />
        {/* Arena floor radial grid */}
        <div className="absolute bottom-0 inset-x-0 h-2/3 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/25 via-neutral-950/80 to-neutral-950" />
      </div>

      {/* Top Header Bar during Animation */}
      <div className="relative z-20 w-full max-w-6xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-neutral-900/80 border border-neutral-700 text-xs font-bold text-neutral-300">
            {pack.nameUz}
          </span>
          {isWalkout && step !== 'PACK_IDLE' && step !== 'SUMMARY' && (
            <span className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-xs font-black text-amber-300 uppercase tracking-widest animate-pulse">
              WALKOUT 🌟
            </span>
          )}
        </div>

        {/* Skip Button */}
        {step !== 'PACK_IDLE' && step !== 'SUMMARY' && (
          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-xs font-bold text-white transition-colors border border-neutral-700"
          >
            <span>O'tkazib yuborish</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* STAGE 1: PACK IDLE / RIPPING */}
      {(step === 'PACK_IDLE' || step === 'RIPPING') && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
          {/* 3D Physical Pack Card Container */}
          <div
            onClick={step === 'PACK_IDLE' ? handleStartRip : undefined}
            className={`relative w-64 h-96 rounded-2xl cursor-pointer group transition-all duration-300 ${
              step === 'RIPPING' ? 'animate-pack-shake scale-105' : 'hover:scale-105'
            }`}
          >
            {/* Outer Pack Foil Glow */}
            <div
              className={`absolute -inset-2 rounded-3xl blur-xl opacity-75 transition-opacity group-hover:opacity-100 ${
                pack.category === 'promo' ? 'bg-amber-500/40' : 'bg-blue-500/30'
              }`}
            />

            {/* Foil Pack Surface */}
            <div
              className={`w-full h-full rounded-2xl border-2 border-white/20 bg-gradient-to-b ${pack.bgGradient} p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden`}
            >
              {/* Foil diagonal shine */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/20 to-transparent pointer-events-none" />

              {/* Pack Tag & League Badge */}
              <div className="flex justify-between items-start">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-md">
                  {pack.tag || 'FC PACK'}
                </span>
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>

              {/* Center Pack Emblem / Title */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-black/40 border border-white/20 flex items-center justify-center mb-3 shadow-inner">
                  <Shield className="w-10 h-10 text-amber-400" />
                </div>
                <h3 className="text-2xl font-black text-white font-heading tracking-wide uppercase">
                  {pack.nameUz}
                </h3>
                <span className="text-xs text-neutral-300 mt-1">
                  {pack.cardCount} ta o'yinchi
                </span>
              </div>

              {/* Bottom Guaranteed Badge */}
              <div className="p-2 rounded-xl bg-black/50 border border-white/10 text-center">
                <span className="text-[11px] font-bold text-amber-300 block">
                  {pack.guaranteedMinOvr ? `${pack.guaranteedMinOvr}+ OVR Kafolatlangan` : 'Oltin O\'yinchilar'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Instruction */}
          <div className="mt-8">
            <button
              onClick={handleStartRip}
              disabled={step === 'RIPPING'}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-500/25 transition-transform active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>{step === 'RIPPING' ? 'Ochilyapti...' : 'Paketni ochish!'}</span>
            </button>
            <p className="text-xs text-neutral-400 mt-2">
              Paket ustiga bosing yoki tugmani bosing
            </p>
          </div>
        </div>
      )}

      {/* STAGE 2: WALKOUT SUSPENSE (NATION -> POSITION -> CLUB) */}
      {(step === 'NATION' || step === 'POSITION' || step === 'CLUB') && bestPlayer && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="max-w-md w-full flex flex-col items-center">
            {/* Nation Reveal */}
            <div className="flex flex-col items-center mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
                DAVLAT / NATION
              </span>
              <div className="w-28 h-28 rounded-2xl bg-neutral-900/90 border-2 border-neutral-700 flex items-center justify-center text-6xl shadow-2xl animate-in zoom-in duration-300">
                {bestPlayer.nationFlag}
              </div>
              <span className="text-xl font-black text-white mt-2 font-heading tracking-wider uppercase">
                {bestPlayer.nation}
              </span>
            </div>

            {/* Position Reveal */}
            {(step === 'POSITION' || step === 'CLUB') && (
              <div className="flex flex-col items-center mb-6 animate-in slide-in-from-bottom duration-300">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">
                  POZITSIYA
                </span>
                <span className="text-5xl font-black text-amber-400 font-heading tracking-widest px-4 py-1 rounded-lg bg-neutral-900/80 border border-amber-500/30">
                  {bestPlayer.position}
                </span>
              </div>
            )}

            {/* Club Reveal */}
            {step === 'CLUB' && (
              <div className="flex flex-col items-center animate-in slide-in-from-bottom duration-300">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">
                  KLUB
                </span>
                <span className="text-3xl font-black text-white font-heading tracking-wide uppercase text-amber-300">
                  {bestPlayer.club}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STAGE 3: FULL WALKOUT REVEAL WITH BEST PLAYER CELEBRATION */}
      {step === 'WALKOUT_REVEAL' && bestPlayer && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-90 duration-500">
          {/* Walkout Title Aura */}
          <div className="mb-4">
            <span className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 text-black text-xs font-black tracking-widest uppercase shadow-lg shadow-amber-500/30">
              {bestPlayer.tier === 'toty'
                ? '⭐ YIL JAMOYASI (TOTY) ⭐'
                : bestPlayer.tier === 'icon'
                ? '👑 AFSONAVIY PRIME ICON 👑'
                : bestPlayer.tier === 'ballon_dor'
                ? '🏆 OLTIN TO\'P SOHIBI 🏆'
                : '⭐ ELITA WALKOUT ⭐'}
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white font-heading tracking-wider uppercase mt-2 drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)]">
              {bestPlayer.name}
            </h2>
            {bestPlayer.celebration && (
              <p className="text-sm font-bold text-amber-300 mt-1">
                {bestPlayer.celebration}
              </p>
            )}
          </div>

          {/* Large Hero Card Showcase */}
          <div className="relative my-2 transform transition-transform duration-300 hover:scale-105">
            <PlayerCard player={bestPlayer} size="hero" />
          </div>

          {/* Continue to Full Pack Summary Button */}
          <div className="mt-6">
            <button
              onClick={() => setStep('SUMMARY')}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/25 flex items-center gap-2"
            >
              <span>Barcha o'yinchilarni ko'rish ({players.length})</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 4: ALL PLAYERS SUMMARY & ACTIONS */}
      {step === 'SUMMARY' && (
        <div className="relative z-10 flex-1 w-full max-w-6xl px-6 py-4 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Top Summary Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 mb-6">
              <div>
                <span className="text-xs text-neutral-400 block">Paket yakuni</span>
                <h3 className="text-xl font-black text-white font-heading uppercase">
                  {pack.nameUz} ({players.length} ta o'yinchi)
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-neutral-400 block">Paket umumiy qiymati</span>
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold font-mono tabular-nums">
                    <Coins className="w-4 h-4" />
                    <span>+{totalPackValue.toLocaleString()} tanga</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Players Grid */}
            <div className="flex flex-wrap items-center justify-center gap-4 py-2">
              {players.map((p, idx) => (
                <div key={`${p.id}-${idx}`} className="flex flex-col items-center">
                  <PlayerCard player={p} size={idx === 0 ? 'md' : 'sm'} />
                  <span className="text-[11px] font-mono text-neutral-400 mt-1">
                    {p.value.toLocaleString()} tanga
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="pt-6 pb-2 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Quick Sell All */}
              <button
                type="button"
                onClick={() => onQuickSellAll(players, totalPackValue)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold uppercase tracking-wider border border-neutral-700 flex items-center gap-2 transition-colors"
              >
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Hammasini sotish (+{totalPackValue.toLocaleString()})</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Open Another */}
              <button
                type="button"
                disabled={coinsBalance < pack.costCoins && !pack.isFree}
                onClick={() => onOpenAnother(pack)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                  coinsBalance >= pack.costCoins || pack.isFree
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                    : 'bg-neutral-900 text-neutral-500 cursor-not-allowed border border-neutral-800'
                }`}
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Yana bitta ochish {pack.costCoins > 0 ? `(${pack.costCoins.toLocaleString()})` : ''}</span>
              </button>

              {/* Keep In Club */}
              <button
                type="button"
                onClick={() => onFinish(players)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <span>Klubga saqlash</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
