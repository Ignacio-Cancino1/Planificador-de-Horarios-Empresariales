// src/pages/ShiftCalendar.jsx
import { useState } from 'react';
import { format, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import styles from './ShiftCalendar.module.css';

// Datos simulados de turnos asignados
const mockShifts = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Ana López",
    date: "2023-11-15",
    shift: "Mañana (08:00 - 14:00)"
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: "Carlos Méndez",
    date: "2023-11-15",
    shift: "Tarde (14:00 - 20:00)"
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: "María González",
    date: "2023-11-16",
    shift: "Mañana (08:00 - 14:00)"
  },
  {
    id: 4,
    employeeId: 1,
    employeeName: "Ana López",
    date: "2023-11-18",
    shift: "Noche (20:00 - 08:00)"
  }
];

// Generar días del mes actual
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();
const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
  const day = i + 1;
  return new Date(currentYear, currentMonth, day);
});

export const ShiftCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [selectedDayShifts, setSelectedDayShifts] = useState([]);

  // Verificar qué días tienen turnos
  const hasShifts = (day) => {
    return mockShifts.some(shift => isSameDay(parseISO(shift.date), day));
  };

  // Manejar selección de día
  const handleDayClick = (day) => {
    setSelectedDate(day);
    const shifts = mockShifts.filter(shift => 
      isSameDay(parseISO(shift.date), day)
    );
    setSelectedDayShifts(shifts);
  };

  // Formatear fecha en español
  const formatDate = (date) => {
    return format(date, "EEEE d 'de' MMMM", { locale: es });
  };

  return (
    <div className={styles.calendarContainer}>
      <h1>Calendario de Turnos</h1>
      
      <div className={styles.calendarGrid}>
        {monthDays.map((day, index) => {
          const dayHasShifts = hasShifts(day);
          const isSelected = isSameDay(day, selectedDate);
          
          return (
            <div 
              key={index}
              className={`${styles.dayCell} 
                ${dayHasShifts ? styles.hasShifts : ''}
                ${isSelected ? styles.selectedDay : ''}`}
              onClick={() => handleDayClick(day)}
            >
              <div className={styles.dayNumber}>{format(day, 'd')}</div>
              {dayHasShifts && <div className={styles.shiftIndicator}></div>}
            </div>
          );
        })}
      </div>

      <div className={styles.selectedDayInfo}>
        <h2>Turnos para el {formatDate(selectedDate)}</h2>
        
        {selectedDayShifts.length > 0 ? (
          <ul className={styles.shiftsList}>
            {selectedDayShifts.map(shift => (
              <li key={shift.id} className={styles.shiftItem}>
                <span className={styles.employeeName}>{shift.employeeName}</span>
                <span className={styles.shiftTime}>{shift.shift}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay turnos asignados para este día.</p>
        )}
      </div>
    </div>
  );
};