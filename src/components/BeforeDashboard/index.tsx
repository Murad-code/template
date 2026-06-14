import { Banner } from '@payloadcms/ui'
import React from 'react'

import { RootOnlyActions } from './RootOnlyActions'
import './index.scss'

const baseClass = 'before-dashboard'

export const BeforeDashboard: React.FC = () => {
  const companyName = process.env.COMPANY_NAME || process.env.SITE_NAME || 'Your Company'

  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to {companyName} admin!</h4>
      </Banner>
      <RootOnlyActions />
    </div>
  )
}
