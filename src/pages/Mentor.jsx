import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/mentor.css";
import { MultiSelect } from "primereact/multiselect";

const baseURL = "https://student-mentor-api-dcco.onrender.com";

function CreateMentor() {
  const [students, setStudents] = useState("");
  const [mentors, setMentors] = useState("");
  const [selectedMentor, setSelectedMentor] = useState("");
  const [selectedMentor1, setSelectedMentor1] = useState("");
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [mentorStudents, setMentorStudents] = useState("");

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
    mentorId: "",
    mentorName: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create mentor
      const response = await axios.post(`${baseURL}/mentors/addMentor`, {
        mentorId: formData.mentorId,
        mentorName: formData.mentorName,
      });

      if (response.status === 201) {
        // Reset form data
        setFormData({
          mentorId: "",
          mentorName: "",
        });

        alert("Mentor created successfully!");
      }
    } catch (error) {
      console.error("Error creating mentor:", error);
      alert("Failed to create mentor.");
    }
  };

  const assignStudents = async (e) => {
    e.preventDefault();

    const object = {
      studentId: selectedStudent.join(","),
    };

    console.log(object);

    const response = await axios.patch(
      `${baseURL}/mentors/${selectedMentor}/student`,
      object
    );

    if (response.status === 200) {
      setSelectedMentor("");
      setSelectedStudent([]);

      alert("Assigned students successfully!");
    }
  };

  const showStudents = async (e) => {
    e.preventDefault();

    const response = await axios.get(
      `${baseURL}/mentors/assignedStudent/${selectedMentor1}`
    );

    if (response.status === 200) {
      setSelectedMentor1("");
      console.log(response.data);
      setMentorStudents(response.data);
    }
  };

  return (
    <div>
      <h1>Create Mentor</h1>
      <form className="mentorAddForm" onSubmit={handleSubmit}>
        <label htmlFor="mentorId">Mentor ID:</label>
        <input
          type="text"
          id="mentorId"
          name="mentorId"
          value={formData.mentorId}
          onChange={handleChange}
          placeholder="Enter a unique mentor ID..."
        />

        <label htmlFor="mentorName">Mentor Name:</label>
        <input
          type="text"
          id="mentorName"
          name="mentorName"
          value={formData.mentorName}
          onChange={handleChange}
          placeholder="Enter the mentor's full name..."
        />

        <button
          className="btn btn-outline-success text-uppercase font-font-weight-light"
          type="submit"
        >
          Create
        </button>
      </form>

      <br />

      <h1>Select Students to Assign this Mentor</h1>

      <div className="assignStudents">
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

        {students && students != "" ? (
          <MultiSelect
            value={selectedStudent}
            filter
            options={students.map((student) => ({
              label: student.name,
              value: student.name,
            }))}
            onChange={(e) => setSelectedStudent(e.value)}
            placeholder="Select Students"
            virtualScrollerOptions={{ itemSize: 43 }}
            maxSelectedLabels={3}
            className="border-light border p-1 w-25 bg-dark rounded"
          />
        ) : (
          <MultiSelect
            filter
            loading
            placeholder="Loading..."
            className="border-light border p-1 w-25 bg-dark rounded"
          />
        )}

        <button
          type="button"
          className="btn btn-outline-primary text-uppercase font-font-weight-light"
          onClick={assignStudents}
        >
          Assign Students
        </button>
      </div>

      <br />

      <h1>To see the list of assigned students to particular mentor.</h1>

      <div className="border p-3 w-75 ml-5 rounded">
        <select
          value={selectedMentor1}
          onChange={(e) => setSelectedMentor1(e.target.value)}
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
          className="btn btn-outline-secondary text-uppercase font-font-weight-light"
          type="button"
          onClick={showStudents}
        >
          Show Students
        </button>
      </div>

      <br />

      {mentorStudents && mentorStudents != "" ? (
        <div>
          <table className="table table-striped w-75">
            <thead>
              <tr>
                <th>Mentor ID</th>
                <th>Mentor Name</th>
                <th>Student Name</th>
              </tr>
            </thead>
            <tbody>
              {/* Map through your data to populate the table */}
              {mentorStudents.map((item) => (
                <tr key={item.id}>
                  <td>{item.mentorId}</td>
                  <td>{item.mentorName}</td>
                  <td>{item.studentsAssigned}</td>
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

export default CreateMentor;
