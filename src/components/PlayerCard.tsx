import React from 'react';
import { Player } from '../types/game';
import { Lock, Unlock, Star, Shield, Flame } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  onClick?: () => void;
  isLocked?: boolean;
  onToggleLock?: (e: React.MouseEvent) => void;
  isDuplicate?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  size = 'md',
  onClick,
  isLocked,
  onToggleLock,
  isDuplicate,
}) => {
  // Theme configuration based on card tier
  const getTheme = () => {
    switch (player.tier) {
      case 'toty':
        return {
          border: 'border-yellow-400/80 shadow-[0_0_25px_rgba(234,179,8,0.4)]',
          bg: 'bg-gradient-to-b from-sky-950 via-slate-900 to-blue-950 text-amber-300',
          accent: 'text-amber-400',
          badgeBg: 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-black',
          ribbon: 'TOTY 26',
          labelColor: 'text-sky-300',
          foil: 'from-amber-400/20 via-sky-400/10 to-transparent',
        };
      case 'icon':
        return {
          border: 'border-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.35)]',
          bg: 'bg-gradient-to-b from-stone-900 via-neutral-900 to-amber-950 text-amber-200',
          accent: 'text-amber-300',
          badgeBg: 'bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 text-stone-950 font-black',
          ribbon: 'PRIME ICON',
          labelColor: 'text-amber-200/80',
          foil: 'from-amber-200/25 via-white/10 to-transparent',
        };
      case 'ballon_dor':
        return {
          border: 'border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.4)]',
          bg: 'bg-gradient-to-b from-neutral-950 via-stone-900 to-amber-950 text-amber-400',
          accent: 'text-yellow-400',
          badgeBg: 'bg-amber-500 text-black font-black',
          ribbon: 'BALLON D\'OR',
          labelColor: 'text-amber-200/90',
          foil: 'from-amber-400/30 via-yellow-500/10 to-transparent',
        };
      case 'hero':
        return {
          border: 'border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.3)]',
          bg: 'bg-gradient-to-b from-red-950 via-neutral-900 to-amber-950 text-red-200',
          accent: 'text-amber-300',
          badgeBg: 'bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold',
          ribbon: 'HERO',
          labelColor: 'text-red-300',
          foil: 'from-red-500/20 via-amber-400/10 to-transparent',
        };
      case 'ucl':
        return {
          border: 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.35)]',
          bg: 'bg-gradient-to-b from-blue-950 via-slate-900 to-indigo-950 text-blue-200',
          accent: 'text-blue-300',
          badgeBg: 'bg-blue-600 text-white font-bold',
          ribbon: 'UCL RARE',
          labelColor: 'text-blue-300',
          foil: 'from-blue-400/20 via-indigo-300/10 to-transparent',
        };
      case 'gold_rare':
        return {
          border: 'border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
          bg: 'bg-gradient-to-b from-amber-950/70 via-neutral-900 to-amber-950/90 text-amber-200',
          accent: 'text-amber-400',
          badgeBg: 'bg-amber-400 text-slate-950 font-bold',
          ribbon: 'GOLD RARE',
          labelColor: 'text-amber-200/80',
          foil: 'from-amber-400/20 via-transparent to-transparent',
        };
      case 'gold_common':
        return {
          border: 'border-amber-600/40',
          bg: 'bg-gradient-to-b from-amber-950/40 via-neutral-900 to-neutral-950 text-amber-100',
          accent: 'text-amber-400',
          badgeBg: 'bg-amber-600 text-white font-medium',
          ribbon: 'GOLD',
          labelColor: 'text-stone-300',
          foil: 'from-amber-600/10 via-transparent to-transparent',
        };
      case 'silver':
        return {
          border: 'border-slate-400/50',
          bg: 'bg-gradient-to-b from-slate-800 via-neutral-900 to-slate-900 text-slate-200',
          accent: 'text-slate-300',
          badgeBg: 'bg-slate-400 text-slate-950 font-semibold',
          ribbon: 'SILVER',
          labelColor: 'text-slate-400',
          foil: 'from-slate-400/10 via-transparent to-transparent',
        };
      default:
        return {
          border: 'border-amber-800/50',
          bg: 'bg-gradient-to-b from-stone-800 via-neutral-900 to-stone-900 text-stone-200',
          accent: 'text-amber-600',
          badgeBg: 'bg-amber-800 text-stone-100 font-semibold',
          ribbon: 'BRONZE',
          labelColor: 'text-stone-400',
          foil: 'from-amber-800/10 via-transparent to-transparent',
        };
    }
  };

  const theme = getTheme();

  // Size styles
  const sizeClasses = {
    sm: 'w-28 h-40 text-[10px]',
    md: 'w-44 h-64 text-xs',
    lg: 'w-56 h-80 text-sm',
    hero: 'w-72 h-[410px] text-base',
  }[size];

  const ovrSizeClasses = {
    sm: 'text-xl leading-none font-bold',
    md: 'text-3xl leading-none font-extrabold',
    lg: 'text-4xl leading-none font-black',
    hero: 'text-6xl leading-none font-black',
  }[size];

  const nameSizeClasses = {
    sm: 'text-[11px] font-bold',
    md: 'text-sm font-bold',
    lg: 'text-base font-extrabold',
    hero: 'text-xl font-black tracking-wide',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`relative select-none ${sizeClasses} cursor-pointer transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98] group`}
    >
      {/* Outer Glow container with FC angled cut */}
      <div
        className={`w-full h-full fc-card-cut relative overflow-hidden border-2 ${theme.border} ${theme.bg} flex flex-col justify-between p-2.5 backdrop-blur-md`}
      >
        {/* Shimmer light sweep */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${theme.foil} animate-fc-shimmer pointer-events-none opacity-80`}
        />

        {/* Top Badges / Duplicate / Lock */}
        <div className="relative z-10 flex justify-between items-start">
          {/* OVR, Position, Nation, Club Crest */}
          <div className="flex flex-col items-center">
            <span className={`${ovrSizeClasses} font-heading tracking-tighter ${theme.accent}`}>
              {player.ovr}
            </span>
            <span className="font-bold uppercase tracking-wider text-[11px] -mt-1 font-display">
              {player.position}
            </span>
            <div className="w-5 h-[1px] bg-white/20 my-1" />
            <span className="text-base my-0.5" title={player.nation}>
              {player.nationFlag}
            </span>
            {/* Club Monogram Shield */}
            <div
              className="w-5 h-5 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-[8px] font-black uppercase text-white/90"
              title={player.club}
            >
              {player.club.slice(0, 2)}
            </div>
          </div>

          {/* Top Right: Special Tier Badge or Lock Toggle */}
          <div className="flex flex-col items-end gap-1">
            {onToggleLock && (
              <button
                type="button"
                onClick={onToggleLock}
                className="p-1 rounded-full bg-black/40 hover:bg-black/80 text-white/80 transition-colors"
                title={isLocked ? "Qulflangan (Sotilmaydi)" : "Qulflash"}
              >
                {isLocked ? (
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Unlock className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                )}
              </button>
            )}

            {isDuplicate && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-600 text-white uppercase tracking-wider shadow">
                NUSXA
              </span>
            )}

            {/* Special Tier Ribbon */}
            <span className={`px-1.5 py-0.5 rounded text-[8px] tracking-wider uppercase ${theme.badgeBg}`}>
              {theme.ribbon}
            </span>
          </div>
        </div>

        {/* Center: Stylized Player Silhouette / Graphic */}
        <div className="relative z-0 flex-1 flex items-center justify-center my-0.5">
          <div className="relative flex flex-col items-center justify-center">
            {/* Decorative background crest aura */}
            <div className="absolute w-20 h-20 rounded-full bg-white/5 blur-md" />
            
            {/* Player Avatar representation with squad jersey styling */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-b from-white/10 to-black/60 border border-white/20 flex flex-col items-center justify-center shadow-inner overflow-hidden">
              {player.tier === 'icon' ? (
                <Shield className="w-8 h-8 text-amber-300 drop-shadow" />
              ) : player.tier === 'toty' ? (
                <Flame className="w-8 h-8 text-sky-400 drop-shadow" />
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 mb-0.5" />
                  <div className="w-10 h-6 rounded-t-lg bg-white/15" />
                </div>
              )}
              {/* Star Rating for high tier */}
              {player.ovr >= 95 && (
                <div className="absolute bottom-1 flex gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Player Name & 6 Face Stats */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Player Name Banner */}
          <div className="w-full text-center py-0.5 border-t border-b border-white/15 bg-black/30 backdrop-blur-xs">
            <h4 className={`${nameSizeClasses} uppercase tracking-wider truncate px-1 text-white font-heading`}>
              {player.shortName}
            </h4>
          </div>

          {/* 6 Face Stats (PAC, SHO, PAS, DRI, DEF, PHY) */}
          {size !== 'sm' && (
            <div className="w-full grid grid-cols-2 gap-x-2 gap-y-0.5 mt-1.5 px-1 font-mono tabular-nums text-[10px] md:text-[11px]">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">{player.stats.pac}</span>
                <span className={`text-[9px] uppercase ${theme.labelColor}`}>PAC</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">{player.stats.dri}</span>
                <span className={`text-[9px] uppercase ${theme.labelColor}`}>DRI</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">{player.stats.sho}</span>
                <span className={`text-[9px] uppercase ${theme.labelColor}`}>SHO</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">{player.stats.def}</span>
                <span className={`text-[9px] uppercase ${theme.labelColor}`}>DEF</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">{player.stats.pas}</span>
                <span className={`text-[9px] uppercase ${theme.labelColor}`}>PAS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">{player.stats.phy}</span>
                <span className={`text-[9px] uppercase ${theme.labelColor}`}>PHY</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
