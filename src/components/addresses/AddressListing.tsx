'use client'

import React, { useMemo, useState } from 'react'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { AddressList } from '@/components/addresses/AddressList'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import type { Address } from '@/payload-types'

export const AddressListing: React.FC = () => {
  const router = useRouter()
  const { addresses } = useAddresses()
  const [error, setError] = useState<string | null>(null)
  const [deletingAddressID, setDeletingAddressID] = useState<Address['id'] | null>(null)
  const [deletedAddressIDs, setDeletedAddressIDs] = useState<Set<Address['id']>>(new Set())

  const visibleAddresses = useMemo(
    () => addresses?.filter((address) => !deletedAddressIDs.has(address.id)) ?? [],
    [addresses, deletedAddressIDs],
  )

  const handleDeleteAddress = async (addressID: Address['id']) => {
    if (!confirm('Delete this address? This action cannot be undone.')) {
      return
    }

    setError(null)
    setDeletingAddressID(addressID)

    try {
      const response = await fetch(`/api/addresses/${addressID}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { errors?: { message?: string }[] } | null
        const message = payload?.errors?.[0]?.message ?? 'Unable to delete this address. Please try again.'
        throw new Error(message)
      }

      setDeletedAddressIDs((previous) => {
        const next = new Set(previous)
        next.add(addressID)
        return next
      })

      router.refresh()
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Unable to delete this address. Please try again.',
      )
    } finally {
      setDeletingAddressID(null)
    }
  }

  if (visibleAddresses.length === 0) {
    return <p>No addresses found.</p>
  }

  return (
    <div>
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      <AddressList
        addresses={visibleAddresses}
        renderBeforeActions={(address) => (
          <Button
            variant="destructive"
            className="text-secondary-foreground"
            disabled={deletingAddressID === address.id}
            onClick={(event) => {
              event.preventDefault()
              void handleDeleteAddress(address.id)
            }}
          >
            {deletingAddressID === address.id ? 'Deleting...' : 'Delete'}
          </Button>
        )}
      />
    </div>
  )
}
