import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Width } from '../Width'
import { FormItem } from '@/components/forms/FormItem'
import { FormError } from '@/components/forms/FormError'
import { capitaliseFirstLetter } from '@/utilities/capitaliseFirstLetter'
import { validateEnquiryPhone } from '@/utilities/validateEnquiryFields'

export const Text: React.FC<
  TextField & {
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
          autoComplete={name === 'phone' ? 'tel' : name === 'name' ? 'name' : undefined}
          defaultValue={defaultValue}
          id={name}
          inputMode={name === 'phone' ? 'tel' : undefined}
          type={name === 'phone' ? 'tel' : 'text'}
          {...register(name, {
            minLength:
              name === 'name'
                ? {
                    value: 2,
                    message: `${capitaliseFirstLetter(label || name)} must be at least 2 characters.`,
                  }
                : undefined,
            required: requiredFromProps
              ? `${capitaliseFirstLetter(label || name)} is required.`
              : undefined,
            validate:
              name === 'phone'
                ? (value) => validateEnquiryPhone(value) || true
                : undefined,
          })}
        />

        {errors?.[name]?.message && typeof errors?.[name]?.message === 'string' && (
          <FormError message={errors?.[name]?.message} />
        )}
      </FormItem>
    </Width>
  )
}
