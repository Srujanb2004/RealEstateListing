import { classNames } from '../../utils/helpers'

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn bg-red-600 text-white hover:bg-red-700 px-4 py-2',
}

export default function Button({
  variant = 'primary',
  className = '',
  loading = false,
  disabled = false,
  children,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={classNames(VARIANTS[variant] || VARIANTS.primary, className)}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
