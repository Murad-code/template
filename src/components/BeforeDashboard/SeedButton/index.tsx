'use client'

import React, { Fragment, useCallback, useState, MouseEvent } from 'react'
import { toast } from '@payloadcms/ui'

import './index.scss'

type SeedMode = 'ecommerce' | 'booking' | 'hybrid'

const SuccessMessage: React.FC = () => (
  <div>
    Database seeded! You can now{' '}
    <a target="_blank" href="/">
      visit your website
    </a>
  </div>
)

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const [mode, setMode] = useState<SeedMode>('ecommerce')

  const handleClick = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (seeded) {
        toast.info('Database already seeded.')
        return
      }
      if (loading) {
        toast.info('Seeding already in progress.')
        return
      }
      if (error) {
        toast.error(`An error occurred, please refresh and try again.`)
        return
      }

      setLoading(true)

      try {
        toast.promise(
          new Promise((resolve, reject) => {
            try {
              fetch('/next/seed', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode }),
              })
                .then((res) => {
                  if (res.ok) {
                    resolve(true)
                    setSeeded(true)
                  } else {
                    reject('An error occurred while seeding.')
                  }
                })
                .catch((err) => {
                  reject(err)
                })
            } catch (err) {
              reject(err)
            }
          }),
          {
            loading: 'Seeding with data....',
            success: <SuccessMessage />,
            error: 'An error occurred while seeding.',
          },
        )
      } catch (err) {
        setError(err)
      }
    },
    [loading, seeded, error, mode],
  )

  let message = ''
  if (loading) message = ' (seeding...)'
  if (seeded) message = ' (done!)'
  if (error) message = ` (error: ${error})`

  return (
    <Fragment>
      <label htmlFor="seed-mode" style={{ marginRight: '8px' }}>
        Seed as:
      </label>
      <select
        id="seed-mode"
        value={mode}
        onChange={(e) => setMode(e.target.value as SeedMode)}
        disabled={loading}
        style={{ marginRight: '8px' }}
      >
        <option value="ecommerce">Ecommerce</option>
        <option value="booking">Booking</option>
        <option value="hybrid">Hybrid</option>
      </select>
      <button className="seedButton" onClick={handleClick}>
        Seed your database
      </button>
      {message}
    </Fragment>
  )
}
