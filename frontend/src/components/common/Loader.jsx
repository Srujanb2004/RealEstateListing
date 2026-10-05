import { classNames } from '../../utils/helpers'

export default function Loader({ full = false, label = 'Loading...' }) {
  return (
    <div
      className={classNames(
        'flex flex-col items-center justify-center gap-3 text-gray-500',
        full ? 'min-h-[60vh]' : 'py-10',
      )}
    >
      <div className="h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
