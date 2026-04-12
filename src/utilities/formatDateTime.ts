import { format } from 'date-fns'

type Props = {
  date: string
  format?: string
}

export const formatDateTime = ({ date, format: formatFromProps }: Props): string => {
  if (!date) return ''

  /** Default matches UK-style short date used across the app (`dd-mm-yyyy`). */
  const dateFormat = formatFromProps ?? 'dd-MM-yyyy'

  const formattedDate = format(new Date(date), dateFormat)

  return formattedDate
}
