'use client'

import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { RichText } from '@/components/RichText'
import { Button } from '@/components/ui/button'

import { buildInitialFormState } from './buildInitialFormState'
import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'

export type Value = unknown

export interface Property {
  [k: string]: Value
}

export interface Data {
  [k: string]: Property | Property[]
}

type FormBlockClientProps = {
  enableIntro?: boolean | null
  form: FormType
  introContent?: SerializedEditorState | null
}

export const FormBlockClient: React.FC<FormBlockClientProps> = (props) => {
  const { enableIntro, form, introContent } = props
  const { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = form

  const formMethods = useForm({
    defaultValues: buildInitialFormState(form.fields),
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: Data) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)
            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })
            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect
            if (url) router.push(url)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <div>
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      <div className="rounded-[0.8rem] bg-surface-soft-panel p-4 shadow-[var(--elevation-soft)] lg:p-6">
        <FormProvider {...formMethods}>
          {!isLoading && hasSubmitted && confirmationType === 'message' && (
            <RichText data={confirmationMessage} />
          )}
          {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
          {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
          {!hasSubmitted && (
            <form id={String(formID)} onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4 flex flex-wrap last:mb-0">
                {form.fields?.map((field, index) => {
                  const Field: React.FC<any> | undefined =
                    fields?.[field.blockType as keyof typeof fields]
                  const width =
                    'width' in field && typeof field.width === 'number' ? field.width : 100

                  if (Field) {
                    return (
                      <div
                        className={
                          width < 100 ? 'mb-6 w-full px-1 md:w-1/2 last:mb-0' : 'mb-6 w-full px-1 last:mb-0'
                        }
                        key={index}
                      >
                        <Field
                          form={form}
                          {...field}
                          {...formMethods}
                          control={control}
                          errors={errors}
                          register={register}
                        />
                      </div>
                    )
                  }
                  return null
                })}
              </div>

              <Button form={String(formID)} type="submit" variant="default">
                {submitButtonLabel}
              </Button>
            </form>
          )}
        </FormProvider>
      </div>
    </div>
  )
}
