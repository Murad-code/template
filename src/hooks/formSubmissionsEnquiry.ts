import type { CollectionAfterChangeHook, CollectionBeforeChangeHook } from 'payload'
import { APIError } from 'payload'

import type { Form, FormSubmission } from '@/payload-types'
import { sendEnquiryNotificationEmail } from '@/utilities/sendEnquiryNotificationEmail'
import {
  formHasEnquiryFields,
  parseEnquiryFields,
  validateEnquiryFields,
} from '@/utilities/validateEnquiryFields'

async function loadForm(
  req: Parameters<CollectionBeforeChangeHook<FormSubmission>>[0]['req'],
  formRef: FormSubmission['form'] | undefined,
): Promise<Form | null> {
  if (!formRef) return null
  if (typeof formRef === 'object' && formRef !== null && 'fields' in formRef) {
    return formRef
  }
  const id = typeof formRef === 'object' ? formRef.id : formRef
  if (id == null) return null
  try {
    return (await req.payload.findByID({
      collection: 'forms',
      id,
      depth: 0,
      req,
    })) as Form
  } catch {
    return null
  }
}

export const validateEnquirySubmission: CollectionBeforeChangeHook<FormSubmission> = async ({
  data,
  req,
}) => {
  const form = await loadForm(req, data?.form)
  if (!formHasEnquiryFields(form?.fields)) return data

  const values = parseEnquiryFields(data?.submissionData)
  const error = validateEnquiryFields(values)
  if (error) {
    throw new APIError(error, 400)
  }

  return data
}

export const notifyEnquirySubmission: CollectionAfterChangeHook<FormSubmission> = async ({
  doc,
  operation,
  req,
  context,
}) => {
  if (operation !== 'create') return doc
  if (context?.disableEmail) return doc

  const form = await loadForm(req, doc.form)
  if (!formHasEnquiryFields(form?.fields)) return doc

  try {
    await sendEnquiryNotificationEmail({
      payload: req.payload,
      submissionId: doc.id,
      fields: parseEnquiryFields(doc.submissionData),
    })
  } catch (err) {
    req.payload.logger.error({
      err,
      msg: 'Enquiry notification email failed',
      submissionId: doc.id,
    })
  }

  return doc
}
