import React from 'react'

import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { DefaultDocumentIDType } from 'payload'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { getSiteConfig } from '@/config/site'
import { SiteContactDetails, type SiteContactDetailsData } from '@/components/SiteContactDetails'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { FormBlockClient } from './Component.client'

export type FormBlockComponentProps = {
  blockName?: string | null
  blockType?: 'formBlock'
  enableIntro?: boolean | null
  showSiteContactDetails?: boolean | null
  form: FormType | number | string
  introContent?: SerializedEditorState | null
  id?: DefaultDocumentIDType
  contactDetails?: SiteContactDetailsData | null
}

export const FormBlock: React.FC<FormBlockComponentProps> = async (props) => {
  const form = await resolveForm(props.form)

  if (!form) return null

  const contactDetails = props.showSiteContactDetails
    ? await loadContactDetails()
    : props.contactDetails || null

  const showSidebar = Boolean(
    props.showSiteContactDetails &&
      contactDetails &&
      (contactDetails.email || contactDetails.phone || contactDetails.address),
  )

  return (
    <div className={showSidebar ? 'container' : 'container lg:max-w-3xl'}>
      {showSidebar ? (
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <SiteContactDetails details={contactDetails ?? {}} />
          <FormBlockClient
            enableIntro={props.enableIntro}
            form={form}
            introContent={props.introContent}
          />
        </div>
      ) : (
        <FormBlockClient
          enableIntro={props.enableIntro}
          form={form}
          introContent={props.introContent}
        />
      )}
    </div>
  )
}

function toPublicForm(form: FormType | Record<string, unknown>): FormType {
  const { emails: _emails, ...rest } = form as FormType & { emails?: unknown }
  return rest as FormType
}

async function resolveForm(
  formRef: FormBlockComponentProps['form'],
): Promise<FormType | null> {
  if (formRef && typeof formRef === 'object' && 'fields' in formRef) {
    return toPublicForm(formRef)
  }

  const id =
    typeof formRef === 'number' || typeof formRef === 'string'
      ? formRef
      : null
  if (id == null || id === '') return null

  const payload = await getPayload({ config: configPromise })
  try {
    const doc = await payload.findByID({
      collection: 'forms',
      id,
      depth: 0,
      overrideAccess: true,
    })
    return toPublicForm(doc as unknown as FormType)
  } catch {
    return null
  }
}

async function loadContactDetails(): Promise<SiteContactDetailsData> {
  const settings = await getCachedGlobal('site-settings', 0)()
  const site = getSiteConfig()

  return {
    siteName: site.siteName,
    email: settings?.publicEmail || site.companyEmail,
    phone: settings?.publicPhone || site.companyPhone,
    address: settings?.publicAddress || site.companyAddress,
  }
}
