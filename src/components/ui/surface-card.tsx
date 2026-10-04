/**
 * Kept as an alias so the account, cart and checkout call sites that import it
 * keep working. `Card` now covers what this used to add, so prefer importing
 * that directly in new code.
 */
export {
  CardPlain as SurfaceCard,
  CardHeader as SurfaceCardHeader,
  CardContent as SurfaceCardBody,
} from '@/components/ui/card'
