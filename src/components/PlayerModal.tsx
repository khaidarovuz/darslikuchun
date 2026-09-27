import React from 'react';
import { Player } from '../types/game';
import { PlayerCard } from './PlayerCard';
import { X, Star, Coins, Zap, Shield, Sparkles, Award } from 'lucide-react';
import { sounds } from '../utils/sound';

interface PlayerModalProps {
  player: Player | null;
  onClose: () => void;
  onQuickSell?: (player: Player) => void;
  isLocked?: boolean;
  onToggleLock?: (player: Player) => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  player,
  onClose,
  onQuickSell,
  isLocked,
  onToggleLock,
}) => {
  if (!player) return null;

  const handleSell = () => {
    if (isLocked) return;
    if (onQuickSell) {
      sounds.playCoinSound();
      onQuickSell(player);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Big Card Showcase */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-radial from-neutral-800/40 to-transparent border-b md:border-b-0 md:border-r border-neutral-800">
          <PlayerCard player={player} size="lg" isLocked={isLocked} />
          {player.celebration && (
            <div className="mt-4 px-3 py-1.5 rounded-lg bg-neutral-800/60 border border-neutral-700 text-center">
              <span className="text-xs text-neutral-400 block">Nishonlash uslubi:</span>
              <span className="text-sm font-semibold text-amber-300">{player.celebration}</span>
            </div>
          )}
        </div>

        {/* Right Side: Detailed Stats & Actions */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{player.nationFlag}</span>
              <span className="text-xs text-neutral-400 font-medium">{player.nation} · {player.league}</span>
            </div>
            <h2 className="text-2xl font-black text-white font-heading tracking-wide uppercase">
              {player.name}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-neutral-300">
              <span className="font-bold text-amber-400">{player.club}</span>
              <span>·</span>
              <span className="font-semibold text-emerald-400">{player.position}</span>
            </div>

            {/* Foot & Skill Moves */}
            <div className="grid grid-cols-2 gap-2 my-4 p-3 rounded-xl bg-neutral-900/90 border border-neutral-800">
              <div>
                <span className="text-xs text-neutral-400 block mb-1">Harakat ustaligi:</span>
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < player.skillMoves ? 'fill-amber-400' : 'text-neutral-700'}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs text-neutral-400 block mb-1">Kuchsiz oyoq:</span>
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < player.weakFoot ? 'fill-amber-400' : 'text-neutral-700'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* In-depth 6 Attributes Bars */}
            <div className="space-y-2 mb-6">
              {[
                { label: 'Tezlik (PAC)', value: player.stats.pac, icon: Zap },
                { label: 'Zarba (SHO)', value: player.stats.sho, icon: Award },
                { label: 'Uzatma (PAS)', value: player.stats.pas, icon: Sparkles },
                { label: 'Dribling (DRI)', value: player.stats.dri, icon: Zap },
                { label: 'Himoya (DEF)', value: player.stats.def, icon: Shield },
                { label: 'Jismoniy (PHY)', value: player.stats.phy, icon: Shield },
              ].map((stat) => (
                <div key={stat.label} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-neutral-400 font-medium">{stat.label}</span>
                    <span className="font-mono font-bold text-white">{stat.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        stat.value >= 90
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : stat.value >= 80
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                          : 'bg-neutral-500'
                      }`}
                      style={{ width: `${Math.min(100, (stat.value / 99) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row: Lock & Quick Sell */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-3">
            {onToggleLock && (
              <button
                type="button"
                onClick={() => onToggleLock(player)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                  isLocked
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                    : 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {isLocked ? "Qulflangan" : "Qulflash"}
              </button>
            )}

            {onQuickSell && (
              <button
                type="button"
                disabled={isLocked}
                onClick={handleSell}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors ${
                  isLocked
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-lg shadow-amber-500/20'
                }`}
              >
                <Coins className="w-4 h-4 text-black" />
                <span>Tez sotish: {player.value.toLocaleString()} tanga</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
