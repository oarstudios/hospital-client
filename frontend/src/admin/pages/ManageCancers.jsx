import { useState } from "react";

const ManageCancers = () => {
  const [cancers, setCancers] = useState([]);
  const [name, setName] = useState("");

  const addCancer = () => {
    if (!name) return;
    setCancers([...cancers, { id: Date.now(), name }]);
    setName("");
  };

  return (
    <div>
      <h2>Manage Cancer Types</h2>

      <input
        placeholder="Cancer Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={addCancer}>Add Cancer</button>

      <ul>
        {cancers.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCancers;