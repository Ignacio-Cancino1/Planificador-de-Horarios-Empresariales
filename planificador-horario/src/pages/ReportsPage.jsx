import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChartBar, FaChartLine, FaChartPie, FaTable } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import styles from './ReportsPage.module.css';

// Datos simulados para los reportes
const generateReportData = () => {
  const employees = [
    { id: 1, name: "Ana López" },
    { id: 2, name: "Carlos Méndez" },
    { id: 3, name: "María González" }
  ];

  const shifts = ["Mañana", "Tarde", "Noche"];
  const months = ["Enero", "Febrero", "Marzo", "Abril"];
  const weeks = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];

  // Datos mensuales
  const monthlyData = months.map(month => {
    const dataPoint = { name: month };
    employees.forEach(emp => {
      dataPoint[emp.name] = Math.floor(Math.random() * 20) + 5; // Turnos aleatorios entre 5-25
    });
    return dataPoint;
  });

  // Datos semanales
  const weeklyData = weeks.map(week => {
    const dataPoint = { name: week };
    employees.forEach(emp => {
      dataPoint[emp.name] = Math.floor(Math.random() * 10) + 2; // Turnos aleatorios entre 2-12
    });
    return dataPoint;
  });

  // Datos por tipo de turno
  const shiftTypeData = shifts.map(shift => ({
    name: shift,
    value: Math.floor(Math.random() * 30) + 10
  }));

  // Datos individuales para un empleado
  const individualData = {
    weekly: weeks.map(week => ({
      name: week,
      turnos: Math.floor(Math.random() * 8) + 3
    })),
    monthly: months.map(month => ({
      name: month,
      turnos: Math.floor(Math.random() * 25) + 10
    }))
  };

  return {
    monthlyData,
    weeklyData,
    shiftTypeData,
    individualData,
    employees
  };
};

const { monthlyData, weeklyData, shiftTypeData, individualData, employees } = generateReportData();

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const ReportsPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('general'); // 'general' o 'individual'
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0].id);
  const [timeRange, setTimeRange] = useState('monthly'); // 'weekly' o 'monthly'
  const [chartType, setChartType] = useState('bar'); // 'bar', 'pie', 'line'

  const renderGeneralCharts = () => (
    <div className={styles.chartsContainer}>
      <div className={styles.chartSection}>
        <h3>Turnos por Mes</h3>
        {chartType === 'bar' ? (
          <BarChart width={600} height={300} data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {employees.map(emp => (
              <Bar key={emp.id} dataKey={emp.name} fill={COLORS[emp.id % COLORS.length]} />
            ))}
          </BarChart>
        ) : chartType === 'line' ? (
          <LineChart width={600} height={300} data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {employees.map(emp => (
              <Line 
                key={emp.id} 
                type="monotone" 
                dataKey={emp.name} 
                stroke={COLORS[emp.id % COLORS.length]} 
              />
            ))}
          </LineChart>
        ) : null}
      </div>

      <div className={styles.chartSection}>
        <h3>Distribución de Turnos</h3>
        <PieChart width={400} height={300}>
          <Pie
            data={shiftTypeData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {shiftTypeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );

  const renderIndividualCharts = () => {
    const employee = employees.find(e => e.id === selectedEmployee);
    const data = timeRange === 'weekly' ? individualData.weekly : individualData.monthly;

    return (
      <div className={styles.chartsContainer}>
        <div className={styles.chartSection}>
          <h3>Turnos de {employee?.name} ({timeRange === 'weekly' ? 'Semanal' : 'Mensual'})</h3>
          {chartType === 'bar' ? (
            <BarChart width={600} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="turnos" fill={COLORS[selectedEmployee % COLORS.length]} />
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart width={600} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="turnos" stroke={COLORS[selectedEmployee % COLORS.length]} />
            </LineChart>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.reportTable}>
                <thead>
                  <tr>
                    <th>Periodo</th>
                    <th>Turnos</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.turnos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.reportsContainer}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        <FaArrowLeft /> Volver
      </button>

      <h1>Reportes de Turnos</h1>

      <div className={styles.controls}>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleButton} ${viewMode === 'general' ? styles.active : ''}`}
            onClick={() => setViewMode('general')}
          >
            <FaChartBar /> Vista General
          </button>
          <button
            className={`${styles.toggleButton} ${viewMode === 'individual' ? styles.active : ''}`}
            onClick={() => setViewMode('individual')}
          >
            <FaChartLine /> Vista Individual
          </button>
        </div>

        {viewMode === 'individual' && (
          <div className={styles.employeeSelector}>
            <label>Empleado:</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(Number(e.target.value))}
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.chartControls}>
          <button
            className={`${styles.chartButton} ${chartType === 'bar' ? styles.active : ''}`}
            onClick={() => setChartType('bar')}
          >
            <FaChartBar /> Barras
          </button>
          <button
            className={`${styles.chartButton} ${chartType === 'line' ? styles.active : ''}`}
            onClick={() => setChartType('line')}
          >
            <FaChartLine /> Líneas
          </button>
          {viewMode === 'individual' && (
            <button
              className={`${styles.chartButton} ${chartType === 'table' ? styles.active : ''}`}
              onClick={() => setChartType('table')}
            >
              <FaTable /> Tabla
            </button>
          )}
        </div>

        {viewMode === 'individual' && (
          <div className={styles.timeRange}>
            <button
              className={`${styles.rangeButton} ${timeRange === 'weekly' ? styles.active : ''}`}
              onClick={() => setTimeRange('weekly')}
            >
              Semanal
            </button>
            <button
              className={`${styles.rangeButton} ${timeRange === 'monthly' ? styles.active : ''}`}
              onClick={() => setTimeRange('monthly')}
            >
              Mensual
            </button>
          </div>
        )}
      </div>

      {viewMode === 'general' ? renderGeneralCharts() : renderIndividualCharts()}
    </div>
  );
};