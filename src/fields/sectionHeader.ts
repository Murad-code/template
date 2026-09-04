import type { Field } from 'payload'

export const sectionHeaderFields: Field[] = [
  {
    name: 'eyebrow',
    type: 'text',
    label: 'Eyebrow',
  },
  {
    name: 'title',
    type: 'text',
    label: 'Section title',
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Section description',
  },
  {
    name: 'align',
    type: 'select',
    defaultValue: 'left',
    options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' },
    ],
  },
]
