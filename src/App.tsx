/**
 * FC Mobile Pack Simulator
 * Built for thrilling pack openings, walkouts, squad building, and club management.
 */

import React, { useState, useEffect } from 'react';
import { Player, Pack, SbcExchange, Formation } from './types/game';
import { STORE_PACKS, generatePackOpening } from './data/packs';
import { PLAYERS_DATABASE } from './data/players';
import { FORMATIONS } from './data/formations';
import { StoreView } from './components/StoreView';
import { ClubView } from './components/ClubView';
import { SquadPitch } from './components/SquadPitch';
import { SbcView } from './components/SbcView';
import { PackAnimation } from './components/PackAnimation';
import { PlayerModal } from './components/PlayerModal';
import { sounds } from './utils/sound';
import { Coins, Gem, Volume2, VolumeX, PlusCircle, Trophy } from 'lucide-react';

const STORAGE_KEY_PLAYERS = 'fcmobile_club_players_v2';
const STORAGE_KEY_COINS = 'fcmobile_coins_v2';
const STORAGE_KEY_GEMS = 'fcmobile_gems_v2';
const STORAGE_KEY_SQUAD = 'fcmobile_squad_v2';
const STORAGE_KEY_LAST_FREE = 'fcmobile_last_free_v2';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'store' | 'club' | 'squad' | 'sbc'>('store');

  // Currencies
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_COINS);
    return saved ? parseInt(saved, 10) : 350000; // 350k initial balance for exciting start
  });

  const [gems, setGems] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_GEMS);
    return saved ? parseInt(saved, 10) : 1800; // 1800 initial gems
  });

  // Club players collection
  const [clubPlayers, setClubPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PLAYERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Give initial starter squad cards
    return PLAYERS_DATABASE.slice(10, 25).map((p) => ({
      ...p,
      acquiredAt: Date.now(),
    }));
  });

  // Squad assignments
  const [squadAssignments, setSquadAssignments] = useState<Record<string, Player | undefined>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SQUAD);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {};
  });

  // Free pack cooldown
  const [freePackCooldown, setFreePackCooldown] = useState<number>(0);

  // Active pack opening session
  const [activePackOpening, setActivePackOpening] = useState<{
    pack: Pack;
    players: Player[];
  } | null>(null);

  // Selected player for detail modal
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Sound mute state
  const [isMuted, setIsMuted] = useState<boolean>(() => sounds.getMuted());

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COINS, String(coins));
  }, [coins]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GEMS, String(gems));
  }, [gems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(clubPlayers));
  }, [clubPlayers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SQUAD, JSON.stringify(squadAssignments));
  }, [squadAssignments]);

  // Cooldown countdown timer
  useEffect(() => {
    const checkCooldown = () => {
      const last = localStorage.getItem(STORAGE_KEY_LAST_FREE);
      if (!last) {
        setFreePackCooldown(0);
        return;
      }
      const elapsed = Math.floor((Date.now() - parseInt(last, 10)) / 1000);
      const remaining = Math.max(0, 60 - elapsed);
      setFreePackCooldown(remaining);
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Open Pack trigger
  const handleOpenPack = (pack: Pack, currency: 'coins' | 'gems') => {
    if (pack.isFree) {
      localStorage.setItem(STORAGE_KEY_LAST_FREE, String(Date.now()));
      setFreePackCooldown(60);
    } else if (currency === 'coins') {
      if (coins < pack.costCoins) return;
      setCoins((c) => Math.max(0, c - pack.costCoins));
    } else {
      if (gems < pack.costGems) return;
      setGems((g) => Math.max(0, g - pack.costGems));
    }

    const generated = generatePackOpening(pack);
    setActivePackOpening({
      pack,
      players: generated,
    });
  };

  // Pack finish (keep in club)
  const handleFinishPackOpening = (newPlayers: Player[]) => {
    setClubPlayers((prev) => [...newPlayers, ...prev]);
    setActivePackOpening(null);
    sounds.playCoinSound();
  };

  // Pack finish (quick sell all)
  const handleQuickSellAll = (players: Player[], totalValue: number) => {
    setCoins((c) => c + totalValue);
    setActivePackOpening(null);
    sounds.playCoinSound();
  };

  // Quick sell single player from club
  const handleQuickSellPlayer = (player: Player) => {
    setClubPlayers((prev) => prev.filter((p) => p.acquiredAt !== player.acquiredAt || p.id !== player.id));
    setCoins((c) => c + player.value);
    // remove from squad if present
    setSquadAssignments((prev) => {
      const copy = { ...prev };
      for (const key of Object.keys(copy)) {
        if (copy[key]?.id === player.id) {
          delete copy[key];
        }
      }
      return copy;
    });
  };

  // Quick sell all duplicates
  const handleQuickSellDuplicates = () => {
    const seen = new Set<string>();
    const keep: Player[] = [];
    let soldCoins = 0;

    for (const p of clubPlayers) {
      if (!seen.has(p.id) || p.isLocked) {
        seen.add(p.id);
        keep.push(p);
      } else {
        soldCoins += p.value;
      }
    }

    setClubPlayers(keep);
    setCoins((c) => c + soldCoins);
  };

  // Toggle card lock
  const handleToggleLock = (player: Player) => {
    setClubPlayers((prev) =>
      prev.map((p) => (p.id === player.id ? { ...p, isLocked: !p.isLocked } : p))
    );
    if (selectedPlayer && selectedPlayer.id === player.id) {
      setSelectedPlayer({ ...selectedPlayer, isLocked: !selectedPlayer.isLocked });
    }
  };

  // Squad assignment
  const handleAssignSquadPlayer = (slotId: string, player: Player) => {
    setSquadAssignments((prev) => ({
      ...prev,
      [slotId]: player,
    }));
  };

  const handleRemoveSquadPlayer = (slotId: string) => {
    setSquadAssignments((prev) => {
      const copy = { ...prev };
      delete copy[slotId];
      return copy;
    });
  };

  // Auto-build best squad
  const handleAutoBuildBestSquad = (formation: Formation) => {
    const assignments: Record<string, Player | undefined> = {};
    const usedIds = new Set<string>();

    formation.slots.forEach((slot) => {
      // Find highest OVR player matching exact position
      const exactMatch = clubPlayers
        .filter((p) => p.position === slot.position && !usedIds.has(p.id))
        .sort((a, b) => b.ovr - a.ovr)[0];

      if (exactMatch) {
        assignments[slot.slotId] = exactMatch;
        usedIds.add(exactMatch.id);
      } else {
        // Any highest OVR player remaining
        const bestAvailable = clubPlayers
          .filter((p) => !usedIds.has(p.id))
          .sort((a, b) => b.ovr - a.ovr)[0];

        if (bestAvailable) {
          assignments[slot.slotId] = bestAvailable;
          usedIds.add(bestAvailable.id);
        }
      }
    });

    setSquadAssignments(assignments);
  };

  // SBC Submission
  const handleSubmitSbc = (challenge: SbcExchange, submittedPlayers: Player[]) => {
    const submittedIds = new Set(submittedPlayers.map((p) => p.id));
    setClubPlayers((prev) => prev.filter((p) => !submittedIds.has(p.id)));

    // Reward pack
    const rewardPack = STORE_PACKS.find((p) => p.id === challenge.rewardPackId) || STORE_PACKS[1];
    const generated = generatePackOpening(rewardPack);
    setActivePackOpening({
      pack: rewardPack,
      players: generated,
    });
  };

  // Toggle sound
  const handleToggleSound = () => {
    const newMuted = sounds.toggleMute();
    setIsMuted(newMuted);
  };

  // Bonus coins gift button
  const handleAddBonusCoins = () => {
    sounds.playCoinSound();
    setCoins((c) => c + 250000);
    setGems((g) => g + 1000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* TOP BAR CONTRACT: [Brand Title] — [4 Nav Links] — [Primary Actions] */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 border-b border-neutral-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-white font-heading uppercase flex items-center gap-1.5">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>FC Mobile Packs</span>
            </span>
          </div>

          {/* Zone 2: Clean 4 Nav Links (Single-line) */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'store', label: 'Do\'kon' },
              { id: 'club', label: `Klubim (${clubPlayers.length})` },
              { id: 'squad', label: 'Tarkib' },
              { id: 'sbc', label: 'Almashtirish (SBC)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-neutral-800 text-amber-400 border border-neutral-700'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1-2 Primary Actions (Currencies & Audio) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Coins */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono font-bold text-amber-400 tabular-nums cursor-pointer hover:border-amber-500/50 transition-colors"
              onClick={handleAddBonusCoins}
              title="Bonus tangalar olish uchun bosing!"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>{coins.toLocaleString()}</span>
              <PlusCircle className="w-3 h-3 text-amber-500 opacity-60" />
            </div>

            {/* Gems */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono font-bold text-cyan-400 tabular-nums"
            >
              <Gem className="w-3.5 h-3.5" />
              <span>{gems.toLocaleString()}</span>
            </div>

            {/* Mute Button */}
            <button
              type="button"
              onClick={handleToggleSound}
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title={isMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'store' && (
          <StoreView
            coins={coins}
            gems={gems}
            onOpenPack={handleOpenPack}
            freePackCooldown={freePackCooldown}
          />
        )}

        {activeTab === 'club' && (
          <ClubView
            players={clubPlayers}
            onSelectPlayer={(player) => setSelectedPlayer(player)}
            onQuickSellPlayer={handleQuickSellPlayer}
            onToggleLock={handleToggleLock}
            onQuickSellDuplicates={handleQuickSellDuplicates}
          />
        )}

        {activeTab === 'squad' && (
          <SquadPitch
            clubPlayers={clubPlayers}
            squadAssignments={squadAssignments}
            onAssignPlayer={handleAssignSquadPlayer}
            onRemovePlayer={handleRemoveSquadPlayer}
            onAutoBuildBestSquad={handleAutoBuildBestSquad}
          />
        )}

        {activeTab === 'sbc' && (
          <SbcView
            clubPlayers={clubPlayers}
            onSubmitSbc={handleSubmitSbc}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-4 text-center text-xs text-neutral-500">
        FC Mobile Pack Simulator · Pelé, Messi, Mbappé, Ronaldo, Fayzullaev & Shomurodov
      </footer>

      {/* Active Pack Opening Animation Screen */}
      {activePackOpening && (
        <PackAnimation
          pack={activePackOpening.pack}
          players={activePackOpening.players}
          onFinish={handleFinishPackOpening}
          onOpenAnother={(pack) => handleOpenPack(pack, 'coins')}
          onQuickSellAll={handleQuickSellAll}
          coinsBalance={coins}
        />
      )}

      {/* Player Bio & Stats Modal */}
      {selectedPlayer && (
        <PlayerModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onQuickSell={handleQuickSellPlayer}
          isLocked={selectedPlayer.isLocked}
          onToggleLock={handleToggleLock}
        />
      )}
    </div>
  );
}
