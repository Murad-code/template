'use client'

import { Message } from '@/components/Message'
import { Price } from '@/components/Price'
import { ProductItem } from '@/components/ProductItem'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { Suspense, useCallback, useEffect, useState } from 'react'

import { useStripeAppearance } from '@/components/checkout/useStripeAppearance'
import { CheckoutForm } from '@/components/forms/CheckoutForm'
import { useAddresses, useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { CheckoutAddresses } from '@/components/checkout/CheckoutAddresses'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import type { Address } from '@/payload-types'
import { Checkbox } from '@/components/ui/checkbox'
import { AddressItem } from '@/components/addresses/AddressItem'
import { FormItem } from '@/components/forms/FormItem'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components/LoadingSpinner'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const stripe = loadStripe(apiKey)

export const CheckoutPage: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { cart } = useCart()
  const [error, setError] = useState<null | string>(null)
  const stripeAppearance = useStripeAppearance()
  /**
   * State to manage the email input for guest checkout.
   */
  const [email, setEmail] = useState('')
  const [emailEditable, setEmailEditable] = useState(true)
  const [paymentData, setPaymentData] = useState<null | Record<string, unknown>>(null)
  const { initiatePayment } = usePayments()
  const { addresses } = useAddresses()
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>()
  const [billingAddress, setBillingAddress] = useState<Partial<Address>>()
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true)
  const [isProcessingPayment, setProcessingPayment] = useState(false)

  const cartIsEmpty = !cart || !cart.items || !cart.items.length

  const canGoToPayment = Boolean(
    (email || user) && billingAddress && (billingAddressSameAsShipping || shippingAddress),
  )

  // On initial load wait for addresses to be loaded and check to see if we can prefill a default one
  useEffect(() => {
    if (!shippingAddress) {
      if (addresses && addresses.length > 0) {
        const defaultAddress = addresses[0]
        if (defaultAddress) {
          setBillingAddress(defaultAddress)
        }
      }
    }
  }, [addresses])

  useEffect(() => {
    return () => {
      setShippingAddress(undefined)
      setBillingAddress(undefined)
      setBillingAddressSameAsShipping(true)
      setEmail('')
      setEmailEditable(true)
    }
  }, [])

  const initiatePaymentIntent = useCallback(
    async (paymentID: string) => {
      try {
        const paymentData = (await initiatePayment(paymentID, {
          additionalData: {
            ...(email ? { customerEmail: email } : {}),
            billingAddress,
            shippingAddress: billingAddressSameAsShipping ? billingAddress : shippingAddress,
          },
        })) as Record<string, unknown>

        if (paymentData) {
          setPaymentData(paymentData)
        }
      } catch (error) {
        const errorData = error instanceof Error ? JSON.parse(error.message) : {}
        let errorMessage = 'An error occurred while initiating payment.'

        if (errorData?.cause?.code === 'OutOfStock') {
          errorMessage = 'One or more items in your cart are out of stock.'
        }

        setError(errorMessage)
        toast.error(errorMessage)
      }
    },
    [billingAddress, billingAddressSameAsShipping, shippingAddress],
  )

  if (!stripe) return null

  if (cartIsEmpty && isProcessingPayment) {
    return (
      <div className="py-12 w-full items-center justify-center">
        <div className="prose dark:prose-invert text-center max-w-none self-center mb-8">
          <p>Processing your payment…</p>
        </div>
        <LoadingSpinner />
      </div>
    )
  }

  if (cartIsEmpty) {
    return (
      <div className="prose dark:prose-invert py-12 w-full items-center">
        <p>Your cart is empty.</p>
        <Link href="/search">Continue shopping?</Link>
      </div>
    )
  }

  return (
    <div className="my-10 grow sm:my-14">
      <h1 className="text-h1 mb-10">Checkout</h1>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-12">
        <div className="flex flex-col gap-10">
          <h2 className="text-h3">Contact</h2>
          {!user && (
            <Card className="w-full gap-4 p-5">
              <div>
                <Button asChild variant="outline">
                  <Link href="/login">Log in</Link>
                </Button>
                <p className="mt-0">
                  <span className="mx-2">or</span>
                  <Link href="/create-account">create an account</Link>
                </p>
              </div>
            </Card>
          )}
          {user ? (
            <Card className="gap-4 p-5">
              <div>
                <p>{user.email}</p>{' '}
                <p>
                  Not you?{' '}
                  <Link className="underline" href="/logout">
                    Log out
                  </Link>
                </p>
              </div>
            </Card>
          ) : (
            <Card className="gap-4 p-5">
              <div>
                <p className="mb-4">Enter your email to checkout as a guest.</p>

                <FormItem className="mb-6">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    disabled={!emailEditable}
                    id="email"
                    autoComplete="email"
                    name="email"
                    spellCheck={false}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                  />
                </FormItem>

                <Button
                  disabled={!email || !emailEditable}
                  onClick={(e) => {
                    e.preventDefault()
                    setEmailEditable(false)
                  }}
                  variant="default"
                >
                  Continue as guest
                </Button>
              </div>
            </Card>
          )}

          <h2 className="text-h3">Address</h2>

          {billingAddress ? (
            <div>
              <AddressItem
                actions={
                  <Button
                    variant={'secondary'}
                    disabled={Boolean(paymentData)}
                    onClick={(e) => {
                      e.preventDefault()
                      setBillingAddress(undefined)
                    }}
                  >
                    Remove
                  </Button>
                }
                address={billingAddress}
              />
            </div>
          ) : user ? (
            <CheckoutAddresses heading="Billing address" setAddress={setBillingAddress} />
          ) : (
            <CreateAddressModal
              disabled={!email || Boolean(emailEditable)}
              callback={(address) => {
                setBillingAddress(address)
              }}
              skipSubmission={true}
            />
          )}

          <div className="flex gap-4 items-center">
            <Checkbox
              id="shippingTheSameAsBilling"
              checked={billingAddressSameAsShipping}
              disabled={Boolean(paymentData || (!user && (!email || Boolean(emailEditable))))}
              onCheckedChange={(state) => {
                setBillingAddressSameAsShipping(state as boolean)
              }}
            />
            <Label htmlFor="shippingTheSameAsBilling">Shipping is the same as billing</Label>
          </div>

          {!billingAddressSameAsShipping && (
            <>
              {shippingAddress ? (
                <div>
                  <AddressItem
                    actions={
                      <Button
                        variant={'secondary'}
                        disabled={Boolean(paymentData)}
                        onClick={(e) => {
                          e.preventDefault()
                          setShippingAddress(undefined)
                        }}
                      >
                        Remove
                      </Button>
                    }
                    address={shippingAddress}
                  />
                </div>
              ) : user ? (
                <CheckoutAddresses
                  heading="Shipping address"
                  description="Please select a shipping address."
                  setAddress={setShippingAddress}
                />
              ) : (
                <CreateAddressModal
                  callback={(address) => {
                    setShippingAddress(address)
                  }}
                  disabled={!email || Boolean(emailEditable)}
                  skipSubmission={true}
                />
              )}
            </>
          )}

          {!paymentData && (
            <Button
              className="self-start"
              disabled={!canGoToPayment}
              onClick={(e) => {
                e.preventDefault()
                void initiatePaymentIntent('stripe')
              }}
            >
              Go to payment
            </Button>
          )}

          {!paymentData?.['clientSecret'] && error && (
            <div className="my-8">
              <Message error={error} />

              <Button
                onClick={(e) => {
                  e.preventDefault()
                  router.refresh()
                }}
                variant="default"
              >
                Try again
              </Button>
            </div>
          )}

          <Suspense fallback={<React.Fragment />}>
            {/* @ts-ignore */}
            {paymentData && paymentData?.['clientSecret'] && (
              <div className="pb-16">
                <h2 className="text-h3">Payment</h2>
                {error && <p>{`Error: ${error}`}</p>}
                <Elements
                  options={{
                    appearance: stripeAppearance,
                    clientSecret: paymentData['clientSecret'] as string,
                  }}
                  stripe={stripe}
                >
                  <div className="flex flex-col gap-8">
                    <CheckoutForm
                      customerEmail={email}
                      billingAddress={billingAddress}
                      setProcessingPayment={setProcessingPayment}
                    />
                    <Button
                      variant="ghost"
                      className="self-start"
                      onClick={() => setPaymentData(null)}
                    >
                      Cancel payment
                    </Button>
                  </div>
                </Elements>
              </div>
            )}
          </Suspense>
        </div>

        {!cartIsEmpty && (
          <Card className="gap-8 p-6 lg:sticky lg:top-8">
            <h2 className="text-h3">Your cart</h2>
            {cart?.items?.map((item, index) => {
              if (typeof item.product === 'object' && item.product) {
                const { product, quantity, variant } = item

                if (!quantity) return null

                return (
                  <ProductItem
                    key={index}
                    product={product}
                    quantity={quantity}
                    variant={variant && typeof variant === 'object' ? variant : undefined}
                  />
                )
              }
              return null
            })}
            <hr />
            <div className="flex justify-between items-center gap-2">
              <span className="spec-list">Total</span>{' '}
              <Price amount={cart.subtotal || 0} className="text-h3 tabular-figures" />
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
