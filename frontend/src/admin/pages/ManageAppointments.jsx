import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAppointments,
  updateAppointment,
  deleteAppointment,
} from "../../redux/appointments/appointmentsSlice";
import useConfirmDialog from "../../components/Common/useConfirmDialog";

import "./ManageAppointments.css";

const STATUS_OPTIONS = ["Pending", "Confirmed", "Cancelled"];
const PAGE_SIZE = 10;

const ManageAppointments = () => {
  const dispatch = useDispatch();
  const {
    list = [],
    loading,
    total = 0,
    page = 1,
    limit = PAGE_SIZE,
    totalPages = 1,
  } = useSelector((state) => state.appointments || {});
  const appointments = Array.isArray(list) ? list : [];
  const [confirm, confirmDialog] = useConfirmDialog();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAppointments({ page: currentPage, limit: PAGE_SIZE }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (!loading && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [loading, currentPage, totalPages]);

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
    dispatch(fetchAppointments({ page: currentPage, limit: PAGE_SIZE }));
  };

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pageButtons = [];
  const windowStart = Math.max(1, currentPage - 2);
  const windowEnd = Math.min(totalPages, windowStart + 4);
  for (let n = windowStart; n <= windowEnd; n += 1) {
    pageButtons.push(n);
  }

  return (
    <div className="admin-appointments-page">
      <div className="admin-centers-header">
        <h2>Manage Appointments</h2>
        <span className="admin-appointments-count">
          {total} total
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
            {loading && appointments.length === 0 && (
              <tr>
                <td colSpan={10}>Loading…</td>
              </tr>
            )}

            {!loading && appointments.length === 0 && (
              <tr>
                <td colSpan={10}>No appointments booked yet.</td>
              </tr>
            )}

            {appointments.map((a) => (
              <tr key={a.id}>
                <td>{a.patientName}</td>
                <td>{a.age ?? "—"}</td>
                <td>{a.phone}</td>
                <td>{a.area || "—"}</td>
                <td>{a.center || "—"}</td>
                <td>{a.appointmentDate || "—"}</td>
                <td>{a.source}</td>
                <td className="admin-status-cell">
                  <label className="admin-status-wrap">
                    <span className="sr-only">Change status</span>
                    <select
                      value={a.status}
                      title="Click to change status"
                      aria-label={`Change status for ${a.patientName}`}
                      onChange={(e) => handleStatusChange(a.id, e.target.value)}
                      className={`admin-status-select admin-status-${String(a.status || "pending").toLowerCase()}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
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

        {total > 0 && (
          <div className="admin-appointments-pagination">
            <span className="admin-appointments-range">
              Showing {from}–{to} of {total}
            </span>
            <div className="admin-appointments-pages">
              <button
                type="button"
                disabled={currentPage <= 1 || loading}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              {pageButtons.map((n) => (
                <button
                  type="button"
                  key={n}
                  className={n === currentPage ? "is-active" : ""}
                  disabled={loading}
                  onClick={() => setCurrentPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage >= totalPages || loading}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      {confirmDialog}
    </div>
  );
};

export default ManageAppointments;
