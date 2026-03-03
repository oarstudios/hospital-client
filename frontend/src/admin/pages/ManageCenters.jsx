import { useState } from "react";

const ManageCenters = () => {
  const [centers, setCenters] = useState([]);
  const [name, setName] = useState("");

  const addCenter = () => {
    if (!name) return;
    setCenters([...centers, { id: Date.now(), name }]);
    setName("");
  };

  const deleteCenter = (id) => {
    setCenters(centers.filter((c) => c.id !== id));
  };

  return (
    <div>
      <h2>Manage Centers</h2>

      <input
        placeholder="Center Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={addCenter}>Add Center</button>

      <ul>
        {centers.map((center) => (
          <li key={center.id}>
            {center.name}
            <button onClick={() => deleteCenter(center.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCenters;