import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/companies")
      .then((res) => setCompanies(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Entreprises</h1>
      <div className="grid gap-4">
        {companies.map((company) => (
          <div key={company.id} className="border p-4 rounded">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold">{company.nom}</h2>
                <p className="text-sm text-gray-600">{company.secteur}</p>
                <p className="text-sm">{company.adresse}</p>
                {company.site_web && (
                  <a href={company.site_web} target="_blank" rel="noreferrer" className="text-blue-600 text-sm underline">
                    {company.site_web}
                  </a>
                )}
              </div>
              <span className={`text-xs px-2 py-1 rounded ${company.valide ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {company.valide ? "Validée" : "En attente"}
              </span>
            </div>
          </div>
        ))}
        {companies.length === 0 && <p className="text-gray-500">Aucune entreprise.</p>}
      </div>
    </div>
  );
}
