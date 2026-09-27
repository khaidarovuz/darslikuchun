import React, { useState } from 'react';
import { Player } from '../types/game';
import { PlayerCard } from './PlayerCard';
import { Search, Trophy, Coins, Trash2, SlidersHorizontal, Sparkles } from 'lucide-react';
import { sounds } from '../utils/sound';

interface ClubViewProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  onQuickSellPlayer: (player: Player) => void;
  onToggleLock: (player: Player) => void;
  onQuickSellDuplicates: () => void;
}

export const ClubView: React.FC<ClubViewProps> = ({
  players,
  onSelectPlayer,
  onQuickSellPlayer,
  onToggleLock,
  onQuickSellDuplicates,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'ovr' | 'value' | 'recent'>('ovr');

  // Find duplicates count
  const playerIdsCount = players.reduce<Record<string, number>>((acc, p) => {
    acc[p.id] = (acc[p.id] || 0) + 1;
    return acc;
  }, {});
  const duplicateCount = Object.values(playerIdsCount).reduce((acc, count) => acc + (count > 1 ? count - 1 : 0), 0);

  // Filter & Sort
  const filteredPlayers = players.filter((p) => {
    // Search
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q) || p.shortName.toLowerCase().includes(q);
      const matchClub = p.club.toLowerCase().includes(q);
      const matchNation = p.nation.toLowerCase().includes(q);
      if (!matchName && !matchClub && !matchNation) return false;
    }

    // Position
    if (positionFilter === 'att' && !['ST', 'LW', 'RW'].includes(p.position)) return false;
    if (positionFilter === 'mid' && !['CAM', 'CM', 'CDM'].includes(p.position)) return false;
    if (positionFilter === 'def' && !['CB', 'LB', 'RB'].includes(p.position)) return false;
    if (positionFilter === 'gk' && p.position !== 'GK') return false;

    // Tier
    if (tierFilter !== 'all' && p.tier !== tierFilter) return false;

    return true;
  });

  filteredPlayers.sort((a, b) => {
    if (sortBy === 'ovr') return b.ovr - a.ovr;
    if (sortBy === 'value') return b.value - a.value;
    if (sortBy === 'recent') return (b.acquiredAt || 0) - (a.acquiredAt || 0);
    return 0;
  });

  const totalClubValue = players.reduce((sum, p) => sum + p.value, 0);
  const highestOvrPlayer = players.reduce<Player | null>((best, p) => {
    if (!best || p.ovr > best.ovr) return p;
    return best;
  }, null);

  return (
    <div className="space-y-6">
      {/* Club Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Players */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 block">Jami O'yinchilar</span>
            <span className="text-2xl font-black text-white font-mono tabular-nums">
              {players.length} ta
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

        {/* Club Market Value */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 block">Klub Umumiy Qiymati</span>
            <span className="text-2xl font-black text-amber-400 font-mono tabular-nums">
              {totalClubValue.toLocaleString()} tanga
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-amber-400">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        {/* Top Star */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 block">Eng Kuchli O'yinchi</span>
            <span className="text-xl font-black text-emerald-400 font-heading tracking-wide uppercase truncate block">
              {highestOvrPlayer ? `${highestOvrPlayer.shortName} (${highestOvrPlayer.ovr})` : 'Mavjud emas'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="O'yinchi, klub yoki davlat nomini qidiring..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Position Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Barchasi' },
            { id: 'att', label: 'Hujum' },
            { id: 'mid', label: 'Yarim himoya' },
            { id: 'def', label: 'Himoya' },
            { id: 'gk', label: 'Darvozabon' },
          ].map((pos) => (
            <button
              key={pos.id}
              onClick={() => {
                sounds.playClick();
                setPositionFilter(pos.id);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                positionFilter === pos.id
                  ? 'bg-neutral-800 text-amber-400 border border-neutral-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {pos.label}
            </button>
          ))}
        </div>

        {/* Tier & Sort Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Tier select */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Barcha Turlar</option>
            <option value="toty">⭐ TOTY</option>
            <option value="icon">👑 Prime Icon</option>
            <option value="ballon_dor">🏆 Ballon d'Or</option>
            <option value="hero">🦸 Hero</option>
            <option value="ucl">⚽ UCL Rare</option>
            <option value="gold_rare">🥇 Gold Rare</option>
            <option value="gold_common">🟡 Gold Common</option>
            <option value="silver">🥈 Silver</option>
            <option value="bronze">🥉 Bronze</option>
          </select>

          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:outline-none focus:border-amber-500"
          >
            <option value="ovr">Reyting bo'yicha</option>
            <option value="value">Qiymat bo'yicha</option>
            <option value="recent">Eng yangi</option>
          </select>
        </div>
      </div>

      {/* Duplicates Quick Action Bar */}
      {duplicateCount > 0 && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-300">
            <span className="font-bold">Klubda {duplicateCount} ta nusxa (dublikat) o'yinchi bor!</span>
          </div>
          <button
            onClick={() => {
              sounds.playCoinSound();
              onQuickSellDuplicates();
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Nusxalarni avtomatik sotish</span>
          </button>
        </div>
      )}

      {/* Cards Showcase Grid */}
      {filteredPlayers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-neutral-900 border border-neutral-800">
          <SlidersHorizontal className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-neutral-300">O'yinchilar topilmadi</h4>
          <p className="text-xs text-neutral-500 mt-1">
            Qidiruv so'zini o'zgartiring yoki yangi paketlar oching!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredPlayers.map((player, index) => {
            const isDup = playerIdsCount[player.id] > 1;

            return (
              <div
                key={`${player.id}-${player.acquiredAt || index}`}
                className="flex flex-col items-center"
              >
                <PlayerCard
                  player={player}
                  size="md"
                  isLocked={player.isLocked}
                  isDuplicate={isDup}
                  onClick={() => onSelectPlayer(player)}
                  onToggleLock={(e) => {
                    e.stopPropagation();
                    sounds.playClick();
                    onToggleLock(player);
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
