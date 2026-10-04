import type { Field } from 'payload'

/**
 * Icon picker backed by the curated set in `src/components/Icon`.
 *
 * Keep the options here and the `ICONS` map there in step: the value is what
 * is stored, so renaming one orphans existing content.
 */
export const iconField = (overrides: { label?: string; name?: string } = {}): Field => ({
  name: overrides.name ?? 'iconName',
  type: 'select',
  label: overrides.label ?? 'Icon',
  options: [
      { label: 'Award', value: 'award' },
      { label: 'Badge check', value: 'badgeCheck' },
      { label: 'Banknote', value: 'banknote' },
      { label: 'Calendar', value: 'calendar' },
      { label: 'Check', value: 'check' },
      { label: 'Clipboard check', value: 'clipboardCheck' },
      { label: 'Clock', value: 'clock' },
      { label: 'Coffee', value: 'coffee' },
      { label: 'Compass', value: 'compass' },
      { label: 'Credit card', value: 'creditCard' },
      { label: 'Gift', value: 'gift' },
      { label: 'Globe', value: 'globe' },
      { label: 'Graduation cap', value: 'graduationCap' },
      { label: 'Handshake', value: 'handshake' },
      { label: 'Headphones', value: 'headphones' },
      { label: 'Heart', value: 'heart' },
      { label: 'House', value: 'house' },
      { label: 'Key', value: 'key' },
      { label: 'Leaf', value: 'leaf' },
      { label: 'Life buoy', value: 'lifeBuoy' },
      { label: 'Lock', value: 'lock' },
      { label: 'Mail', value: 'mail' },
      { label: 'Map pin', value: 'mapPin' },
      { label: 'Message circle', value: 'messageCircle' },
      { label: 'Package', value: 'package' },
      { label: 'Phone', value: 'phone' },
      { label: 'Pound', value: 'pound' },
      { label: 'Rocket', value: 'rocket' },
      { label: 'Search', value: 'search' },
      { label: 'Settings', value: 'settings' },
      { label: 'Shield', value: 'shield' },
      { label: 'Sparkles', value: 'sparkles' },
      { label: 'Star', value: 'star' },
      { label: 'Thumbs up', value: 'thumbsUp' },
      { label: 'Timer', value: 'timer' },
      { label: 'Trending up', value: 'trendingUp' },
      { label: 'Truck', value: 'truck' },
      { label: 'Users', value: 'users' },
      { label: 'Wrench', value: 'wrench' },
      { label: 'Zap', value: 'zap' },
  ],
})
