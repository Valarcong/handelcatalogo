
import React from "react";
import ClientesListPanel from "../components/clientes/ClientesListPanel";

const Clientes = () => (
  <div className="max-w-4xl mx-auto py-8 px-4">
    <h1 className="text-2xl md:text-3xl font-bold mb-4 text-brand-navy">Clientes</h1>
    <ClientesListPanel />
  </div>
);

export default Clientes;
