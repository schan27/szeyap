import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Select = React.forwardRef(({ className, buttonClassName, spanClassName, value, onValueChange, children, placeholder, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value)
  const dropdownRef = React.useRef(null)

  const handleSelect = (newValue) => {
    setSelectedValue(newValue)
    setIsOpen(false)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  React.useEffect(() => {
    setSelectedValue(value)
  }, [value])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const selectedOption = React.Children.toArray(children).find(
    child => child.props.value === selectedValue
  )

  return (
    <div className={cn("relative", className)} ref={dropdownRef} {...props}>
      <button
        type="button"
        className={cn("flex h-full w-full items-center justify-between bg-white px-3 py-2 text-base sm:text-lg lg:text-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-left", buttonClassName)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={spanClassName}>
          {selectedOption ? selectedOption.props.children : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full z-50 w-full mt-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
          <div className="p-1">
            {React.Children.map(children, (child) => 
              React.cloneElement(child, {
                onClick: () => handleSelect(child.props.value),
                isSelected: child.props.value === selectedValue
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
})
Select.displayName = "Select"

const SelectItem = React.forwardRef(({ className, children, value, onClick, isSelected, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
      isSelected && "bg-accent text-accent-foreground",
      className
    )}
    onClick={onClick}
    {...props}
  >
    {children}
  </div>
))
SelectItem.displayName = "SelectItem"

export { Select, SelectItem }