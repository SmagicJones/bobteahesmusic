// app/components/user/DimensionsForm.tsx
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

interface Measurement {
  id?: string;
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

interface DimensionsFormProps {
  userId: string;
  projectId: string;
}

export default function DimensionsForm({
  userId,
  projectId,
}: DimensionsFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [savedDimensions, setSavedDimensions] = useState<SavedDimension[]>([]);
  const [dimensionsLoading, setDimensionsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    value: string;
    label: string;
    notes: string;
  }>({ value: "", label: "", notes: "" });

  // Fetch saved dimensions in real-time
  useEffect(() => {
    const dimensionsRef = collection(
      db,
      "users",
      userId,
      "projects",
      projectId,
      "dimensions",
    );
    const q = query(dimensionsRef, orderBy("order", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dimensionsData: SavedDimension[] = [];
      snapshot.forEach((doc) => {
        dimensionsData.push({
          id: doc.id,
          ...doc.data(),
        } as SavedDimension);
      });
      setSavedDimensions(dimensionsData);
      setDimensionsLoading(false);
    });

    return () => unsubscribe();
  }, [userId, projectId]);

  // Initialize measurements when form opens
  useEffect(() => {
    if (showForm && measurements.length === 0) {
      const nextNumber = savedDimensions.length + 1;
      setMeasurements([
        { measurementNumber: nextNumber, value: "", label: "", notes: "" },
      ]);
    }
  }, [showForm, savedDimensions.length]);

  const addMeasurement = () => {
    const nextNumber = savedDimensions.length + measurements.length + 1;
    setMeasurements([
      ...measurements,
      {
        measurementNumber: nextNumber,
        value: "",
        label: "",
        notes: "",
      },
    ]);
  };

  const removeMeasurement = (index: number) => {
    if (measurements.length === 1) return; // Keep at least one
    const updated = measurements.filter((_, i) => i !== index);
    // Renumber measurements
    const renumbered = updated.map((m, i) => ({
      ...m,
      measurementNumber: i + 1,
    }));
    setMeasurements(renumbered);
  };

  const updateMeasurement = (
    index: number,
    field: keyof Measurement,
    value: string,
  ) => {
    const updated = [...measurements];
    updated[index] = { ...updated[index], [field]: value };
    setMeasurements(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least one measurement has value and label
    const validMeasurements = measurements.filter(
      (m) => m.value.trim() && m.label.trim(),
    );

    if (validMeasurements.length === 0) {
      alert("Please add at least one measurement with a value and label");
      return;
    }

    setSubmitting(true);

    try {
      const dimensionsRef = collection(
        db,
        "users",
        userId,
        "projects",
        projectId,
        "dimensions",
      );

      // Get current max order number
      const currentMaxOrder =
        savedDimensions.length > 0
          ? Math.max(...savedDimensions.map((d) => d.order))
          : 0;

      // Save each valid measurement to Firestore with sequential numbering
      let nextOrderNumber = currentMaxOrder + 1;
      const savePromises = validMeasurements.map((m) => {
        const orderNum = nextOrderNumber++;
        return addDoc(dimensionsRef, {
          measurementNumber: orderNum,
          value: parseInt(m.value),
          label: m.label.trim(),
          notes: m.notes.trim() || null,
          createdAt: serverTimestamp(),
          order: orderNum,
        });
      });

      await Promise.all(savePromises);

      // Create formatted message with proper numbering
      let messageText = "📏 Dimensions Added:\n\n";
      let messageOrderNumber = currentMaxOrder + 1;
      validMeasurements.forEach((m) => {
        messageText += `${messageOrderNumber}. ${parseInt(m.value).toLocaleString()}mm - ${m.label}`;
        if (m.notes.trim()) {
          messageText += `\n   Notes: ${m.notes}`;
        }
        messageText += "\n\n";
        messageOrderNumber++;
      });

      // Add message to project messages
      await addDoc(
        collection(db, "users", userId, "projects", projectId, "messages"),
        {
          text: messageText.trim(),
          sender: "customer",
          createdAt: serverTimestamp(),
          read: false,
        },
      );

      // Reset form
      setMeasurements([]);
      setShowForm(false);
      alert("Dimensions saved successfully!");
    } catch (error) {
      console.error("Error saving dimensions:", error);
      alert("Failed to save dimensions");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (dimension: SavedDimension) => {
    setEditingId(dimension.id);
    setEditValues({
      value: dimension.value.toString(),
      label: dimension.label,
      notes: dimension.notes || "",
    });
  };

  const handleUpdate = async (dimensionId: string) => {
    if (!editValues.value.trim() || !editValues.label.trim()) {
      alert("Value and label are required");
      return;
    }

    try {
      const dimensionRef = doc(
        db,
        "users",
        userId,
        "projects",
        projectId,
        "dimensions",
        dimensionId,
      );
      await updateDoc(dimensionRef, {
        value: parseInt(editValues.value),
        label: editValues.label.trim(),
        notes: editValues.notes.trim() || null,
      });
      setEditingId(null);
      setEditValues({ value: "", label: "", notes: "" });
    } catch (error) {
      console.error("Error updating dimension:", error);
      alert("Failed to update dimension");
    }
  };

  const handleDelete = async (dimensionId: string) => {
    if (!confirm("Are you sure you want to delete this dimension?")) return;

    try {
      // Delete the dimension
      const dimensionRef = doc(
        db,
        "users",
        userId,
        "projects",
        projectId,
        "dimensions",
        dimensionId,
      );
      await deleteDoc(dimensionRef);

      // Renumber remaining dimensions
      const remainingDimensions = savedDimensions.filter(
        (d) => d.id !== dimensionId,
      );

      // Update each dimension with new sequential numbers
      const updatePromises = remainingDimensions.map((dimension, index) => {
        const newOrder = index + 1;
        const dimRef = doc(
          db,
          "users",
          userId,
          "projects",
          projectId,
          "dimensions",
          dimension.id,
        );
        return updateDoc(dimRef, {
          measurementNumber: newOrder,
          order: newOrder,
        });
      });

      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error deleting dimension:", error);
      alert("Failed to delete dimension");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValues({ value: "", label: "", notes: "" });
  };

  return (
    <div className="mt-4">
      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) setMeasurements([]); // Reset when closing
          }}
          className="bg-indigo-500 text-white text-sm py-2 px-4 rounded hover:bg-indigo-600"
        >
          {showForm ? "Cancel Adding Dimensions" : "📏 Add Dimensions"}
        </button>
        {savedDimensions.length > 0 && (
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="bg-gray-500 text-white text-sm py-2 px-4 rounded hover:bg-gray-600"
          >
            {showSaved
              ? "Hide Saved Dimensions"
              : `View Saved Dimensions (${savedDimensions.length})`}
          </button>
        )}
      </div>

      {/* Dimensions Form */}
      {showForm && (
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 mb-4">
          <div className="mb-4 p-3 bg-blue-100 rounded border border-blue-300">
            <p className="text-sm text-blue-800 font-semibold mb-1">
              📐 Measuring Instructions:
            </p>
            <p className="text-xs text-blue-700">
              Enter the room, turn left immediately, and start measuring from
              the architraves (wooden borders around doors/windows). All
              measurements in millimeters (mm).
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-4">
              {measurements.map((measurement, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg border border-gray-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h6 className="font-semibold text-gray-700">
                      Measurement {measurement.measurementNumber}
                    </h6>
                    {measurements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMeasurement(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Value Input */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Value (mm) *
                      </label>
                      <input
                        type="number"
                        value={measurement.value}
                        onChange={(e) =>
                          updateMeasurement(index, "value", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
                        placeholder="e.g., 2450"
                        required
                      />
                    </div>

                    {/* Label Input */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Label *
                      </label>
                      <input
                        type="text"
                        value={measurement.label}
                        onChange={(e) =>
                          updateMeasurement(index, "label", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
                        placeholder="e.g., Wall 1 - Left to Door"
                        required
                      />
                    </div>

                    {/* Notes Input */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Notes (optional)
                      </label>
                      <input
                        type="text"
                        value={measurement.notes}
                        onChange={(e) =>
                          updateMeasurement(index, "notes", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
                        placeholder="e.g., Includes skirting"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={addMeasurement}
                className="bg-gray-500 text-white text-sm py-2 px-4 rounded hover:bg-gray-600"
              >
                ➕ Add Another Measurement
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-500 text-white text-sm py-2 px-6 rounded hover:bg-indigo-600 disabled:bg-gray-400"
              >
                {submitting ? "Saving..." : "💾 Save Dimensions"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Saved Dimensions List */}
      {showSaved && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
          <h6 className="font-semibold text-gray-700 mb-3">Saved Dimensions</h6>

          {dimensionsLoading ? (
            <div className="text-center py-4 text-gray-500">
              Loading dimensions...
            </div>
          ) : savedDimensions.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No dimensions saved yet.
            </div>
          ) : (
            <div className="space-y-3">
              {savedDimensions.map((dimension) => (
                <div
                  key={dimension.id}
                  className="p-3 bg-white rounded border border-gray-300"
                >
                  {editingId === dimension.id ? (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Value (mm)
                          </label>
                          <input
                            type="number"
                            value={editValues.value}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                value: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Label
                          </label>
                          <input
                            type="text"
                            value={editValues.label}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                label: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Notes
                          </label>
                          <input
                            type="text"
                            value={editValues.notes}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                notes: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(dimension.id)}
                          className="bg-green-500 text-white text-xs py-1 px-3 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 text-white text-xs py-1 px-3 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {dimension.measurementNumber}.{" "}
                            {dimension.value.toLocaleString()}mm -{" "}
                            {dimension.label}
                          </p>
                          {dimension.notes && (
                            <p className="text-sm text-gray-600 mt-1">
                              Notes: {dimension.notes}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            Added:{" "}
                            {dimension.createdAt
                              ? new Date(
                                  dimension.createdAt.seconds * 1000,
                                ).toLocaleString()
                              : "Just now"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(dimension)}
                            className="bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(dimension.id)}
                            className="bg-red-500 text-white text-xs py-1 px-2 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// // app/components/user/DimensionsForm.tsx
// import { useState, useEffect } from "react";
// import {
//   collection,
//   addDoc,
//   serverTimestamp,
//   query,
//   orderBy,
//   onSnapshot,
//   deleteDoc,
//   doc,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "~/firebase/firebaseConfig";

// interface Measurement {
//   id?: string;
//   measurementNumber: number;
//   value: string;
//   label: string;
//   notes: string;
// }

// interface SavedDimension {
//   id: string;
//   measurementNumber: number;
//   value: number;
//   label: string;
//   notes?: string;
//   createdAt: any;
//   order: number;
// }

// interface DimensionsFormProps {
//   userId: string;
//   projectId: string;
// }

// export default function DimensionsForm({
//   userId,
//   projectId,
// }: DimensionsFormProps) {
//   const [showForm, setShowForm] = useState(false);
//   const [showSaved, setShowSaved] = useState(false);
//   const [measurements, setMeasurements] = useState<Measurement[]>([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [savedDimensions, setSavedDimensions] = useState<SavedDimension[]>([]);
//   const [dimensionsLoading, setDimensionsLoading] = useState(true);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editValues, setEditValues] = useState<{
//     value: string;
//     label: string;
//     notes: string;
//   }>({ value: "", label: "", notes: "" });

//   // Fetch saved dimensions in real-time
//   useEffect(() => {
//     const dimensionsRef = collection(
//       db,
//       "users",
//       userId,
//       "projects",
//       projectId,
//       "dimensions",
//     );
//     const q = query(dimensionsRef, orderBy("order", "asc"));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const dimensionsData: SavedDimension[] = [];
//       snapshot.forEach((doc) => {
//         dimensionsData.push({
//           id: doc.id,
//           ...doc.data(),
//         } as SavedDimension);
//       });
//       setSavedDimensions(dimensionsData);
//       setDimensionsLoading(false);
//     });

//     return () => unsubscribe();
//   }, [userId, projectId]);

//   // Initialize measurements when form opens
//   useEffect(() => {
//     if (showForm && measurements.length === 0) {
//       const nextNumber = savedDimensions.length + 1;
//       setMeasurements([
//         { measurementNumber: nextNumber, value: "", label: "", notes: "" },
//       ]);
//     }
//   }, [showForm, savedDimensions.length]);

//   const addMeasurement = () => {
//     const nextNumber = savedDimensions.length + measurements.length + 1;
//     setMeasurements([
//       ...measurements,
//       {
//         measurementNumber: nextNumber,
//         value: "",
//         label: "",
//         notes: "",
//       },
//     ]);
//   };

//   const removeMeasurement = (index: number) => {
//     if (measurements.length === 1) return; // Keep at least one
//     const updated = measurements.filter((_, i) => i !== index);
//     // Renumber measurements
//     const renumbered = updated.map((m, i) => ({
//       ...m,
//       measurementNumber: i + 1,
//     }));
//     setMeasurements(renumbered);
//   };

//   const updateMeasurement = (
//     index: number,
//     field: keyof Measurement,
//     value: string,
//   ) => {
//     const updated = [...measurements];
//     updated[index] = { ...updated[index], [field]: value };
//     setMeasurements(updated);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate that at least one measurement has value and label
//     const validMeasurements = measurements.filter(
//       (m) => m.value.trim() && m.label.trim(),
//     );

//     if (validMeasurements.length === 0) {
//       alert("Please add at least one measurement with a value and label");
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const dimensionsRef = collection(
//         db,
//         "users",
//         userId,
//         "projects",
//         projectId,
//         "dimensions",
//       );

//       // Get current max order number
//       const currentMaxOrder =
//         savedDimensions.length > 0
//           ? Math.max(...savedDimensions.map((d) => d.order))
//           : 0;

//       // Save each valid measurement to Firestore with sequential numbering
//       let nextOrderNumber = currentMaxOrder + 1;
//       const savePromises = validMeasurements.map((m) => {
//         const orderNum = nextOrderNumber++;
//         return addDoc(dimensionsRef, {
//           measurementNumber: orderNum,
//           value: parseInt(m.value),
//           label: m.label.trim(),
//           notes: m.notes.trim() || null,
//           createdAt: serverTimestamp(),
//           order: orderNum,
//         });
//       });

//       await Promise.all(savePromises);

//       // Create formatted message with proper numbering
//       let messageText = "📏 Dimensions Added:\n\n";
//       let messageOrderNumber = currentMaxOrder + 1;
//       validMeasurements.forEach((m) => {
//         messageText += `${messageOrderNumber}. ${parseInt(m.value).toLocaleString()}mm - ${m.label}`;
//         if (m.notes.trim()) {
//           messageText += `\n   Notes: ${m.notes}`;
//         }
//         messageText += "\n\n";
//         messageOrderNumber++;
//       });

//       // Add message to project messages
//       await addDoc(
//         collection(db, "users", userId, "projects", projectId, "messages"),
//         {
//           text: messageText.trim(),
//           sender: "customer",
//           createdAt: serverTimestamp(),
//           read: false,
//         },
//       );

//       // Reset form
//       setMeasurements([]);
//       setShowForm(false);
//       alert("Dimensions saved successfully!");
//     } catch (error) {
//       console.error("Error saving dimensions:", error);
//       alert("Failed to save dimensions");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleEdit = (dimension: SavedDimension) => {
//     setEditingId(dimension.id);
//     setEditValues({
//       value: dimension.value.toString(),
//       label: dimension.label,
//       notes: dimension.notes || "",
//     });
//   };

//   const handleUpdate = async (dimensionId: string) => {
//     if (!editValues.value.trim() || !editValues.label.trim()) {
//       alert("Value and label are required");
//       return;
//     }

//     try {
//       const dimensionRef = doc(
//         db,
//         "users",
//         userId,
//         "projects",
//         projectId,
//         "dimensions",
//         dimensionId,
//       );
//       await updateDoc(dimensionRef, {
//         value: parseInt(editValues.value),
//         label: editValues.label.trim(),
//         notes: editValues.notes.trim() || null,
//       });
//       setEditingId(null);
//       setEditValues({ value: "", label: "", notes: "" });
//     } catch (error) {
//       console.error("Error updating dimension:", error);
//       alert("Failed to update dimension");
//     }
//   };

//   const handleDelete = async (dimensionId: string) => {
//     if (!confirm("Are you sure you want to delete this dimension?")) return;

//     try {
//       const dimensionRef = doc(
//         db,
//         "users",
//         userId,
//         "projects",
//         projectId,
//         "dimensions",
//         dimensionId,
//       );
//       await deleteDoc(dimensionRef);
//     } catch (error) {
//       console.error("Error deleting dimension:", error);
//       alert("Failed to delete dimension");
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditValues({ value: "", label: "", notes: "" });
//   };

//   return (
//     <div className="mt-4">
//       {/* Action Buttons */}
//       <div className="flex gap-2 mb-4">
//         <button
//           onClick={() => {
//             setShowForm(!showForm);
//             if (showForm) setMeasurements([]); // Reset when closing
//           }}
//           className="bg-indigo-500 text-white text-sm py-2 px-4 rounded hover:bg-indigo-600"
//         >
//           {showForm ? "Cancel Adding Dimensions" : "📏 Add Dimensions"}
//         </button>
//         {savedDimensions.length > 0 && (
//           <button
//             onClick={() => setShowSaved(!showSaved)}
//             className="bg-gray-500 text-white text-sm py-2 px-4 rounded hover:bg-gray-600"
//           >
//             {showSaved
//               ? "Hide Saved Dimensions"
//               : `View Saved Dimensions (${savedDimensions.length})`}
//           </button>
//         )}
//       </div>

//       {/* Dimensions Form */}
//       {showForm && (
//         <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 mb-4">
//           <div className="mb-4 p-3 bg-blue-100 rounded border border-blue-300">
//             <p className="text-sm text-blue-800 font-semibold mb-1">
//               📐 Measuring Instructions:
//             </p>
//             <p className="text-xs text-blue-700">
//               Enter the room, turn left immediately, and start measuring from
//               the architraves (wooden borders around doors/windows). All
//               measurements in millimeters (mm).
//             </p>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="space-y-4 mb-4">
//               {measurements.map((measurement, index) => (
//                 <div
//                   key={index}
//                   className="p-4 bg-white rounded-lg border border-gray-300"
//                 >
//                   <div className="flex items-center justify-between mb-3">
//                     <h6 className="font-semibold text-gray-700">
//                       Measurement {measurement.measurementNumber}
//                     </h6>
//                     {measurements.length > 1 && (
//                       <button
//                         type="button"
//                         onClick={() => removeMeasurement(index)}
//                         className="text-red-500 hover:text-red-700 text-sm"
//                       >
//                         ✕ Remove
//                       </button>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                     {/* Value Input */}
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">
//                         Value (mm) *
//                       </label>
//                       <input
//                         type="number"
//                         value={measurement.value}
//                         onChange={(e) =>
//                           updateMeasurement(index, "value", e.target.value)
//                         }
//                         className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
//                         placeholder="e.g., 2450"
//                         required
//                       />
//                     </div>

//                     {/* Label Input */}
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">
//                         Label *
//                       </label>
//                       <input
//                         type="text"
//                         value={measurement.label}
//                         onChange={(e) =>
//                           updateMeasurement(index, "label", e.target.value)
//                         }
//                         className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
//                         placeholder="e.g., Wall 1 - Left to Door"
//                         required
//                       />
//                     </div>

//                     {/* Notes Input */}
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">
//                         Notes (optional)
//                       </label>
//                       <input
//                         type="text"
//                         value={measurement.notes}
//                         onChange={(e) =>
//                           updateMeasurement(index, "notes", e.target.value)
//                         }
//                         className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
//                         placeholder="e.g., Includes skirting"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 onClick={addMeasurement}
//                 className="bg-gray-500 text-white text-sm py-2 px-4 rounded hover:bg-gray-600"
//               >
//                 ➕ Add Another Measurement
//               </button>
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="bg-indigo-500 text-white text-sm py-2 px-6 rounded hover:bg-indigo-600 disabled:bg-gray-400"
//               >
//                 {submitting ? "Saving..." : "💾 Save Dimensions"}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Saved Dimensions List */}
//       {showSaved && (
//         <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
//           <h6 className="font-semibold text-gray-700 mb-3">Saved Dimensions</h6>

//           {dimensionsLoading ? (
//             <div className="text-center py-4 text-gray-500">
//               Loading dimensions...
//             </div>
//           ) : savedDimensions.length === 0 ? (
//             <div className="text-center py-4 text-gray-500">
//               No dimensions saved yet.
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {savedDimensions.map((dimension) => (
//                 <div
//                   key={dimension.id}
//                   className="p-3 bg-white rounded border border-gray-300"
//                 >
//                   {editingId === dimension.id ? (
//                     <div>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
//                         <div>
//                           <label className="block text-xs font-medium text-gray-700 mb-1">
//                             Value (mm)
//                           </label>
//                           <input
//                             type="number"
//                             value={editValues.value}
//                             onChange={(e) =>
//                               setEditValues({
//                                 ...editValues,
//                                 value: e.target.value,
//                               })
//                             }
//                             className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs font-medium text-gray-700 mb-1">
//                             Label
//                           </label>
//                           <input
//                             type="text"
//                             value={editValues.label}
//                             onChange={(e) =>
//                               setEditValues({
//                                 ...editValues,
//                                 label: e.target.value,
//                               })
//                             }
//                             className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs font-medium text-gray-700 mb-1">
//                             Notes
//                           </label>
//                           <input
//                             type="text"
//                             value={editValues.notes}
//                             onChange={(e) =>
//                               setEditValues({
//                                 ...editValues,
//                                 notes: e.target.value,
//                               })
//                             }
//                             className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
//                           />
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleUpdate(dimension.id)}
//                           className="bg-green-500 text-white text-xs py-1 px-3 rounded hover:bg-green-600"
//                         >
//                           Save
//                         </button>
//                         <button
//                           onClick={handleCancelEdit}
//                           className="bg-gray-500 text-white text-xs py-1 px-3 rounded hover:bg-gray-600"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <>
//                       <div className="flex items-start justify-between mb-2">
//                         <div className="flex-1">
//                           <p className="font-semibold text-gray-800">
//                             {dimension.measurementNumber}.{" "}
//                             {dimension.value.toLocaleString()}mm -{" "}
//                             {dimension.label}
//                           </p>
//                           {dimension.notes && (
//                             <p className="text-sm text-gray-600 mt-1">
//                               Notes: {dimension.notes}
//                             </p>
//                           )}
//                           <p className="text-xs text-gray-400 mt-1">
//                             Added:{" "}
//                             {dimension.createdAt
//                               ? new Date(
//                                   dimension.createdAt.seconds * 1000,
//                                 ).toLocaleString()
//                               : "Just now"}
//                           </p>
//                         </div>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleEdit(dimension)}
//                             className="bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(dimension.id)}
//                             className="bg-red-500 text-white text-xs py-1 px-2 rounded hover:bg-red-600"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // app/components/user/DimensionsForm.tsx
// import { useState, useEffect } from "react";
// import {
//   collection,
//   addDoc,
//   serverTimestamp,
//   query,
//   orderBy,
//   onSnapshot,
//   deleteDoc,
//   doc,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "~/firebase/firebaseConfig";

// interface Measurement {
//   id?: string;
//   measurementNumber: number;
//   value: string;
//   label: string;
//   notes: string;
// }

// interface SavedDimension {
//   id: string;
//   measurementNumber: number;
//   value: number;
//   label: string;
//   notes?: string;
//   createdAt: any;
//   order: number;
// }

// interface DimensionsFormProps {
//   userId: string;
//   projectId: string;
// }

// export default function DimensionsForm({
//   userId,
//   projectId,
// }: DimensionsFormProps) {
//   const [showForm, setShowForm] = useState(false);
//   const [showSaved, setShowSaved] = useState(false);
//   const [measurements, setMeasurements] = useState<Measurement[]>([
//     { measurementNumber: 1, value: "", label: "", notes: "" },
//   ]);
//   const [submitting, setSubmitting] = useState(false);
//   const [savedDimensions, setSavedDimensions] = useState<SavedDimension[]>([]);
//   const [dimensionsLoading, setDimensionsLoading] = useState(true);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editValues, setEditValues] = useState<{
//     value: string;
//     label: string;
//     notes: string;
//   }>({ value: "", label: "", notes: "" });

//   // Fetch saved dimensions in real-time
//   useEffect(() => {
//     const dimensionsRef = collection(
//       db,
//       "users",
//       userId,
//       "projects",
//       projectId,
//       "dimensions",
//     );
//     const q = query(dimensionsRef, orderBy("order", "asc"));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const dimensionsData: SavedDimension[] = [];
//       snapshot.forEach((doc) => {
//         dimensionsData.push({
//           id: doc.id,
//           ...doc.data(),
//         } as SavedDimension);
//       });
//       setSavedDimensions(dimensionsData);
//       setDimensionsLoading(false);
//     });

//     return () => unsubscribe();
//   }, [userId, projectId]);

//   const addMeasurement = () => {
//     setMeasurements([
//       ...measurements,
//       {
//         measurementNumber: measurements.length + 1,
//         value: "",
//         label: "",
//         notes: "",
//       },
//     ]);
//   };

//   const removeMeasurement = (index: number) => {
//     if (measurements.length === 1) return; // Keep at least one
//     const updated = measurements.filter((_, i) => i !== index);
//     // Renumber measurements
//     const renumbered = updated.map((m, i) => ({
//       ...m,
//       measurementNumber: i + 1,
//     }));
//     setMeasurements(renumbered);
//   };

//   const updateMeasurement = (
//     index: number,
//     field: keyof Measurement,
//     value: string,
//   ) => {
//     const updated = [...measurements];
//     updated[index] = { ...updated[index], [field]: value };
//     setMeasurements(updated);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate that at least one measurement has value and label
//     const validMeasurements = measurements.filter(
//       (m) => m.value.trim() && m.label.trim(),
//     );

//     if (validMeasurements.length === 0) {
//       alert("Please add at least one measurement with a value and label");
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const dimensionsRef = collection(
//         db,
//         "users",
//         userId,
//         "projects",
//         projectId,
//         "dimensions",
//       );

//       // Get current max order number
//       const currentMaxOrder =
//         savedDimensions.length > 0
//           ? Math.max(...savedDimensions.map((d) => d.order))
//           : 0;

//       // Save each valid measurement to Firestore
//       const savePromises = validMeasurements.map((m, index) =>
//         addDoc(dimensionsRef, {
//           measurementNumber: currentMaxOrder + index + 1,
//           value: parseInt(m.value),
//           label: m.label.trim(),
//           notes: m.notes.trim() || null,
//           createdAt: serverTimestamp(),
//           order: currentMaxOrder + index + 1,
//         }),
//       );

//       await Promise.all(savePromises);

//       // Create formatted message
//       let messageText = "📏 Dimensions Added:\n\n";
//       validMeasurements.forEach((m, index) => {
//         messageText += `${currentMaxOrder + index + 1}. ${parseInt(m.value).toLocaleString()}mm - ${m.label}`;
//         if (m.notes.trim()) {
//           messageText += `\n   Notes: ${m.notes}`;
//         }
//         messageText += "\n\n";
//       });

//       // Add message to project messages
//       await addDoc(
//         collection(db, "users", userId, "projects", projectId, "messages"),
//         {
//           text: messageText.trim(),
//           sender: "customer",
//           createdAt: serverTimestamp(),
//           read: false,
//         },
//       );

//       // Reset form
//       setMeasurements([
//         { measurementNumber: 1, value: "", label: "", notes: "" },
//       ]);
//       setShowForm(false);
//       alert("Dimensions saved successfully!");
//     } catch (error) {
//       console.error("Error saving dimensions:", error);
//       alert("Failed to save dimensions");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleEdit = (dimension: SavedDimension) => {
//     setEditingId(dimension.id);
//     setEditValues({
//       value: dimension.value.toString(),
//       label: dimension.label,
//       notes: dimension.notes || "",
//     });
//   };

//   const handleUpdate = async (dimensionId: string) => {
//     if (!editValues.value.trim() || !editValues.label.trim()) {
//       alert("Value and label are required");
//       return;
//     }

//     try {
//       const dimensionRef = doc(
//         db,
//         "users",
//         userId,
//         "projects",
//         projectId,
//         "dimensions",
//         dimensionId,
//       );
//       await updateDoc(dimensionRef, {
//         value: parseInt(editValues.value),
//         label: editValues.label.trim(),
//         notes: editValues.notes.trim() || null,
//       });
//       setEditingId(null);
//       setEditValues({ value: "", label: "", notes: "" });
//     } catch (error) {
//       console.error("Error updating dimension:", error);
//       alert("Failed to update dimension");
//     }
//   };

//   const handleDelete = async (dimensionId: string) => {
//     if (!confirm("Are you sure you want to delete this dimension?")) return;

//     try {
//       const dimensionRef = doc(
//         db,
//         "users",
//         userId,
//         "projects",
//         projectId,
//         "dimensions",
//         dimensionId,
//       );
//       await deleteDoc(dimensionRef);
//     } catch (error) {
//       console.error("Error deleting dimension:", error);
//       alert("Failed to delete dimension");
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditValues({ value: "", label: "", notes: "" });
//   };

//   return (
//     <div className="mt-4">
//       {/* Action Buttons */}
//       <div className="flex gap-2 mb-4">
//         <button
//           onClick={() => setShowForm(!showForm)}
//           className="bg-indigo-500 text-white text-sm py-2 px-4 rounded hover:bg-indigo-600"
//         >
//           {showForm ? "Cancel Adding Dimensions" : "📏 Add Dimensions"}
//         </button>
//         {savedDimensions.length > 0 && (
//           <button
//             onClick={() => setShowSaved(!showSaved)}
//             className="bg-gray-500 text-white text-sm py-2 px-4 rounded hover:bg-gray-600"
//           >
//             {showSaved
//               ? "Hide Saved Dimensions"
//               : `View Saved Dimensions (${savedDimensions.length})`}
//           </button>
//         )}
//       </div>

//       {/* Dimensions Form */}
//       {showForm && (
//         <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 mb-4">
//           <div className="mb-4 p-3 bg-blue-100 rounded border border-blue-300">
//             <p className="text-sm text-blue-800 font-semibold mb-1">
//               📐 Measuring Instructions:
//             </p>
//             <p className="text-xs text-blue-700">
//               Enter the room, turn left immediately, and start measuring from
//               the architraves (wooden borders around doors/windows). All
//               measurements in millimeters (mm).
//             </p>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="space-y-4 mb-4">
//               {measurements.map((measurement, index) => (
//                 <div
//                   key={index}
//                   className="p-4 bg-white rounded-lg border border-gray-300"
//                 >
//                   <div className="flex items-center justify-between mb-3">
//                     <h6 className="font-semibold text-gray-700">
//                       Measurement {measurement.measurementNumber}
//                     </h6>
//                     {measurements.length > 1 && (
//                       <button
//                         type="button"
//                         onClick={() => removeMeasurement(index)}
//                         className="text-red-500 hover:text-red-700 text-sm"
//                       >
//                         ✕ Remove
//                       </button>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                     {/* Value Input */}
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">
//                         Value (mm) *
//                       </label>
//                       <input
//                         type="number"
//                         value={measurement.value}
//                         onChange={(e) =>
//                           updateMeasurement(index, "value", e.target.value)
//                         }
//                         className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
//                         placeholder="e.g., 2450"
//                         required
//                       />
//                     </div>

//                     {/* Label Input */}
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">
//                         Label *
//                       </label>
//                       <input
//                         type="text"
//                         value={measurement.label}
//                         onChange={(e) =>
//                           updateMeasurement(index, "label", e.target.value)
//                         }
//                         className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
//                         placeholder="e.g., Wall 1 - Left to Door"
//                         required
//                       />
//                     </div>

//                     {/* Notes Input */}
//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1">
//                         Notes (optional)
//                       </label>
//                       <input
//                         type="text"
//                         value={measurement.notes}
//                         onChange={(e) =>
//                           updateMeasurement(index, "notes", e.target.value)
//                         }
//                         className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
//                         placeholder="e.g., Includes skirting"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 onClick={addMeasurement}
//                 className="bg-gray-500 text-white text-sm py-2 px-4 rounded hover:bg-gray-600"
//               >
//                 ➕ Add Another Measurement
//               </button>
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="bg-indigo-500 text-white text-sm py-2 px-6 rounded hover:bg-indigo-600 disabled:bg-gray-400"
//               >
//                 {submitting ? "Saving..." : "💾 Save Dimensions"}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Saved Dimensions List */}
//       {showSaved && (
//         <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
//           <h6 className="font-semibold text-gray-700 mb-3">Saved Dimensions</h6>

//           {dimensionsLoading ? (
//             <div className="text-center py-4 text-gray-500">
//               Loading dimensions...
//             </div>
//           ) : savedDimensions.length === 0 ? (
//             <div className="text-center py-4 text-gray-500">
//               No dimensions saved yet.
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {savedDimensions.map((dimension) => (
//                 <div
//                   key={dimension.id}
//                   className="p-3 bg-white rounded border border-gray-300"
//                 >
//                   {editingId === dimension.id ? (
//                     <div>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
//                         <div>
//                           <label className="block text-xs font-medium text-gray-700 mb-1">
//                             Value (mm)
//                           </label>
//                           <input
//                             type="number"
//                             value={editValues.value}
//                             onChange={(e) =>
//                               setEditValues({
//                                 ...editValues,
//                                 value: e.target.value,
//                               })
//                             }
//                             className="w-full border border-gray-300 rounded p-2 text-sm"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs font-medium text-gray-700 mb-1">
//                             Label
//                           </label>
//                           <input
//                             type="text"
//                             value={editValues.label}
//                             onChange={(e) =>
//                               setEditValues({
//                                 ...editValues,
//                                 label: e.target.value,
//                               })
//                             }
//                             className="w-full border border-gray-300 rounded p-2 text-sm"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs font-medium text-gray-700 mb-1">
//                             Notes
//                           </label>
//                           <input
//                             type="text"
//                             value={editValues.notes}
//                             onChange={(e) =>
//                               setEditValues({
//                                 ...editValues,
//                                 notes: e.target.value,
//                               })
//                             }
//                             className="w-full border border-gray-300 rounded p-2 text-sm"
//                           />
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleUpdate(dimension.id)}
//                           className="bg-green-500 text-white text-xs py-1 px-3 rounded hover:bg-green-600"
//                         >
//                           Save
//                         </button>
//                         <button
//                           onClick={handleCancelEdit}
//                           className="bg-gray-500 text-white text-xs py-1 px-3 rounded hover:bg-gray-600"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <>
//                       <div className="flex items-start justify-between mb-2">
//                         <div className="flex-1">
//                           <p className="font-semibold text-gray-800">
//                             {dimension.measurementNumber}.{" "}
//                             {dimension.value.toLocaleString()}mm -{" "}
//                             {dimension.label}
//                           </p>
//                           {dimension.notes && (
//                             <p className="text-sm text-gray-600 mt-1">
//                               Notes: {dimension.notes}
//                             </p>
//                           )}
//                           <p className="text-xs text-gray-400 mt-1">
//                             Added:{" "}
//                             {dimension.createdAt
//                               ? new Date(
//                                   dimension.createdAt.seconds * 1000,
//                                 ).toLocaleString()
//                               : "Just now"}
//                           </p>
//                         </div>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleEdit(dimension)}
//                             className="bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(dimension.id)}
//                             className="bg-red-500 text-white text-xs py-1 px-2 rounded hover:bg-red-600"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
