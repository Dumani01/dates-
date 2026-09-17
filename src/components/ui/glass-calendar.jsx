import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths, format, getDate, getDay, getDaysInMonth, isSameDay, isToday, startOfMonth, subMonths } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { motion } from 'framer-motion';

export const GlassCalendar = React.forwardRef(function GlassCalendar(
  { className = '', selectedDate: propSelectedDate, onDateSelect, minDate, ...props }, ref,
) {
  const { t, i18n } = useTranslation();
  const calendarLocale = i18n.language === 'en' ? enUS : es;
  const initialDate = propSelectedDate || minDate || new Date();
  const [currentMonth, setCurrentMonth] = React.useState(initialDate);
  const [selectedDate, setSelectedDate] = React.useState(propSelectedDate || null);

  React.useEffect(() => {
    setSelectedDate(propSelectedDate || null);
    if (propSelectedDate) setCurrentMonth(propSelectedDate);
  }, [propSelectedDate]);

  const monthDays = React.useMemo(() => {
    const start = startOfMonth(currentMonth);
    return Array.from({ length: getDaysInMonth(currentMonth) }, (_, index) => new Date(start.getFullYear(), start.getMonth(), index + 1));
  }, [currentMonth]);
  const firstDayOffset = (getDay(monthDays[0]) + 6) % 7;

  const handleDateClick = (date) => {
    if (minDate && date < minDate && !isSameDay(date, minDate)) return;
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  return (
    <div ref={ref} className={`glass-calendar ${className}`} {...props}>
      <div className="glass-calendar__topbar">
        <span className="glass-calendar__status">{t('dateCopy')}</span>
      </div>
      <div className="glass-calendar__heading">
        <motion.p key={format(currentMonth, 'yyyy-MM')} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="glass-calendar__month">
          {format(currentMonth, 'MMMM yyyy', { locale: calendarLocale })}
        </motion.p>
        <div className="glass-calendar__navigation">
          <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} aria-label={t('previousMonth')}><ChevronLeft size={19} /></button>
          <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} aria-label={t('nextMonth')}><ChevronRight size={19} /></button>
        </div>
      </div>
      <div className="glass-calendar__calendar-grid" role="grid" aria-label={t('monthDays')}>
        {(i18n.language === 'en' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['L', 'M', 'X', 'J', 'V', 'S', 'D']).map((day, index) => <span className="glass-calendar__weekday" role="columnheader" key={`${day}-${index}`}>{day}</span>)}
        {Array.from({ length: firstDayOffset }, (_, index) => <span className="glass-calendar__empty-day" aria-hidden="true" key={`empty-${index}`} />)}
        {monthDays.map((date) => {
          const disabled = minDate && date < minDate && !isSameDay(date, minDate);
          const selected = selectedDate && isSameDay(date, selectedDate);
          return <div className={`glass-calendar__day${disabled ? ' is-disabled' : ''}`} role="gridcell" key={format(date, 'yyyy-MM-dd')}>
            <button type="button" disabled={disabled} aria-label={format(date, 'd MMMM yyyy', { locale: calendarLocale })} aria-pressed={selected} className={selected ? 'is-selected' : ''} onClick={() => handleDateClick(date)}>
              {isToday(date) && !selected && <i aria-hidden="true" />}
              {getDate(date)}
            </button>
          </div>;
        })}
      </div>
      <div className="glass-calendar__divider" />
      <div className="glass-calendar__footer">
        <span><Edit2 size={15} /> {selectedDate ? format(selectedDate, 'd MMM yyyy', { locale: calendarLocale }) : t('choosePerfectDay')}</span>
      </div>
    </div>
  );
});

GlassCalendar.displayName = 'GlassCalendar';
