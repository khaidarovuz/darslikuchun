import { Pack, Player } from '../types/game';
import { PLAYERS_DATABASE } from './players';

export const STORE_PACKS: Pack[] = [
  {
    id: 'free-daily',
    name: 'Daily Free Pack',
    nameUz: 'Kunlik Bepul Paket',
    category: 'free',
    tag: 'BEPUL',
    descriptionUz: 'Har 1 soatda bepul ochish imkoniyati! 3 ta o\'yinchi, 1 ta 78+ kafolatlangan.',
    costCoins: 0,
    costGems: 0,
    cardCount: 3,
    minOvr: 74,
    guaranteedMinOvr: 78,
    guaranteedCount: 1,
    isFree: true,
    cooldownSeconds: 60, // 60s for fun testing/continuous play
    odds: {
      gold: '100%',
      elite85: '12%',
      walkout88: '3.5%',
      totyOrIcon: '0.8%',
    },
    accentColor: '#10B981',
    bgGradient: 'from-emerald-950 via-slate-900 to-emerald-900',
  },
  {
    id: 'gold-standard',
    name: 'Gold Pack',
    nameUz: 'Standart Oltin Paket',
    category: 'gold',
    tag: 'STANDART',
    descriptionUz: 'Klubingiz uchun poydevor! 5 ta o\'yinchi, kamida bitta 80+ OVR.',
    costCoins: 15000,
    costGems: 50,
    cardCount: 5,
    minOvr: 76,
    guaranteedMinOvr: 81,
    guaranteedCount: 1,
    odds: {
      gold: '100%',
      elite85: '25%',
      walkout88: '6.2%',
      totyOrIcon: '1.5%',
    },
    accentColor: '#F59E0B',
    bgGradient: 'from-amber-950 via-slate-900 to-amber-900',
  },
  {
    id: 'jumbo-rare',
    name: 'Jumbo Rare Players',
    nameUz: 'Jumbo Nodir O\'yinchilar',
    category: 'gold',
    tag: 'OMMABOP',
    descriptionUz: '8 ta nodir o\'yinchi. 2 ta kafolatlangan 84+ elita kartalar!',
    costCoins: 65000,
    costGems: 200,
    cardCount: 8,
    minOvr: 80,
    guaranteedMinOvr: 84,
    guaranteedCount: 2,
    odds: {
      gold: '100%',
      elite85: '55%',
      walkout88: '18%',
      totyOrIcon: '4.5%',
    },
    accentColor: '#3B82F6',
    bgGradient: 'from-blue-950 via-slate-900 to-blue-900',
  },
  {
    id: 'uzbek-heroes',
    name: 'Uzbekistan Heroes Pack',
    nameUz: 'O\'zbekiston Qahramonlari',
    category: 'special',
    tag: 'MAXSUS UZB',
    descriptionUz: 'Fayzullaev, Shomurodov, Ahmedov va jahon yulduzlari! Katta yutuq imkoniyati.',
    costCoins: 150000,
    costGems: 450,
    cardCount: 5,
    minOvr: 82,
    guaranteedMinOvr: 88,
    guaranteedCount: 1,
    odds: {
      gold: '100%',
      elite85: '85%',
      walkout88: '40%',
      totyOrIcon: '10%',
    },
    accentColor: '#06B6D4',
    bgGradient: 'from-cyan-950 via-slate-900 to-emerald-950',
  },
  {
    id: 'elite-85-plus',
    name: '85+ x5 Elite Pack',
    nameUz: '85+ x5 Elita Paketi',
    category: 'special',
    tag: 'ELITA',
    descriptionUz: 'Barcha 5 ta o\'yinchi 85 va undan yuqori reytingga ega bo\'ladi!',
    costCoins: 220000,
    costGems: 650,
    cardCount: 5,
    minOvr: 85,
    guaranteedMinOvr: 87,
    guaranteedCount: 2,
    odds: {
      gold: '100%',
      elite85: '100%',
      walkout88: '50%',
      totyOrIcon: '15%',
    },
    accentColor: '#8B5CF6',
    bgGradient: 'from-purple-950 via-slate-900 to-indigo-950',
  },
  {
    id: 'ucl-champions',
    name: 'UCL Champions Pack',
    nameUz: 'UCL Yulduzlar Paketi',
    category: 'promo',
    tag: 'CHEAMPIYONLAR',
    descriptionUz: 'UCL Yulduzlari: Yamal, Wirtz, Kane, Salah va boshqalar! 1x 89+ kafolatlangan.',
    costCoins: 350000,
    costGems: 1000,
    cardCount: 6,
    minOvr: 84,
    guaranteedMinOvr: 89,
    guaranteedCount: 1,
    odds: {
      gold: '100%',
      elite85: '100%',
      walkout88: '75%',
      totyOrIcon: '25%',
    },
    accentColor: '#2563EB',
    bgGradient: 'from-blue-900 via-indigo-950 to-slate-950',
  },
  {
    id: 'toty-ultimate',
    name: 'TOTY Ultimate Pack',
    nameUz: 'TOTY Ultimate Paketi',
    category: 'promo',
    tag: 'TOTY 97+',
    descriptionUz: 'Yil jamoasi! Messi 99, Mbappé 98, Haaland 98, Vini Jr 98 olish uchun eng zo\'r paket.',
    costCoins: 600000,
    costGems: 1800,
    cardCount: 8,
    minOvr: 85,
    guaranteedMinOvr: 90,
    guaranteedCount: 2,
    odds: {
      gold: '100%',
      elite85: '100%',
      walkout88: '90%',
      totyOrIcon: '45%',
    },
    accentColor: '#EAB308',
    bgGradient: 'from-amber-900 via-cyan-950 to-slate-950',
  },
  {
    id: 'prime-icon-guaranteed',
    name: 'Prime Icon Walkout',
    nameUz: 'Afsonaviy ICON Walkout',
    category: 'promo',
    tag: 'KAFOLATLANGAN ICON',
    descriptionUz: 'Pelé, Maradona, Zidane, R9, Maldini yoki Yashin! Kafolatlangan 94+ ICON o\'yinchisi.',
    costCoins: 1200000,
    costGems: 3500,
    cardCount: 6,
    minOvr: 86,
    guaranteedMinOvr: 94,
    guaranteedCount: 1,
    odds: {
      gold: '100%',
      elite85: '100%',
      walkout88: '100%',
      totyOrIcon: '100%',
    },
    accentColor: '#E2E8F0',
    bgGradient: 'from-slate-800 via-amber-950 to-neutral-950',
  },
];

