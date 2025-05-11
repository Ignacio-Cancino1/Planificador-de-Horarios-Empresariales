import { useState, useEffect } from 'react';
import { format, isSameDay, parseISO, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { FaChevronLeft, FaChevronRight, FaFilePdf, FaArrowLeft } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from './ShiftCalendar.module.css';
import { useNavigate } from "react-router-dom";
import api from '../services/api';

export const ShiftCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [empleados, setEmpleados] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empleadosRes = await api.get('/empleados');
        const asignacionesRes = await api.get('/asignaciones');
        const turnosRes = await api.get('/turnos');

        const empleadosData = empleadosRes.data;
        const turnosData = turnosRes.data;

        const turnosCompletos = asignacionesRes.data.map(asignacion => {
          const empleado = empleadosData.find(e => e.id === asignacion.id_empleado || e.id_empleado === asignacion.id_empleado);
          const turno = turnosData.find(t => t.id === asignacion.id_turno || t.id_turno === asignacion.id_turno);

          return {
            id: asignacion.id,
            employeeId: asignacion.id_empleado,
            employeeName: empleado ? `${empleado.nombre} ${empleado.apellido}` : 'Nombre no disponible',
            rol: empleado ? empleado.rol : 'Desconocido',
            date: asignacion.fecha_asignacion.split('T')[0],
            shift: turno ? `${turno.descripcion} (${turno.hora_inicio} - ${turno.hora_fin})` : 'Turno desconocido'
          };
        });

        setEmpleados(empleadosData);
        setTurnos(turnosCompletos);
      } catch (err) {
        console.error('Error cargando datos del calendario:', err);
      }
    };

    fetchData();
  }, []);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDay = monthStart.getDay();
  const emptyStartDays = Array(startDay).fill(null);

  const hasShifts = (day) => {
    if (!day) return false;
    return turnos.some(shift => {
      const shiftDate = parseISO(shift.date);
      return isSameDay(shiftDate, day) && 
        (employeeFilter === '' || shift.employeeId === Number(employeeFilter));
    });
  };

  const filteredShifts = turnos.filter(shift => {
    const shiftDate = parseISO(shift.date);
    return isSameDay(shiftDate, selectedDate) && 
      (employeeFilter === '' || shift.employeeId === Number(employeeFilter));
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text(`Turnos - ${format(currentMonth, 'MMMM yyyy', { locale: es })}`, 14, 15);

    const tableData = turnos
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

    autoTable(doc, {
      head: [['Empleado', 'Fecha', 'Turno']],
      body: tableData,
      startY: 25,
      styles: { fontSize: 10, cellPadding: 3, valign: 'middle' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 20 }
    });

    doc.save(`turnos_${format(currentMonth, 'yyyy-MM')}.pdf`);
  };

  const userRole = JSON.parse(localStorage.getItem('user'))?.role;

  return (
    <div className={styles.calendarContainer}>
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
        {userRole === 'admin' && (
          <div className={styles.filterContainer}>
            <label htmlFor="employeeFilter">Filtrar por empleado:</label>
            <select
              id="employeeFilter"
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Todos los empleados</option>
              {empleados.map(empleado => (
                <option key={empleado.id_empleado || empleado.id} value={empleado.id_empleado || empleado.id}>
                  {empleado.nombre} ({empleado.rol})
                </option>
              ))}
            </select>
          </div>
        )}

        <button onClick={exportToPDF} className={styles.exportButton}>
          <FaFilePdf /> Exportar a PDF
        </button>
      </div>

      <div className={styles.calendarGrid}>
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className={styles.dayHeader}>{day}</div>
        ))}

        {emptyStartDays.map((_, index) => (
          <div key={`empty-start-${index}`} className={styles.emptyDay}></div>
        ))}

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
                  <span className={styles.employeeName}>{shift.employeeName}</span>{' '}
                  <span className={styles.employeeRole}>{shift.rol}</span>
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
