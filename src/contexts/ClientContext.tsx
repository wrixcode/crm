import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, CallNote, CallStatus, Priority, ActivityType } from '@/types';

interface ClientContextType {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdDate' | 'notes'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addNote: (clientId: string, note: string, status: CallStatus, activityType?: ActivityType) => void;
  getClientById: (id: string) => Client | undefined;
  checkDuplicate: (phone: string, email?: string) => Client | null;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const storedClients = localStorage.getItem('crm_clients');
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('crm_clients', JSON.stringify(clients));
  }, [clients]);

  const addClient = (clientData: Omit<Client, 'id' | 'createdDate' | 'notes'>) => {
    const newClient: Client = {
      ...clientData,
      id: crypto.randomUUID(),
      createdDate: new Date().toISOString(),
      notes: []
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(client => 
      client.id === id 
        ? { ...client, ...updates, lastContactedDate: new Date().toISOString() }
        : client
    ));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  const addNote = (clientId: string, note: string, status: CallStatus, activityType: ActivityType = 'note') => {
    const newNote: CallNote = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      note,
      status,
      type: activityType
    };

    setClients(prev => prev.map(client => 
      client.id === clientId
        ? {
            ...client,
            notes: [...client.notes, newNote],
            status,
            lastContactedDate: new Date().toISOString()
          }
        : client
    ));
  };

  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  const checkDuplicate = (phone: string, email?: string): Client | null => {
    return clients.find(client => 
      client.phone === phone || (email && client.email === email)
    ) || null;
  };

  return (
    <ClientContext.Provider value={{
      clients,
      addClient,
      updateClient,
      deleteClient,
      addNote,
      getClientById,
      checkDuplicate
    }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClients must be used within ClientProvider');
  }
  return context;
};
