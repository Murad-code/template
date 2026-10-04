import { OrderStatus as StatusOptions } from '@/payload-types'
import { cn } from '@/utilities/cn'

type Props = {
  status: StatusOptions
  className?: string
}

export const OrderStatus: React.FC<Props> = ({ status, className }) => {
  return (
    <div
      className={cn('spec-list w-fit rounded-xs px-2 py-0', className, {
        'bg-primary/10': status === 'processing',
        'bg-success': status === 'completed',
      })}
    >
      {status}
    </div>
  )
}
