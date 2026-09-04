import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { Textarea as TextAreaComponent } from '@/components/ui/textarea'
import React from 'react'

import { Width } from '../Width'
import { capitaliseFirstLetter } from '@/utilities/capitaliseFirstLetter'
import { FormItem } from '@/components/forms/FormItem'
import { FormError } from '@/components/forms/FormError'
import { ENQUIRY_MESSAGE_MIN, validateEnquiryMessage } from '@/utilities/validateEnquiryFields'

export const Textarea: React.FC<
  TextField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    register: UseFormRegister<FieldValues>
    rows?: number
  }
> = ({
  name,
  defaultValue,
  errors,
  label,
  register,
  required: requiredFromProps,
  rows = 3,
  width,
}) => {
  return (
    <Width width={width}>
      <FormItem>
        <Label htmlFor={name}>{label}</Label>

        <TextAreaComponent
          defaultValue={defaultValue}
          id={name}
          rows={rows}
          {...register(name, {
            minLength:
              name === 'message'
                ? {
                    value: ENQUIRY_MESSAGE_MIN,
                    message: `Message must be at least ${ENQUIRY_MESSAGE_MIN} characters.`,
                  }
                : undefined,
            required: requiredFromProps
              ? `${capitaliseFirstLetter(label || name)} is required.`
              : undefined,
            validate:
              name === 'message' ? (value) => validateEnquiryMessage(value) || true : undefined,
          })}
        />

        {errors?.[name]?.message && typeof errors?.[name]?.message === 'string' && (
          <FormError message={errors?.[name]?.message} />
        )}
      </FormItem>
    </Width>
  )
}
