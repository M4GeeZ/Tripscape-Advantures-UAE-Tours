import { CalendarDays, ChevronDown, Search } from 'lucide-react'

export default function SearchBar() {
  return (
    <form className="tour-search" onSubmit={(event) => event.preventDefault()}>
      <label className="search-field wide">
        <span>Search</span>
        <div><Search size={20} /><input placeholder="e.g. Burj Khalifa" /></div>
      </label>
      <label className="search-field">
        <span>Destination</span>
        <div><strong>Dubai</strong><ChevronDown size={18} /></div>
      </label>
      <label className="search-field">
        <span>Category</span>
        <div><strong>All</strong><ChevronDown size={18} /></div>
      </label>
      <label className="search-field">
        <span>Date</span>
        <div><input type="date" /><CalendarDays size={19} /></div>
      </label>
      <button className="button button-gold search-submit">Search</button>
    </form>
  )
}
