import { useState } from "react";

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [name, setName] = useState("");

  const addDoctor = () => {
    if (!name) return;
    setDoctors([...doctors, { id: Date.now(), name }]);
    setName("");
  };

  return (
    <div>
      <h2>Manage Doctors</h2>

      <input
        placeholder="Doctor Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={addDoctor}>Add Doctor</button>

      <ul>
        {doctors.map((doc) => (
          <li key={doc.id}>{doc.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ManageDoctors;