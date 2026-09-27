import React, { useState } from 'react';
import { Player, SbcExchange } from '../types/game';
import { SBC_CHALLENGES } from '../data/sbc';
import { PlayerCard } from './PlayerCard';
import { ArrowRight, Check, Sparkles, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { sounds } from '../utils/sound';

interface SbcViewProps {
  clubPlayers: Player[];
  onSubmitSbc: (challenge: SbcExchange, submittedPlayers: Player[]) => void;
}

export const SbcView: React.FC<SbcViewProps> = ({
  clubPlayers,
  onSubmitSbc,
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState<SbcExchange | null>(null);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

  // Open modal
  const handleOpenChallenge = (challenge: SbcExchange) => {
    sounds.playClick();
    setSelectedChallenge(challenge);
    setSelectedPlayerIds([]);
  };

  const toggleSelectPlayer = (player: Player) => {
    sounds.playClick();
    if (selectedPlayerIds.includes(player.id)) {
      setSelectedPlayerIds(selectedPlayerIds.filter((id) => id !== player.id));
    } else {
      if (selectedChallenge && selectedPlayerIds.length < selectedChallenge.requiredPlayerCount) {
        setSelectedPlayerIds([...selectedPlayerIds, player.id]);
      }
    }
  };

  const handleAutoFill = () => {
    if (!selectedChallenge) return;
    sounds.playClick();
    // Pick lowest OVR players that satisfy the requirement and are not locked
    const eligible = clubPlayers
      .filter((p) => !p.isLocked && p.ovr >= selectedChallenge.minPlayerOvr)
      .sort((a, b) => a.ovr - b.ovr)
      .slice(0, selectedChallenge.requiredPlayerCount);

    setSelectedPlayerIds(eligible.map((p) => p.id));
  };

  const handleSubmit = () => {
    if (!selectedChallenge) return;
    if (selectedPlayerIds.length !== selectedChallenge.requiredPlayerCount) return;

    const submitted = clubPlayers.filter((p) => selectedPlayerIds.includes(p.id));
    sounds.playWalkoutDrop();
    onSubmitSbc(selectedChallenge, submitted);
    setSelectedChallenge(null);
    setSelectedPlayerIds([]);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
        <h3 className="text-xl font-black text-white font-heading uppercase">
          Tarkib Yig'ish Sinovlari (SBC & Almashtirish)
        </h3>
        <p className="text-xs text-neutral-400 mt-1">
          Klubdagi ortiqcha yoki pastroq reytingli o'yinchilarni topshirib, kafolatlangan elita paketlarga ega bo'ling!
        </p>
      </div>

      {/* SBC Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SBC_CHALLENGES.map((challenge) => {
          const eligibleCount = clubPlayers.filter(
            (p) => !p.isLocked && p.ovr >= challenge.minPlayerOvr
          ).length;
          const isReady = eligibleCount >= challenge.requiredPlayerCount;

          return (
            <div
              key={challenge.id}
              className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 border border-amber-500/40 text-amber-300">
                    {challenge.badgeText}
                  </span>
                  <span className="text-xs font-mono text-neutral-400">
                    Mos o'yinchilar: {eligibleCount} ta
                  </span>
                </div>

                <h4 className="text-lg font-bold text-white mb-1">
                  {challenge.titleUz}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {challenge.descUz}
                </p>

                <div className="mt-4 p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Mukofot:</span>
                    <span className="font-bold text-emerald-400">{challenge.rewardNameUz}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Talab:</span>
                    <span className="font-bold text-white font-mono">
                      {challenge.requiredPlayerCount}x {challenge.minPlayerOvr}+ OVR
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between">
                <span className={`text-xs font-semibold ${isReady ? 'text-emerald-400' : 'text-neutral-500'}`}>
                  {isReady ? '✓ Bajarishga tayyor' : 'O\'yinchilar yetarli emas'}
                </span>

                <button
                  onClick={() => handleOpenChallenge(challenge)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <span>Almashtirish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SBC Exchange Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-xl font-black text-white font-heading uppercase">
                  {selectedChallenge.titleUz}
                </h3>
                <span className="text-xs text-neutral-400">
                  Tanlandi: <strong className="text-amber-400 font-mono">{selectedPlayerIds.length}</strong> / {selectedChallenge.requiredPlayerCount} ta o'yinchi (Kamida {selectedChallenge.minPlayerOvr}+ OVR)
                </span>
              </div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Autofill Helper */}
            <div className="py-3 flex items-center justify-between">
              <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                Topshirilgan o'yinchilar klubdan butunlay o'chiriladi!
              </span>

              <button
                onClick={handleAutoFill}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Avtomatik to'ldirish</span>
              </button>
            </div>

            {/* Selectable Players Grid */}
            <div className="flex-1 overflow-y-auto py-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {clubPlayers
                  .filter((p) => p.ovr >= selectedChallenge.minPlayerOvr && !p.isLocked)
                  .map((player) => {
                    const isSelected = selectedPlayerIds.includes(player.id);

                    return (
                      <div
                        key={player.id}
                        onClick={() => toggleSelectPlayer(player)}
                        className={`relative flex flex-col items-center p-2 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/20 scale-105 shadow-lg shadow-emerald-500/20'
                            : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1 right-1 z-20 w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <PlayerCard player={player} size="sm" />
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Footer Submit */}
            <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedChallenge(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-bold"
              >
                Bekor qilish
              </button>
              <button
                disabled={selectedPlayerIds.length !== selectedChallenge.requiredPlayerCount}
                onClick={handleSubmit}
                className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                  selectedPlayerIds.length === selectedChallenge.requiredPlayerCount
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black shadow-lg shadow-emerald-500/25'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Topshirish & Paketni ochish!</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
