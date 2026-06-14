'use client'

import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import React, { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export const LogoutPage: React.FC = (props) => {
  const { logout } = useAuth()
  const router = useRouter()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        setSuccess('Logged out successfully.')
        setTimeout(() => {
          router.replace('/login')
        }, 300)
      } catch (_) {
        setError('You are already logged out.')
      }
    }

    void performLogout()
  }, [logout, router])

  return (
    <Fragment>
      {(error || success) && (
        <div className="prose dark:prose-invert">
          <h1>{error || success}</h1>
          <p>
            What would you like to do next?
            <Fragment>
              {' '}
              <Link href="/search">Click here</Link>
              {` to shop.`}
            </Fragment>
            {` To log back in, `}
            <Link href="/login">click here</Link>.
          </p>
        </div>
      )}
    </Fragment>
  )
}
