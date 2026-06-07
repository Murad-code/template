import React from 'react'

export const BeforeLogin: React.FC = () => {
  const companyName = process.env.COMPANY_NAME || process.env.SITE_NAME || 'your company'
  const siteURL = process.env.PAYLOAD_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || ''

  return (
    <div>
      <p>
        <b>Welcome to {companyName} admin.</b>
        {' This is where site admins will log in to manage your store. Customers will need to '}
        <a href={`${siteURL}/login`}>log in to the site instead</a>
        {' to access their user account, order history, and more.'}
      </p>
    </div>
  )
}
