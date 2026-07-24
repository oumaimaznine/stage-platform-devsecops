import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/students")
      .then((res) => setStudents(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Étudiants</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Matricule</th>
            <th className="p-2">Nom</th>
            <th className="p-2">Filière</th>
            <th className="p-2">Niveau</th>
            <th className="p-2">Téléphone</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-b">
              <td className="p-2">{s.matricule}</td>
              <td className="p-2">{s.user?.name}</td>
              <td className="p-2">{s.filiere}</td>
              <td className="p-2">{s.niveau}</td>
              <td className="p-2">{s.telephone ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {students.length === 0 && <p className="text-gray-500 mt-4">Aucun étudiant.</p>}
    </div>
  );
}
