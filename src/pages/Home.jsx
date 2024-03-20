import axios from "axios";
import React, { useEffect, useState } from "react";
import "../styles/home.css";

const baseURL = "https://student-mentor-api-dcco.onrender.com";

function Home() {
  const [students, setStudents] = useState(null);
  const [mentors, setMentors] = useState(null);

  const fetchData = async () => {
    await axios
      .get(`${baseURL}/students`)
      .then((response) => {
        console.log(response);
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });

    await axios
      .get(`${baseURL}/mentors`)
      .then((response) => {
        setMentors(response.data);
      })
      .catch((error) => {
        console.error("Error fetching mentors:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {students && students != null ? (
        <div>
          <h1>Student List</h1>
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Mentor ID</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.current_mentor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div></div>
      )}

      <br />

      {mentors && mentors != null ? (
        <div>
          <h1>Mentor List</h1>
          <table>
            <thead>
              <tr>
                <th>Mentor ID</th>
                <th>Mentor Name</th>
                <th>Students Assigned</th>
              </tr>
            </thead>
            <tbody>
              {mentors.map((mentor) => (
                <tr key={mentor._id}>
                  <td>{mentor.mentorId}</td>
                  <td>{mentor.mentorName}</td>
                  <td>{mentor.studentsAssigned.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Home;
