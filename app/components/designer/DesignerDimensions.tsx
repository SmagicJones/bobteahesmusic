import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "~/firebase/firebaseConfig";

/* =======================
   Types (unchanged)
======================= */

interface Measurement {
  measurementNumber: number;
  value: string;
  label: string;
  notes: string;
}

interface SavedDimension {
  id: string;
  measurementNumber: number;
  value: number;
  label: string;
  notes?: string;
  createdAt: any;
  order: number;
}

interface DesignerDimensionsProps {
  customerId: string;
  projectId: string;
  designerId: string;
}

export default function DesignerDimensions({
  customerId,
  projectId,
  designerId,
}: DesignerDimensionsProps) {
  const [showForm, setShowForm] = useState(false);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [savedDimensions, setSavedDimensions] = useState<SavedDimension[]>([]);
  const [dimensionsLoading, setDimensionsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    value: "",
    label: "",
    notes: "",
  });

  /* =======================
     Load Dimensions (same)
  ======================= */

  useEffect(() => {
    const ref = collection(
      db,
      "users",
      customerId,
      "projects",
      projectId,
      "dimensions",
    );

    const q = query(ref, orderBy("order", "asc"));

    return onSnapshot(q, (snap) => {
      const data: SavedDimension[] = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as SavedDimension,
      );
      setSavedDimensions(data);
      setDimensionsLoading(false);
    });
  }, [customerId, projectId]);

  /* =======================
     Add measurements
  ======================= */

  const addMeasurement = () => {
    const next = savedDimensions.length + measurements.length + 1;
    setMeasurements([
      ...measurements,
      { measurementNumber: next, value: "", label: "", notes: "" },
    ]);
  };

  const updateMeasurement = (
    index: number,
    field: keyof Measurement,
    value: string,
  ) => {
    const copy = [...measurements];
    copy[index] = { ...copy[index], [field]: value };
    setMeasurements(copy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const valid = measurements.filter((m) => m.value.trim() && m.label.trim());

    if (!valid.length) return;

    setSubmitting(true);

    try {
      const ref = collection(
        db,
        "users",
        customerId,
        "projects",
        projectId,
        "dimensions",
      );

      const maxOrder =
        savedDimensions.length > 0
          ? Math.max(...savedDimensions.map((d) => d.order))
          : 0;

      let nextOrder = maxOrder + 1;

      await Promise.all(
        valid.map((m) =>
          addDoc(ref, {
            measurementNumber: nextOrder,
            order: nextOrder++,
            value: parseInt(m.value),
            label: m.label.trim(),
            notes: m.notes.trim() || null,
            createdAt: serverTimestamp(),
            updatedBy: "designer",
            updatedById: designerId,
          }),
        ),
      );

      setMeasurements([]);
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================
     Edit / Delete
  ======================= */

  const handleEdit = (d: SavedDimension) => {
    setEditingId(d.id);
    setEditValues({
      value: d.value.toString(),
      label: d.label,
      notes: d.notes || "",
    });
  };

  const handleUpdate = async (id: string) => {
    const ref = doc(
      db,
      "users",
      customerId,
      "projects",
      projectId,
      "dimensions",
      id,
    );

    await updateDoc(ref, {
      value: parseInt(editValues.value),
      label: editValues.label.trim(),
      notes: editValues.notes.trim() || null,
      updatedBy: "designer",
      updatedById: designerId,
    });

    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this dimension?")) return;

    await deleteDoc(
      doc(db, "users", customerId, "projects", projectId, "dimensions", id),
    );
  };

  /* =======================
     Render
  ======================= */

  return (
    <div className="mt-4 border rounded-lg p-4 bg-indigo-50">
      <div className="flex items-center justify-between mb-3">
        <h5 className="font-semibold text-indigo-700">📐 Dimensions</h5>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm bg-indigo-500 text-white px-3 py-1 rounded"
        >
          {showForm ? "Cancel" : "Add"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3 mb-4">
          {measurements.map((m, i) => (
            <div key={i} className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="mm"
                value={m.value}
                onChange={(e) => updateMeasurement(i, "value", e.target.value)}
                className="border p-2 rounded"
              />
              <input
                placeholder="Label"
                value={m.label}
                onChange={(e) => updateMeasurement(i, "label", e.target.value)}
                className="border p-2 rounded"
              />
              <input
                placeholder="Notes"
                value={m.notes}
                onChange={(e) => updateMeasurement(i, "notes", e.target.value)}
                className="border p-2 rounded"
              />
            </div>
          ))}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={addMeasurement}
              className="text-sm bg-gray-500 text-white px-3 py-1 rounded"
            >
              + Another
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="text-sm bg-green-600 text-white px-4 py-1 rounded"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {dimensionsLoading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : (
        <div className="space-y-2">
          {savedDimensions.map((d) => (
            <div
              key={d.id}
              className="p-2 bg-white rounded border flex justify-between"
            >
              {editingId === d.id ? (
                <div className="flex gap-2 w-full">
                  <input
                    className="border p-1 flex-1"
                    value={editValues.value}
                    onChange={(e) =>
                      setEditValues({ ...editValues, value: e.target.value })
                    }
                  />
                  <input
                    className="border p-1 flex-1"
                    value={editValues.label}
                    onChange={(e) =>
                      setEditValues({ ...editValues, label: e.target.value })
                    }
                  />
                  <button
                    onClick={() => handleUpdate(d.id)}
                    className="text-xs bg-green-500 text-white px-2 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <strong>
                      {d.measurementNumber}. {d.value}mm
                    </strong>{" "}
                    — {d.label}
                    {d.notes && (
                      <div className="text-xs text-gray-500">{d.notes}</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(d)}
                      className="text-xs text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="text-xs text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
