import React, { useState } from 'react';
import { Pack } from '../types/game';
import { STORE_PACKS } from '../data/packs';
import { Coins, Gem, Sparkles, Info, Clock, CheckCircle2, Shield, Flame } from 'lucide-react';
import { sounds } from '../utils/sound';

interface StoreViewProps {
  coins: number;
  gems: number;
  onOpenPack: (pack: Pack, currency: 'coins' | 'gems') => void;
  freePackCooldown: number; // seconds left
}

export const StoreView: React.FC<StoreViewProps> = ({
  coins,
  gems,
  onOpenPack,
  freePackCooldown,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'promo' | 'gold' | 'special'>('all');
  const [selectedPackOdds, setSelectedPackOdds] = useState<Pack | null>(null);

  const filteredPacks = STORE_PACKS.filter((p) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'promo') return p.category === 'promo';
    if (activeCategory === 'gold') return p.category === 'gold';
    if (activeCategory === 'special') return p.category === 'special' || p.category === 'free';
    return true;
  });

  const handleBuyWithCoins = (pack: Pack) => {
    if (pack.isFree) {
      if (freePackCooldown > 0) return;
      sounds.playClick();
      onOpenPack(pack, 'coins');
      return;
    }
    if (coins < pack.costCoins) return;
    sounds.playClick();
    onOpenPack(pack, 'coins');
  };

  const handleBuyWithGems = (pack: Pack) => {
    if (gems < pack.costGems) return;
    sounds.playClick();
    onOpenPack(pack, 'gems');
  };

  return (
    <div className="space-y-6">
      {/* Category Segmented Control & Promo Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
          {[
            { id: 'all', label: 'Barcha Paketlar' },
            { id: 'promo', label: '⭐ TOTY & Afsonalar' },
            { id: 'gold', label: 'Oltin Paketlar' },
            { id: 'special', label: 'Maxsus & Bepul' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sounds.playClick();
                setActiveCategory(cat.id as any);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Free Pack Ready Alert / Quick Claim */}
        {freePackCooldown === 0 ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Kunlik bepul paket tayyor!</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            <span>Keyingi bepul paket: <strong className="text-white font-mono">{freePackCooldown}s</strong></span>
          </div>
        )}
      </div>

      {/* Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredPacks.map((pack) => {
          const canAffordCoins = coins >= pack.costCoins;
          const canAffordGems = gems >= pack.costGems;
          const isFreeReady = pack.isFree && freePackCooldown === 0;

          return (
            <div
              key={pack.id}
              className="relative rounded-2xl bg-neutral-900/90 border border-neutral-800 overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition-all duration-200 group"
            >
              {/* Top Graphic Card Header */}
              <div
                className={`relative h-44 p-4 bg-gradient-to-b ${pack.bgGradient} flex flex-col justify-between overflow-hidden`}
              >
                {/* Diagonal light texture */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

                {/* Top Row: Tag & Odds Info */}
                <div className="relative z-10 flex justify-between items-start">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-black/40 text-white backdrop-blur-md border border-white/10">
                    {pack.tag || 'FC PACK'}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedPackOdds(pack)}
                    className="p-1 rounded-full bg-black/40 hover:bg-black/80 text-white/80 transition-colors"
                    title="Ehtimolliklar (Odds)"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Center Pack Icon & Title */}
                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/20 flex items-center justify-center shadow-lg">
                    {pack.category === 'promo' ? (
                      <Flame className="w-6 h-6 text-amber-400" />
                    ) : (
                      <Shield className="w-6 h-6 text-sky-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white font-heading uppercase tracking-wide leading-tight">
                      {pack.nameUz}
                    </h3>
                    <span className="text-[11px] text-neutral-300 font-medium">
                      {pack.cardCount} ta o'yinchi
                    </span>
                  </div>
                </div>

                {/* Bottom Guaranteed strip */}
                <div className="relative z-10 text-[11px] font-bold text-amber-300">
                  {pack.guaranteedMinOvr ? `${pack.guaranteedMinOvr}+ OVR Kafolatlangan` : 'Nodir o\'yinchilar'}
                </div>
              </div>

              {/* Pack Body Description */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  {pack.descriptionUz}
                </p>

                {/* Buying Controls */}
                <div className="space-y-2 pt-2 border-t border-neutral-800">
                  {pack.isFree ? (
                    <button
                      type="button"
                      disabled={freePackCooldown > 0}
                      onClick={() => handleBuyWithCoins(pack)}
                      className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                        isFreeReady
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black shadow-lg shadow-emerald-500/20'
                          : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isFreeReady ? 'BEPUL OCHISH!' : `Kuting: ${freePackCooldown}s`}</span>
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {/* Coins Option */}
                      <button
                        type="button"
                        disabled={!canAffordCoins}
                        onClick={() => handleBuyWithCoins(pack)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          canAffordCoins
                            ? 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                            : 'bg-neutral-900/60 text-neutral-500 border border-neutral-800 cursor-not-allowed'
                        }`}
                      >
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-mono">{pack.costCoins.toLocaleString()}</span>
                      </button>

                      {/* Gems Option */}
                      <button
                        type="button"
                        disabled={!canAffordGems}
                        onClick={() => handleBuyWithGems(pack)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          canAffordGems
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-sm'
                            : 'bg-neutral-900/60 text-neutral-500 border border-neutral-800 cursor-not-allowed'
                        }`}
                      >
                        <Gem className="w-3.5 h-3.5 text-cyan-300" />
                        <span className="font-mono">{pack.costGems}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pack Drop Odds Modal */}
      {selectedPackOdds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-black text-white font-heading uppercase">
                  {selectedPackOdds.nameUz}
                </h3>
                <span className="text-xs text-neutral-400">Rasmiy ehtimolliklar (Odds)</span>
              </div>
              <button
                onClick={() => setSelectedPackOdds(null)}
                className="text-neutral-400 hover:text-white text-xs font-bold px-2 py-1 rounded bg-neutral-800"
              >
                Yopish
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-300 font-sans">Oltin o'yinchi (75+):</span>
                <span className="font-bold text-amber-400">{selectedPackOdds.odds.gold}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-300 font-sans">Elita o'yinchi (85+):</span>
                <span className="font-bold text-amber-400">{selectedPackOdds.odds.elite85}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-300 font-sans">Walkout (88+):</span>
                <span className="font-bold text-emerald-400">{selectedPackOdds.odds.walkout88}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-300 font-sans">TOTY yoki Prime Icon:</span>
                <span className="font-bold text-cyan-400">{selectedPackOdds.odds.totyOrIcon}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 text-[11px] text-neutral-400 text-center">
              Barcha paketlar tasodifiy sonlar generatori (RNG) orqali adolatli ochiladi.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
