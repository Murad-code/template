import { Mail, MapPin, Phone } from 'lucide-react'
import React from 'react'

export type SiteContactDetailsData = {
  siteName?: string
  email?: string
  phone?: string
  address?: string
}

export const SiteContactDetails: React.FC<{ details: SiteContactDetailsData }> = ({ details }) => {
  const { address, email, phone, siteName } = details
  const items = [
    email
      ? {
          href: `mailto:${email}`,
          icon: Mail,
          key: 'email',
          label: 'Email',
          value: email,
        }
      : null,
    phone
      ? {
          href: `tel:${phone.replace(/[^\d+]/g, '')}`,
          icon: Phone,
          key: 'phone',
          label: 'Phone',
          value: phone,
        }
      : null,
    address
      ? {
          href: undefined,
          icon: MapPin,
          key: 'address',
          label: 'Address',
          value: address,
        }
      : null,
  ].filter(Boolean) as {
    href?: string
    icon: typeof Mail
    key: string
    label: string
    value: string
  }[]

  if (items.length === 0) return null

  return (
    <div className="rounded-[0.8rem] border border-border bg-surface-soft-panel p-6 lg:p-8">
      <h2 className="text-2xl font-semibold tracking-tight">
        {siteName ? `Contact ${siteName}` : 'Get in touch'}
      </h2>
      <p className="mt-2 text-muted-foreground">
        Use the form or reach us directly with the details below.
      </p>
      <ul className="mt-6 space-y-4">
        {items.map((item) => {
          const Icon = item.icon
          const content = (
            <span className="flex items-start gap-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <span>
                <span className="block text-sm font-medium">{item.label}</span>
                <span className="whitespace-pre-line text-muted-foreground">{item.value}</span>
              </span>
            </span>
          )

          return (
            <li key={item.key}>
              {item.href ? (
                <a className="hover:text-foreground" href={item.href}>
                  {content}
                </a>
              ) : (
                content
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
