import { useState } from 'react';
import { format, isSameDay, parseISO, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { FaChevronLeft, FaChevronRight, FaFilePdf, FaArrowLeft } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from './ShiftCalendar.module.css';
import { useNavigate } from "react-router-dom";

// Datos simulados de empleados
const mockEmployees = [
  { id: 1, nombre: "Ana López", rol: "Gerente" },
  { id: 2, nombre: "Carlos Méndez", rol: "Cajero" },
  { id: 3, nombre: "María González", rol: "Supervisor" }
];

// Datos simulados de turnos
const mockShifts = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Ana López",
    date: new Date().toISOString().split('T')[0], // Hoy
    shift: "Mañana (08:00 - 14:00)"
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: "Carlos Méndez",
    date: new Date().toISOString().split('T')[0], // Hoy
    shift: "Tarde (14:00 - 20:00)"
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: "María González",
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Mañana
    shift: "Mañana (08:00 - 14:00)"
  },
  {
    id: 4,
    employeeId: 1,
    employeeName: "Ana López",
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // En 3 días
    shift: "Noche (20:00 - 08:00)"
  }
];

export const ShiftCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [employeeFilter, setEmployeeFilter] = useState('');
  const navigate = useNavigate();

  // Navegación entre meses
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Generar días del mes actual
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Obtener días de la semana anteriores para completar la primera semana
  const startDay = monthStart.getDay();
  const emptyStartDays = Array(startDay).fill(null);

  // Verificar si un día tiene turnos
  const hasShifts = (day) => {
    if (!day) return false;
    return mockShifts.some(shift => {
      const shiftDate = parseISO(shift.date);
      return isSameDay(shiftDate, day) && 
        (employeeFilter === '' || shift.employeeId === Number(employeeFilter));
    });
  };

  // Filtrar turnos para el día seleccionado
  const filteredShifts = mockShifts.filter(shift => {
    const shiftDate = parseISO(shift.date);
    return isSameDay(shiftDate, selectedDate) && 
      (employeeFilter === '' || shift.employeeId === Number(employeeFilter));
  });

  // Exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text(`Turnos - ${format(currentMonth, 'MMMM yyyy', { locale: es })}`, 14, 15);
    
    // Datos de la tabla
    const tableData = mockShifts
      .filter(shift => {
        const shiftDate = parseISO(shift.date);
        return isSameMonth(shiftDate, currentMonth) &&
              (employeeFilter === '' || shift.employeeId === Number(employeeFilter));
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(shift => [
        shift.employeeName,
        format(parseISO(shift.date), 'dd/MM/yyyy'),
        shift.shift
      ]);
    
    // Generar tabla
    autoTable(doc, {
      head: [['Empleado', 'Fecha', 'Turno']],
      body: tableData,
      startY: 25,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 20 }
    });
    
    doc.save(`turnos_${format(currentMonth, 'yyyy-MM')}.pdf`);
  };

  return (
    <div className={styles.calendarContainer}>
      {/* Botón de volver agregado aquí */}
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        <FaArrowLeft /> Volver
      </button>

      <div className={styles.calendarHeader}>
        <button onClick={prevMonth} className={styles.navButton}>
          <FaChevronLeft /> Anterior
        </button>
        <h1>{format(currentMonth, 'MMMM yyyy', { locale: es })}</h1>
        <button onClick={nextMonth} className={styles.navButton}>
          Siguiente <FaChevronRight />
        </button>
      </div>

      <div className={styles.controlsContainer}>
        <div className={styles.filterContainer}>
          <label htmlFor="employeeFilter">Filtrar por empleado:</label>
          <select
            id="employeeFilter"
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todos los empleados</option>
            {mockEmployees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.nombre} ({employee.rol})
              </option>
            ))}
          </select>
        </div>

        <button onClick={exportToPDF} className={styles.exportButton}>
          <FaFilePdf /> Exportar a PDF
        </button>
      </div>

      <div className={styles.calendarGrid}>
        {/* Cabeceras de días de la semana */}
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className={styles.dayHeader}>{day}</div>
        ))}
        
        {/* Días vacíos para alinear el calendario */}
        {emptyStartDays.map((_, index) => (
          <div key={`empty-start-${index}`} className={styles.emptyDay}></div>
        ))}
        
        {/* Días del mes */}
        {monthDays.map((day, index) => {
          const dayHasShifts = hasShifts(day);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div 
              key={`day-${index}`}
              className={`${styles.dayCell} 
                ${dayHasShifts ? styles.hasShifts : ''}
                ${isSelected ? styles.selectedDay : ''}
                ${isToday ? styles.today : ''}`}
              onClick={() => setSelectedDate(day)}
            >
              <div className={styles.dayNumber}>{format(day, 'd')}</div>
              {dayHasShifts && <div className={styles.shiftIndicator}></div>}
              {isToday && <div className={styles.todayIndicator}>Hoy</div>}
            </div>
          );
        })}
      </div>

      <div className={styles.selectedDayInfo}>
        <h2>Turnos para el {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}</h2>
        
        {filteredShifts.length > 0 ? (
          <ul className={styles.shiftsList}>
            {filteredShifts.map(shift => (
              <li key={shift.id} className={styles.shiftItem}>
                <div>
                  <span className={styles.employeeName}>{shift.employeeName}</span>
                  <span className={styles.employeeRole}>
                    {mockEmployees.find(e => e.id === shift.employeeId)?.rol}
                  </span>
                </div>
                <span className={styles.shiftTime}>{shift.shift}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noShifts}>No hay turnos asignados para este día.</p>
        )}
      </div>
    </div>
  );
};