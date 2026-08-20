import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAppointments,
  updateAppointment,
  deleteAppointment,
} from "../../redux/appointments/appointmentsSlice";
import useConfirmDialog from "../../components/Common/useConfirmDialog";

import "./ManageAppointments.css";

const STATUS_OPTIONS = ["Pending", "Confirmed", "Cancelled"];

const ManageAppointments = () => {
  const dispatch = useDispatch();
  const { list = [], loading } = useSelector((state) => state.appointments || {});
  const appointments = Array.isArray(list) ? list : [];
  const [confirm, confirmDialog] = useConfirmDialog();

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const handleStatusChange = async (id, status) => {
    await dispatch(updateAppointment({ id, data: { status } }));
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: "Delete this appointment?",
      message: "This cannot be undone.",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    await dispatch(deleteAppointment(id));
  };

  return (
    <div className="admin-appointments-page">
      <div className="admin-centers-header">
        <h2>Manage Appointments</h2>
        <span className="admin-appointments-count">
          {appointments.length} total
        </span>
      </div>

      <div className="admin-centers-table-wrapper">
        <table className="admin-centers-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Area</th>
              <th>Centre</th>
              <th>Date</th>
              <th>Source</th>
              <th>Status</th>
              <th>Booked On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={10}>Loading…</td>
              </tr>
            )}

            {!loading && appointments.length === 0 && (
              <tr>
                <td colSpan={10}>No appointments booked yet.</td>
              </tr>
            )}

            {!loading &&
              appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.patientName}</td>
                  <td>{a.age ?? "—"}</td>
                  <td>{a.phone}</td>
                  <td>{a.area || "—"}</td>
                  <td>{a.center || "—"}</td>
                  <td>{a.appointmentDate || "—"}</td>
                  <td>{a.source}</td>
                  <td>
                    <select
                      value={a.status}
                      onChange={(e) => handleStatusChange(a.id, e.target.value)}
                      className={`admin-status-select admin-status-${a.status.toLowerCase()}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {a.createdAt
                      ? new Date(a.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="admin-actions">
                    <button
                      className="admin-delete-btn"
                      onClick={() => handleDelete(a.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {confirmDialog}
    </div>
  );
};

export default ManageAppointments;