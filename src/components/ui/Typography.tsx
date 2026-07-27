// src/components/ui/Typography.tsx
'use client'

import { clsx, type ClassValue } from 'clsx'
import { ReactNode } from 'react'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body-lg'
  | 'body-base'
  | 'body-sm'
  | 'caption'
  | 'quote'

type HTMLElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'blockquote'

interface TypographyProps {
  /**
   * Le contenu du texte
   */
  children: ReactNode
  /**
   * Le style de texte (variant)
   */
  variant?: TypographyVariant
  /**
   * L'élément HTML à utiliser (pour l'accessibilité SEO)
   */
  as?: HTMLElement
  /**
   * Couleur du texte (utilise les variables CSS)
   */
  color?: 'primary' | 'secondary' | 'accent' | 'muted' | 'danger' | 'success' | 'warning'
  /**
   * Alignement du texte
   */
  align?: 'left' | 'center' | 'right' | 'justify'
  /**
   * Classes CSS personnalisées
   */
  className?: string
  /**
   * Si le texte est tronqué après N lignes
   */
  truncate?: number
  /**
   * Si le texte est en majuscules
   */
  uppercase?: boolean
  /**
   * Si le texte est en minuscules
   */
  lowercase?: boolean
  /**
   * Si le texte est en capitale (première lettre)
   */
  capitalize?: boolean
  /**
   * Si le texte est en italique
   */
  italic?: boolean
  /**
   * Si le texte est gras
   */
  bold?: boolean
  /**
   * Si le texte est souligné
   */
  underline?: boolean
  /**
   * Espacements personnalisés
   */
  mt?: number // margin-top
  mb?: number // margin-bottom
  mx?: number // margin-x
  px?: number // padding-x
}

/**
 * Styles de base pour chaque variant
 */
const variantStyles: Record<TypographyVariant, string> = {
  h1: 'text-4xl md:text-5xl font-bold leading-tight tracking-tight',
  h2: 'text-3xl md:text-4xl font-bold leading-snug tracking-tight',
  h3: 'text-2xl md:text-3xl font-semibold leading-snug',
  h4: 'text-xl md:text-2xl font-semibold leading-normal',
  h5: 'text-lg md:text-xl font-semibold',
  h6: 'text-base md:text-lg font-semibold',
  'body-lg': 'text-lg leading-relaxed',
  'body-base': 'text-base leading-relaxed',
  'body-sm': 'text-sm leading-normal',
  caption: 'text-xs md:text-sm leading-normal text-gray-600 dark:text-gray-400',
  quote: 'text-lg md:text-xl italic leading-relaxed border-l-4 border-accent-500 pl-4',
}

/**
 * Mapping des variants aux éléments HTML
 */
const variantToElement: Record<TypographyVariant, HTMLElement> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  'body-lg': 'p',
  'body-base': 'p',
  'body-sm': 'p',
  caption: 'span',
  quote: 'blockquote',
}

/**
 * Styles de couleur
 */
const colorStyles: Record<string, string> = {
  primary: 'text-primary-500 dark:text-primary-400',
  secondary: 'text-secondary-500 dark:text-secondary-400',
  accent: 'text-accent-500 dark:text-accent-400',
  muted: 'text-gray-600 dark:text-gray-400',
  danger: 'text-red-500 dark:text-red-400',
  success: 'text-green-500 dark:text-green-400',
  warning: 'text-yellow-500 dark:text-yellow-400',
}

/**
 * Styles d'alignement
 */
const alignStyles: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
}

/**
 * Component Typography réutilisable
 * @example
 * <Typography variant="h1">Titre principal</Typography>
 * <Typography variant="body-base" color="muted">Description</Typography>
 * <Typography variant="quote" italic>Une belle citation</Typography>
 */
export function Typography({
  children,
  variant = 'body-base',
  as,
  color,
  align = 'left',
  className,
  truncate,
  uppercase,
  lowercase,
  capitalize,
  italic,
  bold,
  underline,
  mt,
  mb,
  mx,
  px,
}: TypographyProps) {
  // Déterminer l'élément HTML à utiliser
  const Component = as || variantToElement[variant]

  // Construire les classes
  const classes = cn(
    // Styles du variant
    variantStyles[variant],
    // Couleur
    color && colorStyles[color],
    // Alignement
    alignStyles[align],
    // Transformations de texte
    uppercase && 'uppercase',
    lowercase && 'lowercase',
    capitalize && 'capitalize',
    // Styles de texte
    italic && 'italic',
    bold && 'font-bold',
    underline && 'underline',
    // Troncature
    truncate && `line-clamp-${truncate}`,
    // Espacements
    mt !== undefined && `mt-${mt}`,
    mb !== undefined && `mb-${mb}`,
    mx !== undefined && `mx-${mx}`,
    px !== undefined && `px-${px}`,
    // Classes personnalisées
    className,
  )

  return (
    <Component className={classes}>
      {children}
    </Component>
  )
}

export default Typography
