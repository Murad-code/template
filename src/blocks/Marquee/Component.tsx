import React from 'react'

import type { MarqueeBlockType } from '@/payload-types'

import { Marquee } from '@/components/Marquee'

export const MarqueeBlock: React.FC<MarqueeBlockType & { id?: string }> = ({ items }) => {
  return <Marquee items={(items ?? []).map((item) => item.label).filter(Boolean)} />
}
