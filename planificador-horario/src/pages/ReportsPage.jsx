import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChartBar, FaChartLine, FaChartPie, FaTable } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import styles from './ReportsPage.module.css';
import api from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const ReportsPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('general');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');
  const [chartType, setChartType] = useState('bar');

  const [employees, setEmployees] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [shiftTypeData, setShiftTypeData] = useState([]);
  const [individualData, setIndividualData] = useState({});

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const res = await api.get('/reportes/turnos');
        const raw = res.data;
        console.log("📊 Datos recibidos:", raw);

        const uniqueEmployees = [...new Map(raw.map(r => [r.id_empleado, {
          id_empleado: r.id_empleado,
          nombre: r.nombre
        }])).values()];

        const monthly = {};
        raw.forEach(r => {
          if (!monthly[r.mes]) monthly[r.mes] = {};
          monthly[r.mes][r.nombre] = (monthly[r.mes][r.nombre] || 0) + 1;
        });
        const monthlyData = Object.entries(monthly).map(([mes, empleados]) => ({
          name: mes,
          ...empleados
        }));

        const weekly = {};
        raw.forEach(r => {
          if (!weekly[r.semana]) weekly[r.semana] = {};
          weekly[r.semana][r.nombre] = (weekly[r.semana][r.nombre] || 0) + 1;
        });
        const weeklyData = Object.entries(weekly).map(([semana, empleados]) => ({
          name: semana,
          ...empleados
        }));

        const shiftTypeMap = {};
        raw.forEach(r => {
          shiftTypeMap[r.turno] = (shiftTypeMap[r.turno] || 0) + 1;
        });
        const shiftTypeData = Object.entries(shiftTypeMap).map(([name, value]) => ({ name, value }));

        const individual = {};
        uniqueEmployees.forEach(emp => {
          individual[emp.id_empleado] = {
            weekly: weeklyData.map(sem => ({
              name: sem.name,
              turnos: sem[emp.nombre] || 0
            })),
            monthly: monthlyData.map(mes => ({
              name: mes.name,
              turnos: mes[emp.nombre] || 0
            }))
          };
        });

        setEmployees(uniqueEmployees);
        setSelectedEmployee(uniqueEmployees[0]?.id_empleado);
        setMonthlyData(monthlyData);
        setWeeklyData(weeklyData);
        setShiftTypeData(shiftTypeData);
        setIndividualData(individual);
      } catch (error) {
        console.error("Error cargando reportes:", error);
      }
    };

    fetchReportData();
  }, []);

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
            {employees.map((emp, i) => (
              <Bar key={emp.id_empleado} dataKey={emp.nombre} fill={COLORS[i % COLORS.length]} />
            ))}
          </BarChart>
        ) : chartType === 'line' ? (
          <LineChart width={600} height={300} data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {employees.map((emp, i) => (
              <Line
                key={emp.id_empleado}
                type="linear"
                dataKey={emp.nombre}
                stroke={COLORS[i % COLORS.length]}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
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
            label={({ name, percent }) => `${name || 'Sin nombre'}: ${(percent * 100).toFixed(0)}%`}
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
    const employee = employees.find(e => e.id_empleado === selectedEmployee);
    const data = timeRange === 'weekly' ? individualData[selectedEmployee]?.weekly : individualData[selectedEmployee]?.monthly;

    return (
      <div className={styles.chartsContainer}>
        <div className={styles.chartSection}>
          <h3>Turnos de {employee?.nombre} ({timeRange === 'weekly' ? 'Semanal' : 'Mensual'})</h3>
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
              <Line
                type="linear"
                dataKey="turnos"
                stroke={COLORS[selectedEmployee % COLORS.length]}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
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
                  {data?.map((item, index) => (
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
                <option key={emp.id_empleado} value={emp.id_empleado}>
                  {emp.nombre}
                </option>
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
