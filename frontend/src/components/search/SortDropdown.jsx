import { SORT_OPTIONS } from '../../utils/constants'

export default function SortDropdown({ value, onChange }) {
  return (
    <select
      className="input w-auto"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