/**
 * Open a pack and generate a list of players following realistic FC Mobile odds
 */
export function generatePackOpening(pack: Pack): Player[] {
  const result: Player[] = [];
  const db = [...PLAYERS_DATABASE];

  // Specific pack overrides
  if (pack.id === 'prime-icon-guaranteed') {
    const icons = db.filter((p) => p.tier === 'icon' && p.ovr >= 94);
    const guaranteedIcon = icons[Math.floor(Math.random() * icons.length)];
    result.push({ ...guaranteedIcon, acquiredAt: Date.now() });

    // fill remaining with 86+ players
    const othersPool = db.filter((p) => p.id !== guaranteedIcon.id && p.ovr >= 85);
    for (let i = 1; i < pack.cardCount; i++) {
      const p = othersPool[Math.floor(Math.random() * othersPool.length)];
      result.push({ ...p, acquiredAt: Date.now() + i });
    }
    return result;
  }

  if (pack.id === 'uzbek-heroes') {
    // High chance of an Uzbek star in slot 1
    const uzbPool = db.filter((p) => p.nation === 'O\'zbekiston');
    const guaranteedUzb = uzbPool[Math.floor(Math.random() * uzbPool.length)];
    result.push({ ...guaranteedUzb, acquiredAt: Date.now() });

    const othersPool = db.filter((p) => p.ovr >= pack.minOvr && p.id !== guaranteedUzb.id);
    for (let i = 1; i < pack.cardCount; i++) {
      const p = othersPool[Math.floor(Math.random() * othersPool.length)];
      result.push({ ...p, acquiredAt: Date.now() + i });
    }
    return result;
  }

  // General pack logic
  // 1. Guaranteed cards (if any)
  const guaranteedMin = pack.guaranteedMinOvr || pack.minOvr;
  const guaranteedCount = pack.guaranteedCount || 1;

  for (let g = 0; g < guaranteedCount; g++) {
    // Check if TOTY or Icon roll triggers
    let candidatePool: Player[] = [];
    const roll = Math.random() * 100;

    if (pack.id === 'toty-ultimate' && roll < 45) {
      candidatePool = db.filter((p) => (p.tier === 'toty' || p.tier === 'icon') && p.ovr >= 96);
    } else if (pack.id === 'ucl-champions' && roll < 35) {
      candidatePool = db.filter((p) => p.tier === 'ucl' || (p.tier === 'gold_rare' && p.ovr >= 88));
    } else if (roll < 8) {
      candidatePool = db.filter((p) => p.tier === 'icon' || p.tier === 'toty' || p.tier === 'ballon_dor');
    }

    if (!candidatePool.length) {
      candidatePool = db.filter((p) => p.ovr >= guaranteedMin);
    }

    const chosen = candidatePool[Math.floor(Math.random() * candidatePool.length)];
    result.push({ ...chosen, acquiredAt: Date.now() + g });
  }

  // 2. Remaining cards
  const remainingCount = pack.cardCount - result.length;
  for (let i = 0; i < remainingCount; i++) {
    const minRating = pack.minOvr;
    const pool = db.filter((p) => p.ovr >= minRating);
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    result.push({ ...chosen, acquiredAt: Date.now() + 10 + i });
  }

  // Sort so highest OVR is in result[0] for the walkout suspense!
  result.sort((a, b) => b.ovr - a.ovr);

  return result;
}
