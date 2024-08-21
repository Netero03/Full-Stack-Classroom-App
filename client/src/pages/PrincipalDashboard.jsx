import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LogoutButton } from '../components';

const PrincipalDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [newClassroom, setNewClassroom] = useState({ name: '', startTime: '', endTime: '', days: [] });
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) throw new Error('No token found, user is not authenticated.');

        const [teacherRes, studentRes, classroomRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users/teachers', config),
          axios.get('http://localhost:5000/api/users/students', config),
          axios.get('http://localhost:5000/api/classrooms', config),
        ]);

        setTeachers(teacherRes.data);
        setStudents(studentRes.data);
        setClassrooms(classroomRes.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, [token]);

  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    try {
      if (!token) throw new Error('No token found, user is not authenticated.');

      await axios.post('http://localhost:5000/api/classrooms', newClassroom, config);
      const classroomRes = await axios.get('http://localhost:5000/api/classrooms', config);
      setClassrooms(classroomRes.data);
      setNewClassroom({ name: '', startTime: '', endTime: '', days: [] });
    } catch (error) {
      console.error('Error creating classroom', error);
    }
  };

  const handleDayChange = (day) => {
    setNewClassroom((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }));
  };

  const handleCreateUser = async (role) => {
    try {
      if (!token) throw new Error('No token found, user is not authenticated.');

      await axios.post('http://localhost:5000/api/users', { ...newUser, role }, config);
      const [teacherRes, studentRes] = await Promise.all([
        axios.get('http://localhost:5000/api/users/teachers', config),
        axios.get('http://localhost:5000/api/users/students', config),
      ]);
      setTeachers(teacherRes.data);
      setStudents(studentRes.data);
      setNewUser({ name: '', email: '', password: '' });
    } catch (error) {
      console.error('Error creating user', error);
    }
  };

  const handleAssign = async (url, data) => {
    try {
      if (!token) throw new Error('No token found, user is not authenticated.');

      await axios.put(url, data, config);
      const classroomRes = await axios.get('http://localhost:5000/api/classrooms', config);
      setClassrooms(classroomRes.data);
    } catch (error) {
      console.error('Error assigning', error);
    }
  };

  const handleAssignStudents = async () => {
    if (!selectedClassroom || selectedStudentIds.length === 0) return;

    try {
      await axios.put(`http://localhost:5000/api/principal/classrooms/${selectedClassroom}/assign-student`, { studentIds: selectedStudentIds }, config);
      setSelectedStudentIds([]); // Clear selection after assignment

      // Fetch the updated classroom data
      const classroomRes = await axios.get(`http://localhost:5000/api/principal/classrooms/${selectedClassroom}`, config);
      setClassrooms(classroomRes.data);
    } catch (error) {
      console.error('Error assigning students', error);
    }
  };


  const handleRemoveTeacher = async () => {
    try {
      if (!selectedClassroom) return;

      await axios.put(
        `http://localhost:5000/api/classrooms/${selectedClassroom}/remove-teacher`,
        {},
        config
      );

      const classroomRes = await axios.get('http://localhost:5000/api/classrooms', config);
      setClassrooms(classroomRes.data);
    } catch (error) {
      console.error('Error removing teacher', error);
    }
  };

  const handleRemoveStudents = async () => {
    try {
      if (!selectedClassroom || selectedStudentIds.length === 0) return;

      await Promise.all(
        selectedStudentIds.map(async studentId => {
          await axios.put(
            `http://localhost:5000/api/classrooms/${selectedClassroom}/remove-student`,
            { studentId },
            config
          );
        })
      );

      const classroomRes = await axios.get('http://localhost:5000/api/classrooms', config);
      setClassrooms(classroomRes.data);
      setSelectedStudentIds([]); // Clear selected students after removal
    } catch (error) {
      console.error('Error removing students', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found, user is not authenticated.');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`http://localhost:5000/api/users/${userId}`, config);
      const [teacherRes, studentRes] = await Promise.all([
        axios.get('http://localhost:5000/api/users/teachers', config),
        axios.get('http://localhost:5000/api/users/students', config),
      ]);
      setTeachers(teacherRes.data);
      setStudents(studentRes.data);
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleDeleteClassroom = async (classroomId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found, user is not authenticated.');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`http://localhost:5000/api/classrooms/${classroomId}`, config);
      const classroomRes = await axios.get('http://localhost:5000/api/classrooms', config);
      setClassrooms(classroomRes.data);
    } catch (error) {
      console.error('Error deleting classroom', error);
    }
  };

  return (
    <div className='flex flex-col gap-10 p-20 items-center justify-center text-center '>
      <h1 className='font-mono'>Principal Dashboard</h1>
      <LogoutButton />
      <div className='flex gap-1'>
        <div className='flex flex-col border rounded p-10 gap-5'>
          <h2 className='text-2xl font-bold'>Create Classroom</h2>
          <form onSubmit={handleCreateClassroom} className='flex flex-col gap-3'>
            {['name'].map((field) => (
              <input
                key={field}
                type="text"
                value={newClassroom[field]}
                onChange={(e) => setNewClassroom({ ...newClassroom, [field]: e.target.value })}
                placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)}`}
                required
                className='rounded p-2'
              />
            ))}
            <label>
              Start Time:
              <input
                type="time"
                value={newClassroom.startTime}
                onChange={(e) => setNewClassroom({ ...newClassroom, startTime: e.target.value })}
                required
                className='rounded p-2'
              />
            </label>
            <label>
              End Time:
              <input
                type="time"
                value={newClassroom.endTime}
                onChange={(e) => setNewClassroom({ ...newClassroom, endTime: e.target.value })}
                required
                className='rounded p-2'
              />
            </label>
            <div className='flex gap-5'>
              <strong>Select Days:</strong>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <label key={day} className="block">
                  <input
                    type="checkbox"
                    value={day}
                    checked={newClassroom.days.includes(day)}
                    onChange={() => handleDayChange(day)}
                  />
                  {day}
                </label>
              ))}
            </div>
            <button type="submit">Create Classroom</button>
          </form>
        </div>

        <div className='flex flex-col border rounded p-10 gap-5'>
          <h2 className='text-2xl font-bold'>Create Teacher or Student</h2>
          {['name', 'email', 'password'].map((field) => (
            <input
              key={field}
              type={field === 'email' ? 'email' : 'text'}
              value={newUser[field]}
              onChange={(e) => setNewUser({ ...newUser, [field]: e.target.value })}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              required
              className='p-2 rounded'
            />
          ))}
          <button onClick={() => handleCreateUser('Teacher')}>Create Teacher</button>
          or
          <button onClick={() => handleCreateUser('Student')}>Create Student</button>
        </div>
      </div>
      <div className='flex border rounded gap-10 p-10'>
        <div className='flex flex-col gap-5'>
          <h2 className='text-2xl font-bold'>Classrooms</h2>
          <select onChange={(e) => setSelectedClassroom(e.target.value)} value={selectedClassroom} className='rounded'>
            <option value="">Select a Classroom</option>
            {classrooms.map((classroom) => (
              <option key={classroom._id} value={classroom._id}>{classroom.name}</option>
            ))}
          </select>
          {selectedClassroom && classrooms
            .filter((classroom) => classroom._id === selectedClassroom)
            .map((classroom) => (
              <div key={classroom._id}>
                <p><strong>Classroom Name:</strong> {classroom.name}</p>
                <p><strong>Start Time:</strong> {classroom.startTime}</p>
                <p><strong>End Time:</strong> {classroom.endTime}</p>
                <p><strong>Days:</strong> {classroom.days.join(', ')}</p>
                <p><strong>Assigned Teacher:</strong> {classroom.teacher?.name || 'No teacher assigned'}</p>
                <div>
                  <strong>Assigned Students:</strong>
                  {classroom.students.length > 0 ? (
                    <ul>
                      {classroom.students.map((student) => (
                        <li key={student._id}>
                          <label>
                            <input
                              type="checkbox"
                              value={student._id}
                              checked={selectedStudentIds.includes(student._id)}
                              onChange={(e) => {
                                const studentId = e.target.value;
                                setSelectedStudentIds((prev) =>
                                  e.target.checked
                                    ? [...prev, studentId]
                                    : prev.filter((id) => id !== studentId)
                                );
                              }}
                            />
                            {student.name}
                          </label>
                        </li>
                      ))}
                    </ul>

                  ) : (
                    <span>No students assigned</span>
                  )}
                  {classroom.students.length > 0 && (
                    <button onClick={handleRemoveStudents}>Remove Selected Students</button>
                  )}
                </div>
                <button onClick={() => handleDeleteClassroom(classroom._id)}>Delete Classroom</button>
              </div>
            ))}

        </div>

        <div className='flex flex-col gap-5'>
          <h2 className='text-xl font-semibold'>Assign Teacher to Classroom</h2>
          <select onChange={(e) => setSelectedClassroom(e.target.value)} value={selectedClassroom} className='rounded'>
            <option value="">Select a Classroom</option>
            {classrooms.map((classroom) => (
              <option key={classroom._id} value={classroom._id}>{classroom.name}</option>
            ))}
          </select>
          <select onChange={(e) => setSelectedTeacherId(e.target.value)} value={selectedTeacherId} className='rounded'>
            <option value="">Select a Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
            ))}
          </select>
          <button onClick={() => handleAssign(`http://localhost:5000/api/classrooms/${selectedClassroom}/assign-teacher`, { teacherId: selectedTeacherId })}>Assign Teacher</button>
        </div>

        <div className='flex flex-col gap-5'>
          <h2 className='text-xl font-semibold'>Assign Students to Classroom</h2>
          <select multiple onChange={(e) => setSelectedStudentIds([...e.target.selectedOptions].map((option) => option.value))} value={selectedStudentIds} className='rounded h-[100px]' >
            {students.map((student) => (
              <option key={student._id} value={student._id}>{student.name}</option>
            ))}
          </select>
          <button onClick={() => handleAssignStudents(selectedStudentIds)}>Assign Students</button>
        </div>
      </div>
      <h2 className='text-4xl font-bold'>Manage Users</h2>
      <div className='flex gap-4'>
        <div className='border p-5 rounded'>
          <h3 className='text-2xl font-bold'>Teachers</h3>
          <ul>
            {teachers.map((teacher) => {
              const assignedClassroom = classrooms.find((classroom) => classroom.teacher && classroom.teacher._id === teacher._id);
              return (
                <li key={teacher._id}>
                  {teacher.name} ({teacher.email})
                  {assignedClassroom ? (
                    <span> - Assigned to: {assignedClassroom.name}</span>
                  ) : (
                    <span> - Not assigned to any classroom</span>
                  )}
                  <button onClick={() => handleDeleteUser(teacher._id)}>Delete</button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className='border p-5 rounded'>
          <h3 className='text-2xl font-bold' >Students</h3>
          <ul>
            {students.map((student) => {
              const assignedClassroom = classrooms.find((classroom) =>
                classroom.students.findIndex((s) => s._id === student._id) !== -1
              );

              return (
                <li key={student._id}> {/* Unique key prop */}
                  {student.name} ({student.email})
                  {assignedClassroom ? (
                    <span> - Assigned to: {assignedClassroom.name}</span>
                  ) : (
                    <span></span>
                  )}
                  <button onClick={() => handleDeleteUser(student._id)}>Delete</button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrincipalDashboard;
