import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/cn'
import NextImage from 'next/image'
import React from 'react'

import type { Props as MediaProps } from '../types'

/**
 * Widest slot an image is ever asked to fill. Without a final candidate the
 * browser falls back to `100vw` above the last breakpoint and downloads the
 * largest rendition it can find — which is how product thumbnails ended up
 * fetching 3840px files for a 300px box.
 *
 * Pass `size` wherever the real slot is known; this is only the fallback for
 * full-bleed media.
 */
const DEFAULT_SIZES = '(max-width: 48rem) 100vw, (max-width: 80rem) 80vw, 1600px'

export const Image: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    height: heightFromProps,
    imgClassName,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    width: widthFromProps,
  } = props

  let width: number | undefined | null
  let height: number | undefined | null
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''

  if (!src && resource && typeof resource === 'object') {
    const {
      alt: altFromResource,
      filename: fullFilename,
      height: fullHeight,
      url,
      width: fullWidth,
    } = resource

    width = widthFromProps ?? fullWidth
    height = heightFromProps ?? fullHeight
    alt = altFromResource

    // Prefer relative media URLs so local/dev doesn't proxy to a production domain.
    if (typeof url === 'string' && url.length > 0) {
      src = url
    } else if (fullFilename) {
      src = `/api/media/file/${encodeURIComponent(fullFilename)}`
    }
  }

  return (
    <NextImage
      alt={alt || ''}
      className={cn(imgClassName)}
      fill={fill}
      height={!fill ? height || heightFromProps : undefined}
      priority={priority}
      sizes={sizeFromProps || DEFAULT_SIZES}
      src={src}
      width={!fill ? width || widthFromProps : undefined}
    />
  )
}
