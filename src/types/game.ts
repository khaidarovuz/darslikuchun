export type CardTier =
  | 'toty'
  | 'icon'
  | 'ballon_dor'
  | 'hero'
  | 'ucl'
  | 'gold_rare'
  | 'gold_common'
  | 'silver'
  | 'bronze';

export type Position =
  | 'GK'
  | 'CB'
  | 'LB'
  | 'RB'
  | 'CDM'
  | 'CM'
  | 'CAM'
  | 'LW'
  | 'RW'
  | 'ST';

export interface PlayerStats {
  pac: number; // Pace / Diving (for GK)
  sho: number; // Shooting / Handling
  pas: number; // Passing / Kicking
  dri: number; // Dribbling / Reflexes
  def: number; // Defending / Speed
  phy: number; // Physical / Positioning
}

export interface Player {
  id: string;
  name: string;
  shortName: string;
  ovr: number;
  position: Position;
  nation: string;
  nationFlag: string;
  club: string;
  league: string;
  tier: CardTier;
  stats: PlayerStats;
  skillMoves: number; // 1-5
  weakFoot: number;   // 1-5
  preferredFoot: 'Left' | 'Right';
  value: number; // Coins
  avatarBg?: string;
  celebration?: string;
  isLocked?: boolean;
  acquiredAt?: number;
}

export interface Pack {
  id: string;
  name: string;
  nameUz: string;
  category: 'promo' | 'gold' | 'special' | 'free';
  tag?: string;
  descriptionUz: string;
  costCoins: number;
  costGems: number;
  cardCount: number;
  minOvr: number;
  guaranteedCount?: number;
  guaranteedMinOvr?: number;
  odds: {
    gold: string;
    elite85: string;
    walkout88: string;
    totyOrIcon: string;
  };
  accentColor: string;
  bgGradient: string;
  isFree?: boolean;
  cooldownSeconds?: number;
}

export interface SquadSlot {
  slotId: string;
  position: Position;
  label: string;
  xPercent: number; // tactical pitch X (0-100)
  yPercent: number; // tactical pitch Y (0-100)
  player?: Player;
}

export interface Formation {
  id: string;
  name: string;
  slots: Omit<SquadSlot, 'player'>[];
}

export interface SbcExchange {
  id: string;
  titleUz: string;
  descUz: string;
  badgeText: string;
  requiredPlayerCount: number;
  minPlayerOvr: number;
  rewardPackId: string;
  rewardNameUz: string;
}
