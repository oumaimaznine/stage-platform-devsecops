import { useEffect, useState } from "react";
import api from "../api/axios";

const TABS = [
  { key: "offers", label: "Offres", endpoint: "/offers/pending/list", validateUrl: (id) => `/offers/${id}/valider` },
  { key: "conventions", label: "Conventions", endpoint: "/conventions/pending/list", validateUrl: (id) => `/conventions/${id}/valider` },
  { key: "reports", label: "Rapports", endpoint: "/reports/pending/list", validateUrl: (id) => `/reports/${id}/statut` },
];

export default function AdminValidation() {
  const [activeTab, setActiveTab] = useState("offers");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const tab = TABS.find((t) => t.key === activeTab);

  const load = () => {
    setLoading(true);
    api
      .get(tab.endpoint)
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [activeTab]);

  const handleAction = async (id, statut) => {
    await api.patch(tab.validateUrl(id), { statut });
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const renderItem = (item) => {
    if (activeTab === "offers") {
      return (
        <>
          <h3 className="font-semibold">{item.titre}</h3>
          <p className="text-sm text-gray-600">{item.company?.nom}</p>
          <p className="text-sm">{item.description}</p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => handleAction(item.id, "ouverte")} className="bg-green-600 text-white px-3 py-1 rounded">
              Valider
            </button>
            <button onClick={() => handleAction(item.id, "fermee")} className="bg-red-500 text-white px-3 py-1 rounded">
              Rejeter
            </button>
          </div>
        </>
      );
    }
    if (activeTab === "conventions") {
      return (
        <>
          <h3 className="font-semibold">
            {item.application?.student?.user?.name} — {item.application?.offer?.titre}
          </h3>
          <p className="text-sm text-gray-600">{item.application?.offer?.company?.nom}</p>
          <a href={`http://localhost:8000/storage/${item.fichier_path}`} target="_blank" rel="noreferrer" className="text-blue-600 text-sm underline">
            Voir le fichier
          </a>
          <div className="flex gap-2 mt-2">
            <button onClick={() => handleAction(item.id, "validee_admin")} className="bg-green-600 text-white px-3 py-1 rounded">
              Valider
            </button>
            <button onClick={() => handleAction(item.id, "rejetee")} className="bg-red-500 text-white px-3 py-1 rounded">
              Rejeter
            </button>
          </div>
        </>
      );
    }
    return (
      <>
        <h3 className="font-semibold">{item.titre}</h3>
        <p className="text-sm text-gray-600">{item.convention?.application?.student?.user?.name}</p>
        <a href={`http://localhost:8000/storage/${item.fichier_path}`} target="_blank" rel="noreferrer" className="text-blue-600 text-sm underline">
          Voir le rapport
        </a>
        <div className="flex gap-2 mt-2">
          <button onClick={() => handleAction(item.id, "valide")} className="bg-green-600 text-white px-3 py-1 rounded">
            Valider
          </button>
          <button onClick={() => handleAction(item.id, "rejete")} className="bg-red-500 text-white px-3 py-1 rounded">
            Rejeter
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Validation administration</h1>

      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded ${activeTab === t.key ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">Rien à valider pour le moment.</p>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="border p-4 rounded">
              {renderItem(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
