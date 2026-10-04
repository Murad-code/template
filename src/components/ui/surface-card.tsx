/**
 * Kept as an alias so the account, cart and checkout call sites that import it
 * keep working. `Card` now covers what this used to add, so prefer importing
 * that directly in new code.
 */
export {
  Card as SurfaceCard,
  CardContent as SurfaceCardBody,
  CardHeader as SurfaceCardHeader,
} from '@/components/ui/card'
