import { useState, useEffect } from 'react';

const DatePicker = ({ value, onChange, placeholder = "Select date" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const [year, setYear] = useState(currentMonth.getFullYear());
  const [month, setMonth] = useState(currentMonth.getMonth());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [showInput, setShowInput] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedDate(date);
      setCurrentMonth(date);
      setYear(date.getFullYear());
      setMonth(date.getMonth());
      setInputValue(value);
    } else {
      // Set default to a reasonable year (18 years ago)
      const today = new Date();
      const defaultYear = today.getFullYear() - 25; // Default to 25 years ago
      setYear(defaultYear);
      setCurrentMonth(new Date(defaultYear, today.getMonth(), 1));
      setInputValue('');
    }
  }, [value]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today; // Birth dates should be in the past, not future
  };

  const isUnder18 = (date) => {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate()) ? age - 1 : age;
    return actualAge < 18;
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
    
    // Format date as YYYY-MM-DD in local timezone to avoid UTC conversion issues
    const yearStr = newDate.getFullYear();
    const monthStr = String(newDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(newDate.getDate()).padStart(2, '0');
    const localDateString = `${yearStr}-${monthStr}-${dayStr}`;
    
    onChange(localDateString);
    setIsOpen(false);
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (month === 0) {
        setMonth(11);
        setYear(year - 1);
      } else {
        setMonth(month - 1);
      }
    } else {
      if (month === 11) {
        setMonth(0);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
      }
    }
  };

  const navigateYear = (direction) => {
    if (direction === 'prev') {
      setYear(year - 1);
    } else {
      setYear(year + 1);
    }
  };

  const selectYear = (selectedYear) => {
    setYear(selectedYear);
    setShowYearPicker(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Try to parse the date
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate()) ? age - 1 : age;
      
      if (actualAge >= 18 && date <= today) {
        setSelectedDate(date);
        setYear(date.getFullYear());
        setMonth(date.getMonth());
        
        // Format date as YYYY-MM-DD in local timezone to avoid UTC conversion issues
        const yearStr = date.getFullYear();
        const monthStr = String(date.getMonth() + 1).padStart(2, '0');
        const dayStr = String(date.getDate()).padStart(2, '0');
        const localDateString = `${yearStr}-${monthStr}-${dayStr}`;
        
        onChange(localDateString);
      }
    }
  };

  const handleInputSubmit = () => {
    const date = new Date(inputValue);
    if (!isNaN(date.getTime())) {
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate()) ? age - 1 : age;
      
      if (actualAge >= 18 && date <= today) {
        setSelectedDate(date);
        setYear(date.getFullYear());
        setMonth(date.getMonth());
        
        // Format date as YYYY-MM-DD in local timezone to avoid UTC conversion issues
        const yearStr = date.getFullYear();
        const monthStr = String(date.getMonth() + 1).padStart(2, '0');
        const dayStr = String(date.getDate()).padStart(2, '0');
        const localDateString = `${yearStr}-${monthStr}-${dayStr}`;
        
        onChange(localDateString);
        setShowInput(false);
        setIsOpen(false);
      }
    }
  };

  const generateYearRange = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 80; i <= currentYear - 18; i++) {
      years.push(i);
    }
    return years;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const calendarDays = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(
        <div key={`empty-${i}`} className="h-5 w-5"></div>
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isPast = isPastDate(date);
      const isUnder18Years = isUnder18(date);
      const isSelectedDate = isSelected(date);
      const isTodayDate = isToday(date);

      calendarDays.push(
        <button
          key={day}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isPast && !isUnder18Years) {
              handleDateSelect(day);
            }
          }}
          disabled={isPast || isUnder18Years}
          className={`
            h-5 w-5 rounded text-xs font-medium transition-all duration-200 flex items-center justify-center
            ${isSelectedDate 
              ? 'bg-primary text-primary-content shadow-md scale-110' 
              : isTodayDate
              ? 'bg-primary/20 text-primary border border-primary'
              : isPast || isUnder18Years
              ? 'text-base-content/30 cursor-not-allowed'
              : 'text-base-content hover:bg-base-200 hover:scale-105'
            }
            ${!isPast && !isUnder18Years ? 'cursor-pointer' : 'cursor-not-allowed'}
          `}
        >
          {day}
        </button>
      );
    }

    return calendarDays;
  };

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2.5 rounded-md border-b border-base-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition text-sm text-left bg-transparent hover:bg-base-100/50"
        >
          {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }) : placeholder}
          <svg
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* DaisyUI Modal for Calendar */}
      <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-xs p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-base">Select Date</h3>
            <button 
              type="button"
              className="btn btn-xs btn-circle btn-ghost"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              ✕
            </button>
          </div>

          {/* Input Option */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-base-content">Quick Entry</h4>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowInput(!showInput);
                }}
                className="btn btn-xs btn-ghost"
              >
                {showInput ? 'Hide' : 'Type Date'}
              </button>
            </div>
            
            {showInput && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="YYYY-MM-DD or MM/DD/YYYY"
                  className="input input-sm w-full"
                />
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleInputSubmit();
                    }}
                    className="btn btn-xs btn-primary flex-1"
                  >
                    Use This Date
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowInput(false);
                    }}
                    className="btn btn-xs btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Month/Year Navigation */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-1">
              <button 
                type="button"
                className="btn btn-xs btn-outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigateYear('prev');
                }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                type="button"
                className="btn btn-xs btn-outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigateMonth('prev');
                }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            <div className="text-center">
              <button 
                type="button"
                className="btn btn-xs btn-ghost px-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowYearPicker(!showYearPicker);
                }}
              >
                {months[month].substring(0, 3)} {year}
              </button>
            </div>

            <div className="flex items-center space-x-1">
              <button 
                type="button"
                className="btn btn-xs btn-outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigateMonth('next');
                }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button 
                type="button"
                className="btn btn-xs btn-outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigateYear('next');
                }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Year Picker */}
          {showYearPicker && (
            <div className="mb-3 p-2 bg-base-200 rounded-lg max-h-24 overflow-y-auto">
              <div className="grid grid-cols-5 gap-1">
                {generateYearRange().map((yearOption) => (
                  <button
                    key={yearOption}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      selectYear(yearOption);
                    }}
                    className={`btn btn-xs ${year === yearOption ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    {yearOption}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-0.5 mb-2">
            {days.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-base-content/60 py-1">
                {day.substring(0, 1)}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {renderCalendar()}
          </div>

          {/* Footer */}
          <div className="mt-3 pt-2 border-t border-base-300">
            <div className="text-xs text-base-content/60 text-center">
              Must be 18+ to register
            </div>
          </div>
        </div>
        <div className="modal-backdrop" onClick={() => setIsOpen(false)}></div>
      </div>
    </>
  );
};

export default DatePicker;
