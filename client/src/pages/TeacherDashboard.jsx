import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LogoutButton } from '../components';

const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [classroom, setClassroom] = useState({});
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [form, setForm] = useState({
    subject: '',
    day: '',
    startTime: '',
    endTime: ''
  });

  if (!classroom) {
    return <p>No classroom assigned</p>;
  }

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${backendApiUrl}/api/users/classStudents`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setStudents(res.data.data);
      } catch (error) {
        console.error('Error fetching students', error);
      }
    };

    const fetchClassroom = async () => {
      try {
        const response = await axios.get(`${backendApiUrl}/api/teacher/classroom`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setClassroom(response.data.data);

      } catch (error) {
        console.error('Error fetching classroom details:', error);
      }
    };

    fetchStudents();
    fetchTimetables();
    fetchClassroom();
  }, []);

  const fetchTimetables = async () => {
    try {
      const response = await axios.get(`${backendApiUrl}/api/teacher/timetables`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTimetables(response.data);
    } catch (error) {
      console.error('Failed to fetch timetables', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post(`${backendApiUrl}/api/teacher/timetable`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTimetables([...timetables, response.data]);
      setForm({ subject: '', day: '', startTime: '', endTime: '' });
    } catch (error) {
      console.error('Failed to create timetable', error);
    }
  };

  const handleEdit = (timetable) => {
    setEditingTimetable(timetable);
    setForm(timetable);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${backendApiUrl}/api/teacher/timetable/${editingTimetable._id}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTimetables(
        timetables.map((tt) => (tt._id === editingTimetable._id ? response.data : tt))
      );
      setEditingTimetable(null);
      setForm({ subject: '', day: '', startTime: '', endTime: '' });
    } catch (error) {
      console.error('Failed to update timetable', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendApiUrl}/api/teacher/timetable/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTimetables(timetables.filter((tt) => tt._id !== id));
    } catch (error) {
      console.error('Failed to delete timetable', error);
    }
  };

  return (
    <div className='flex flex-col w-full gap-10 p-20 items-center justify-center text-center '>
      <h1 className='font-mono'>Teacher Dashboard</h1>

      <LogoutButton />
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col border p-4 gap-5 rounded'>
          <h2 className='text-2xl font-bold'>Classroom Details</h2>
          <div className='flex gap-5'>
            <p><strong>Classroom Name:</strong> {classroom.name}</p>
            <p><strong>Start Time:</strong> {classroom.startTime}</p>
            <p><strong>End Time:</strong> {classroom.endTime}</p>
            {/* <p><strong>Days:</strong> {classroom.days.join(', ')}</p> */}
          </div>
        </div>
        <div className='flex flex-col border p-4 gap-5 rounded'>
          <h2 className='text-xl font-semibold'>Students in My Classroom</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='flex flex-col border p-4 gap-10 rounded'>
        <h2 className='text-xl font-semibold'>Manage Timetable</h2>

        <div className='flex gap-2'>
          <h3 className='text-xl'>{editingTimetable ? 'Edit Timetable - ' : 'Create Timetable - '}</h3>
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            className='rounded p-2'
          />
          <input
            type="text"
            name="day"
            placeholder="Day"
            value={form.day}
            onChange={handleChange}
            className='rounded p-2'
          />
          <input
            type="time"
            name="startTime"
            placeholder="Start Time"
            value={form.startTime}
            onChange={handleChange}
            className='rounded p-2'
          />
          <input
            type="time"
            name="endTime"
            placeholder="End Time"
            value={form.endTime}
            onChange={handleChange}
            className='rounded p-2'
          />
          {editingTimetable ? (
            <button onClick={handleUpdate}>Update Timetable</button>
          ) : (
            <button onClick={handleCreate}>Create Timetable</button>
          )}
        </div>

        <h2 className='text-xl font-semibold'>Timetables</h2>
        <table>
          <thead>
            <tr>
              <th className='border-r'>Subject</th>
              <th className='border-r'>Day</th>
              <th className='border-r'>Start Time</th>
              <th className='border-r'>End Time</th>
              <th className=''>Actions</th>
            </tr>
          </thead>
          <tbody>
            {timetables.map((timetable) => (
              <tr key={timetable._id}>
                <td>{timetable.subject}</td>
                <td>{timetable.day}</td>
                <td>{timetable.startTime}</td>
                <td>{timetable.endTime}</td>
                <td className='flex gap-2 items-center justify-center'>
                  <button onClick={() => handleEdit(timetable)}>Edit</button>
                  <button onClick={() => handleDelete(timetable._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherDashboard;
