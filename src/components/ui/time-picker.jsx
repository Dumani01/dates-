import { useEffect, useRef, useState } from 'react';

const parseTime = (value) => {
  const match = value?.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);
  return match ? { hour: match[1].padStart(2, '0'), minute: match[2], amPm: match[3] } : null;
};

function TimeSelect({ label, value, placeholder, options, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!selectRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  return (
    <div className="time-select" ref={selectRef}>
      <button
        type="button"
        className="time-select-trigger"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{value || placeholder}</span>
        <span className={`time-select-chevron${open ? ' is-open' : ''}`} aria-hidden="true">⌄</span>
      </button>
      {open && (
        <div className="time-select-menu" role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={value === option}
              className={`time-select-option${value === option ? ' is-selected' : ''}`}
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              <span>{option}</span>
              {value === option && <span aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function TimePicker({ value = '', onChange, disabled = false, error = false, currentTimeLabel = 'Usar hora actual' }) {
  const getDefaultTime = () => {
    const now = new Date();
    return {
      hour: String(now.getHours() % 12 || 12).padStart(2, '0'),
      minute: String(now.getMinutes()).padStart(2, '0'),
      amPm: now.getHours() >= 12 ? 'PM' : 'AM',
    };
  };

  const parsedValue = parseTime(value);
  const [hour, setHour] = useState(parsedValue?.hour || '');
  const [minute, setMinute] = useState(parsedValue?.minute || '');
  const [amPm, setAmPm] = useState(parsedValue?.amPm || 'AM');

  useEffect(() => {
    const parsed = parseTime(value);
    if (parsed) {
      setHour(parsed.hour);
      setMinute(parsed.minute);
      setAmPm(parsed.amPm);
      return;
    }

    const current = getDefaultTime();
    setHour(current.hour);
    setMinute(current.minute);
    setAmPm(current.amPm);
    onChange?.(`${current.hour}:${current.minute} ${current.amPm}`);
  }, [value]);

  const updateTime = (nextHour, nextMinute, nextAmPm) => {
    setHour(nextHour);
    setMinute(nextMinute);
    setAmPm(nextAmPm);

    if (nextHour && nextMinute && nextAmPm) {
      onChange?.(`${nextHour}:${nextMinute} ${nextAmPm}`);
    }
  };

  const setCurrentTime = () => {
    const now = new Date();
    const currentHour = String(now.getHours() % 12 || 12).padStart(2, '0');
    const currentMinute = String(now.getMinutes()).padStart(2, '0');
    const currentAmPm = now.getHours() >= 12 ? 'PM' : 'AM';
    updateTime(currentHour, currentMinute, currentAmPm);
  };

  return (
    <div className={`time-picker-control${error ? ' time-picker-control--error' : ''}`}>
      <div className="time-picker-fields">
        <TimeSelect
          label="Hora"
          value={hour}
          placeholder="HH"
          options={Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'))}
          disabled={disabled}
          onChange={(nextHour) => updateTime(nextHour, minute, amPm)}
        />
        <span className="time-picker-separator">:</span>
        <TimeSelect
          label="Minutos"
          value={minute}
          placeholder="MM"
          options={Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'))}
          disabled={disabled}
          onChange={(nextMinute) => updateTime(hour, nextMinute, amPm)}
        />
        <TimeSelect
          label="AM o PM"
          value={amPm}
          placeholder="AM/PM"
          options={['AM', 'PM']}
          disabled={disabled}
          onChange={(nextAmPm) => updateTime(hour, minute, nextAmPm)}
        />
      </div>
      <button type="button" className="time-picker-now" onClick={setCurrentTime} disabled={disabled}>
        {currentTimeLabel}
      </button>
    </div>
  );
}
