import {
  Award,
  BadgeCheck,
  BadgePoundSterling,
  Banknote,
  CalendarDays,
  Check,
  ClipboardCheck,
  Clock,
  Coffee,
  Compass,
  CreditCard,
  Gift,
  Globe,
  GraduationCap,
  Handshake,
  Headphones,
  Heart,
  HouseIcon,
  Key,
  Leaf,
  LifeBuoy,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Rocket,
  Search,
  Settings,
  Shield,
  Sparkles,
  Star,
  ThumbsUp,
  Timer,
  TrendingUp,
  Truck,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import React from 'react'

import { cn } from '@/utilities/cn'

/**
 * A curated set rather than the whole of lucide.
 *
 * An editor picking from a free-text field would reach for icons that do not
 * suit the page, and a typo would render nothing. Forty is enough to cover
 * the sections a marketing site needs. Add to the map and the field options
 * together; the keys are what is stored, so renaming one orphans content.
 */
export const ICONS = {
  award: Award,
  badgeCheck: BadgeCheck,
  banknote: Banknote,
  calendar: CalendarDays,
  check: Check,
  clipboardCheck: ClipboardCheck,
  clock: Clock,
  coffee: Coffee,
  compass: Compass,
  creditCard: CreditCard,
  gift: Gift,
  globe: Globe,
  graduationCap: GraduationCap,
  handshake: Handshake,
  headphones: Headphones,
  heart: Heart,
  house: HouseIcon,
  key: Key,
  leaf: Leaf,
  lifeBuoy: LifeBuoy,
  lock: Lock,
  mail: Mail,
  mapPin: MapPin,
  messageCircle: MessageCircle,
  package: Package,
  phone: Phone,
  pound: BadgePoundSterling,
  rocket: Rocket,
  search: Search,
  settings: Settings,
  shield: Shield,
  sparkles: Sparkles,
  star: Star,
  thumbsUp: ThumbsUp,
  timer: Timer,
  trendingUp: TrendingUp,
  truck: Truck,
  users: Users,
  wrench: Wrench,
  zap: Zap,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof ICONS

export const isIconName = (value: unknown): value is IconName =>
  typeof value === 'string' && value in ICONS

export const Icon: React.FC<{
  className?: string
  name?: string | null
}> = ({ className, name }) => {
  if (!isIconName(name)) return null
  const Glyph = ICONS[name]

  return <Glyph aria-hidden="true" className={cn('size-5', className)} />
}
