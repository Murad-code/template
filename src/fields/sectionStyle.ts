import type { Field } from 'payload'

/**
 * Appearance controls shared by every block.
 *
 * Alternating full-width bands of colour are most of what makes a page read
 * as designed rather than as a stack of components, so this is deliberately
 * on every block rather than a privileged few. Collapsed by default: an
 * editor adding a block should meet its content fields first.
 */
export const sectionStyleFields: Field[] = [
  {
    type: 'collapsible',
    label: 'Appearance',
    admin: { initCollapsed: true },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'background',
            type: 'select',
            defaultValue: 'default',
            admin: { width: '50%' },
            options: [
              { label: 'Page background', value: 'default' },
              { label: 'Muted', value: 'muted' },
              { label: 'Soft panel', value: 'soft' },
              { label: 'Inverse (dark band)', value: 'inverse' },
            ],
          },
          {
            name: 'spacing',
            type: 'select',
            defaultValue: 'default',
            admin: { width: '50%' },
            options: [
              { label: 'Default', value: 'default' },
              { label: 'Tight', value: 'tight' },
              { label: 'Loose', value: 'loose' },
              { label: 'None', value: 'none' },
            ],
          },
        ],
      },
    ],
  },
]
