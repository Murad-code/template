import type { EmailField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Width } from '../Width'
import { FormItem } from '@/components/forms/FormItem'
import { FormError } from '@/components/forms/FormError'
import { capitaliseFirstLetter } from '@/utilities/capitaliseFirstLetter'
import { ENQUIRY_EMAIL_PATTERN, validateEnquiryEmail } from '@/utilities/validateEnquiryFields'

export const Email: React.FC<
  EmailField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required: requiredFromProps, width }) => {
  return (
    <Width width={width}>
      <FormItem>
        <Label htmlFor={name}>{label}</Label>
        <Input
          autoComplete="email"
          defaultValue={defaultValue}
          id={name}
          type="email"
          {...register(name, {
            pattern: {
              value: ENQUIRY_EMAIL_PATTERN,
              message: 'Enter a valid email address.',
            },
            required: requiredFromProps
              ? `${capitaliseFirstLetter(label || name)} is required.`
              : undefined,
            validate: (value) => validateEnquiryEmail(value) || true,
          })}
        />

        {errors?.[name]?.message && typeof errors?.[name]?.message === 'string' && (
          <FormError message={errors?.[name]?.message} />
        )}
      </FormItem>
    </Width>
  )
}
