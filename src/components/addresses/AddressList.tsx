'use client'

import type { Address } from '@/payload-types'
import { AddressItem } from '@/components/addresses/AddressItem'
import { cn } from '@/utilities/cn'

type AddressListProps = {
  addresses?: Address[]
  emptyState?: React.ReactNode
  renderBeforeActions?: (address: Address) => React.ReactNode
  className?: string
}

export const AddressList: React.FC<AddressListProps> = ({
  addresses,
  emptyState = <p>No addresses found.</p>,
  renderBeforeActions,
  className,
}) => {
  if (!addresses || addresses.length === 0) {
    return <>{emptyState}</>
  }

  return (
    <ul className={cn('flex flex-col gap-8', className)}>
      {addresses.map((address) => (
        <li key={address.id} className="border-b border-border pb-8 last:border-none">
          <AddressItem
            address={address}
            beforeActions={renderBeforeActions ? renderBeforeActions(address) : undefined}
          />
        </li>
      ))}
    </ul>
  )
}
