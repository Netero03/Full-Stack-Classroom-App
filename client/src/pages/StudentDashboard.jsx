import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogoutButton } from '../components';

const StudentDashboard = () => {
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [timetable, setTimetable] = useState([]);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classroomResponse = await axios.get('http://localhost:5000/api/students/classroom', config);
        setClassroom(classroomResponse.data.classroom);
        setStudents(classroomResponse.data.classmates);

        const timetableResponse = await axios.get('http://localhost:5000/api/students/timetable', config);
        setTimetable(timetableResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='flex flex-col gap-10 p-20 items-center justify-center text-center w-full'>
      <h1 className='font-mono'>Student Dashboard</h1>
      <LogoutButton />
      <div className='flex gap-10'>
        {/* Classroom Details */}
        <div className='border p-5 rounded'>
          <h3 className='text-2xl font-bold'>Classroom Details</h3>
          <div>
            <p><strong>Name: </strong>{classroom?.name}</p>
            <p><strong>Start Time: </strong>{classroom?.startTime}</p>
            <p><strong>End Time: </strong>{classroom?.endTime}</p>
            <p><strong>Days: </strong>{classroom?.days.join(', ')}</p>
            <p><strong>Teacher: </strong>{classroom?.teacher?.name}</p>
          </div>
        </div>
        {/* Students Table */}
        <div className='border p-5 rounded'>
          <h3 className='text-2xl font-bold'>Classmates</h3>
          <ul>
            {students.map((student) => (
              <li key={student._id}>{student.name}</li>
            ))}
          </ul>
        </div>
        {/* Timetable */}
        <div className='border p-5 rounded'>
          <h3 className='text-2xl font-bold'>Timetable</h3>
          <ul>
            {timetable.map((entry) => (
              <li key={entry._id}>
                {entry.day}: {entry.subject} ({entry.startTime} - {entry.endTime})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
