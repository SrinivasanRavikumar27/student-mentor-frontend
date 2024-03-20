import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/student.css";

const baseURL = "https://student-mentor-api-dcco.onrender.com";

function CreateStudent() {
  const [students, setStudents] = useState("");
  const [mentors, setMentors] = useState("");
  const [selectedMentor, setSelectedMentor] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedStudent1, setSelectedStudent1] = useState("");
  const [previousMentor, setPreviousMentor] = useState("");

  const fetchData = async () => {
    await axios
      .get(`${baseURL}/students`)
      .then((response) => {
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

  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    mentorId: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const studentObject = {
        id: formData.studentId,
        name: formData.studentName,
        current_mentor: formData.mentorId,
      };

      console.log(studentObject);

      // Create student
      const response = await axios.post(
        `${baseURL}/students/addStudent`,
        studentObject
      );

      if (response.status === 201) {
        // Reset form data
        setFormData({
          studentId: "",
          studentName: "",
          mentorId: "",
        });

        alert("Student created successfully!");
      }
    } catch (error) {
      console.error("Error creating student:", error);
      alert("Failed to create student.");
    }
  };

  const changeMentor = async (e) => {
    e.preventDefault();

    const response = await axios.patch(
      `${baseURL}/students/${selectedStudent}/assignedMentor/${selectedMentor}`
    );

    if (response.status === 200) {
      setSelectedStudent("");
      setSelectedMentor("");

      alert("Mentor changed successfully!");
    }
  };

  const previousMentor1 = async (e) => {
    e.preventDefault();

    const response = await axios.get(
      `${baseURL}/students/previousMentor/${selectedStudent1}`
    );

    if (response.status === 200) {
      setSelectedStudent1("");
      setPreviousMentor(response.data.data);
    }
  };

  return (
    <div>
      <h1>Create Student</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="studentId">Student ID:</label>
        <input
          type="text"
          id="studentId"
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          placeholder="Enter a unique studentId."
        />

        <label htmlFor="studentName">Student Name:</label>
        <input
          type="text"
          id="studentName"
          name="studentName"
          value={formData.studentName}
          onChange={handleChange}
          placeholder="e.g., John Doe"
        />

        <label htmlFor="mentorId">Mentor Name:</label>
        <select
          name="mentorId"
          value={formData.mentorId}
          onChange={handleChange}
        >
          <option value="">Select Mentor</option>
          {mentors && mentors != ""
            ? mentors.map((mentor) => (
                <option key={mentor.mentorId} value={mentor.mentorId}>
                  {mentor.mentorName}
                </option>
              ))
            : "loading ..."}
        </select>

        <button
          className="btn btn-outline-success text-uppercase font-font-weight-light"
          type="submit"
        >
          Create
        </button>
      </form>

      <br />

      <h1>To change Mentor for particular student</h1>

      <div className="border p-3 w-50 ml-5 rounded">
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">Select student</option>
          {students && students != ""
            ? students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))
            : "loading ..."}
        </select>

        <select
          value={selectedMentor}
          onChange={(e) => setSelectedMentor(e.target.value)}
        >
          <option value="">Select Mentor</option>
          {mentors && mentors != ""
            ? mentors.map((mentor) => (
                <option key={mentor.mentorId} value={mentor.mentorId}>
                  {mentor.mentorName}
                </option>
              ))
            : "loading ..."}
        </select>

        <button
          type="button"
          className="btn btn-outline-primary text-uppercase font-font-weight-light"
          onClick={changeMentor}
        >
          Change Mentor
        </button>
      </div>

      <br />

      <h1>To get previous mentor for sudent</h1>

      <div className="border p-3 w-50 ml-5 rounded">
        <select
          value={selectedStudent1}
          onChange={(e) => setSelectedStudent1(e.target.value)}
        >
          <option value="">Select student</option>
          {students && students != ""
            ? students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))
            : "loading ..."}
        </select>

        <button
          type="button"
          className="btn btn-outline-secondary text-uppercase font-font-weight-light"
          onClick={previousMentor1}
        >
          Show Previous Mentor
        </button>
      </div>

      <br />

      {previousMentor && previousMentor != "" ? (
        <div>
          <table className="table table-striped w-75">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Mentor ID</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>{Object.values(previousMentor.id)}</td>
                <td>{Object.values(previousMentor.name)}</td>
                <td>{Object.values(previousMentor.previous_mentor)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default CreateStudent;
