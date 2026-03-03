import { useState } from "react";

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");

  const addService = () => {
    if (!name) return;
    setServices([...services, { id: Date.now(), name }]);
    setName("");
  };

  return (
    <div>
      <h2>Manage Services</h2>

      <input
        placeholder="Service Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={addService}>Add Service</button>

      <ul>
        {services.map((s) => (
          <li key={s.id}>{s.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ManageServices;