import React, { useState } from 'react';
import { Player, Formation, Position } from '../types/game';
import { FORMATIONS } from '../data/formations';
import { PlayerCard } from './PlayerCard';
import { Sparkles, Trophy, Users, X, RefreshCw } from 'lucide-react';
import { sounds } from '../utils/sound';

interface SquadPitchProps {
  clubPlayers: Player[];
  squadAssignments: Record<string, Player | undefined>;
  onAssignPlayer: (slotId: string, player: Player) => void;
  onRemovePlayer: (slotId: string) => void;
  onAutoBuildBestSquad: (formation: Formation) => void;
}

export const SquadPitch: React.FC<SquadPitchProps> = ({
  clubPlayers,
  squadAssignments,
  onAssignPlayer,
  onRemovePlayer,
  onAutoBuildBestSquad,
}) => {
  const [currentFormation, setCurrentFormation] = useState<Formation>(FORMATIONS[0]);
  const [selectingSlotId, setSelectingSlotId] = useState<string | null>(null);

  // Compute Squad OVR
  const activePlayers = currentFormation.slots
    .map((s) => squadAssignments[s.slotId])
    .filter((p): p is Player => p !== undefined);

  const squadOvr = activePlayers.length > 0
    ? Math.round(activePlayers.reduce((sum, p) => sum + p.ovr, 0) / activePlayers.length)
    : 0;

  // Chemistry: matches by nation or club
  let chemistry = 0;
  if (activePlayers.length > 1) {
    let nationMatches = 0;
    let clubMatches = 0;
    for (let i = 0; i < activePlayers.length; i++) {
      for (let j = i + 1; j < activePlayers.length; j++) {
        if (activePlayers[i].nation === activePlayers[j].nation) nationMatches++;
        if (activePlayers[i].club === activePlayers[j].club) clubMatches++;
      }
    }
    chemistry = Math.min(100, Math.round((nationMatches * 8 + clubMatches * 12) + (activePlayers.length * 5)));
  }

  // Handle clicking slot to open selector
  const activeSelectingSlot = currentFormation.slots.find((s) => s.slotId === selectingSlotId);

  // Candidate players for selecting slot (not already assigned to other slots)
  const assignedPlayerIds = new Set(
    Object.entries(squadAssignments)
      .filter(([sId, p]) => sId !== selectingSlotId && p !== undefined)
      .map(([_, p]) => p!.id)
  );

  const availableForSlot = clubPlayers.filter((p) => !assignedPlayerIds.has(p.id));

  // Sort candidate list: matching position first, then OVR
  if (activeSelectingSlot) {
    availableForSlot.sort((a, b) => {
      const aMatches = a.position === activeSelectingSlot.position ? 1 : 0;
      const bMatches = b.position === activeSelectingSlot.position ? 1 : 0;
      if (aMatches !== bMatches) return bMatches - aMatches;
      return b.ovr - a.ovr;
    });
  }

  return (
    <div className="space-y-6">
      {/* Top Controls Bar: Formations, OVR, Chem, Auto Build */}
      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Squad Rating & Chem Badges */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium">Tarkib OVR:</span>
            <span className="text-3xl font-black text-amber-400 font-heading tracking-tight">
              {squadOvr}
            </span>
          </div>
          <div className="w-[1px] h-8 bg-neutral-800" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium">Kimyo (Chem):</span>
            <span className="text-3xl font-black text-emerald-400 font-heading tracking-tight">
              {chemistry}/100
            </span>
          </div>
        </div>

        {/* Formation Picker & Auto-Build */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-neutral-950 border border-neutral-800 rounded-xl">
            {FORMATIONS.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  sounds.playClick();
                  setCurrentFormation(f);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  currentFormation.id === f.id
                    ? 'bg-neutral-800 text-white border border-neutral-700'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {f.id}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onAutoBuildBestSquad(currentFormation);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black text-xs font-black uppercase tracking-wider shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Eng Kuchli Tarkib</span>
          </button>
        </div>
      </div>

      {/* The Tactical Football Pitch */}
      <div className="relative w-full max-w-4xl mx-auto h-[620px] rounded-3xl overflow-hidden border-4 border-neutral-800 shadow-2xl bg-emerald-950">
        {/* Grass Pattern & Field Markings */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-800 via-emerald-900 to-emerald-950 opacity-90" />
        
        {/* Turf Alternating Stripes */}
        <div className="absolute inset-0 flex flex-col pointer-events-none opacity-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-black' : 'bg-white'}`} />
          ))}
        </div>

        {/* Tactical Pitch Lines */}
        <div className="absolute inset-6 border-2 border-white/20 rounded-2xl pointer-events-none">
          {/* Halfway Line */}
          <div className="absolute top-1/2 inset-x-0 h-0.5 bg-white/20 -translate-y-1/2" />
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 w-36 h-36 border-2 border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
          {/* Center Spot */}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/30 rounded-full -translate-x-1/2 -translate-y-1/2" />

          {/* Top Penalty Area (Opponent Box) */}
          <div className="absolute top-0 left-1/2 w-72 h-28 border-b-2 border-x-2 border-white/20 -translate-x-1/2" />
          <div className="absolute top-0 left-1/2 w-32 h-12 border-b-2 border-x-2 border-white/20 -translate-x-1/2" />

          {/* Bottom Penalty Area (Our Box) */}
          <div className="absolute bottom-0 left-1/2 w-72 h-28 border-t-2 border-x-2 border-white/20 -translate-x-1/2" />
          <div className="absolute bottom-0 left-1/2 w-32 h-12 border-t-2 border-x-2 border-white/20 -translate-x-1/2" />
          {/* Penalty Spot */}
          <div className="absolute bottom-20 left-1/2 w-2 h-2 bg-white/30 rounded-full -translate-x-1/2" />
        </div>

        {/* 11 Players Placed on the Tactical Pitch */}
        <div className="absolute inset-0">
          {currentFormation.slots.map((slot) => {
            const player = squadAssignments[slot.slotId];

            return (
              <div
                key={slot.slotId}
                style={{
                  left: `${slot.xPercent}%`,
                  top: `${slot.yPercent}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group"
                onClick={() => {
                  sounds.playClick();
                  setSelectingSlotId(slot.slotId);
                }}
              >
                {player ? (
                  <div className="relative">
                    {/* Compact Card Avatar on Pitch */}
                    <div className="w-14 h-20 md:w-16 md:h-22 fc-card-mini-cut bg-neutral-900 border-2 border-amber-400 shadow-xl flex flex-col items-center justify-between p-1 transition-transform group-hover:scale-110">
                      <div className="w-full flex justify-between items-center text-[10px] font-heading font-black text-amber-300">
                        <span>{player.ovr}</span>
                        <span>{player.position}</span>
                      </div>
                      <span className="text-xl my-0.5">{player.nationFlag}</span>
                      <div className="w-full text-center bg-black/60 py-0.5 rounded text-[9px] font-bold text-white truncate">
                        {player.shortName}
                      </div>
                    </div>

                    {/* Quick remove button on hover */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sounds.playClick();
                        onRemovePlayer(slot.slotId);
                      }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  /* Empty Slot Disc */
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/50 border-2 border-dashed border-white/40 hover:border-amber-400 flex flex-col items-center justify-center transition-all group-hover:scale-110 backdrop-blur-xs">
                    <span className="text-xs font-black text-white/90 font-display">
                      {slot.label}
                    </span>
                    <span className="text-[9px] text-amber-400 font-bold">+ Qo'shish</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Slot Selection Modal */}
      {selectingSlotId && activeSelectingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-lg font-black text-white font-heading uppercase">
                  {activeSelectingSlot.label} Pozitsiyasiga o'yinchi tanlang
                </h3>
                <span className="text-xs text-neutral-400">
                  Klubdagi mos keluvchi barcha o'yinchilar
                </span>
              </div>
              <button
                onClick={() => setSelectingSlotId(null)}
                className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Players Grid to Select */}
            <div className="flex-1 overflow-y-auto py-4">
              {availableForSlot.length === 0 ? (
                <div className="p-8 text-center text-neutral-400 text-xs">
                  Ushbu pozitsiya uchun bo'sh o'yinchilar topilmadi. Paketlar oching!
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {availableForSlot.map((p) => {
                    const isPosMatch = p.position === activeSelectingSlot.position;

                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          sounds.playClick();
                          onAssignPlayer(selectingSlotId, p);
                          setSelectingSlotId(null);
                        }}
                        className={`flex flex-col items-center p-2 rounded-xl border cursor-pointer transition-all hover:scale-105 ${
                          isPosMatch
                            ? 'border-emerald-500/50 bg-emerald-500/5'
                            : 'border-neutral-800 bg-neutral-950/60'
                        }`}
                      >
                        <PlayerCard player={p} size="sm" />
                        <span className={`text-[10px] font-bold mt-1 ${isPosMatch ? 'text-emerald-400' : 'text-neutral-400'}`}>
                          {isPosMatch ? '✓ Mos pozitsiya' : p.position}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
