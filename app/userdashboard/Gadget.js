'use client';
import { useState } from 'react';

export default function Gadget() {
  const [gadgets, setGadgets] = useState([]);
  const [newGadget, setNewGadget] = useState({ 
    name: '', 
    brand: '', 
    price: '', 
    description: '' 
  });

  const handleAddGadget = () => {
    if (newGadget.name && newGadget.brand && newGadget.price) {
      setGadgets([...gadgets, { ...newGadget, id: Date.now() }]);
      setNewGadget({ name: '', brand: '', price: '', description: '' });
    }
  };

  const handleDeleteGadget = (id) => {
    setGadgets(gadgets.filter(gadget => gadget.id !== id));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Add Gadget</h2>
        <div className="space-y-4">
          <input 
            type="text"
            placeholder="Gadget Name" 
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newGadget.name}
            onChange={(e) => setNewGadget({...newGadget, name: e.target.value})}
          />
          <input 
            type="text"
            placeholder="Brand" 
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newGadget.brand}
            onChange={(e) => setNewGadget({...newGadget, brand: e.target.value})}
          />
          <input 
            type="number"
            placeholder="Price" 
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newGadget.price}
            onChange={(e) => setNewGadget({...newGadget, price: e.target.value})}
          />
          <textarea 
            placeholder="Description" 
            className="w-full px-3 py-2 border rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newGadget.description}
            onChange={(e) => setNewGadget({...newGadget, description: e.target.value})}
          />
          <button 
            onClick={handleAddGadget}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Gadget
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Gadgets List</h2>
        {gadgets.map((gadget) => (
          <div key={gadget.id} className="border-b py-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">{gadget.name}</h3>
              <p className="text-gray-600">{gadget.brand}</p>
              <p className="text-gray-500">₹{gadget.price}</p>
              <p className="text-gray-500 mt-2">{gadget.description}</p>
            </div>
            <button 
              onClick={() => handleDeleteGadget(gadget.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}