import { UserData } from "@/store/ModalChat";

interface Medication {
  id: number;
  name: string;
  description: string;
  indication: string;
  contraindication: string;
  dose: string;
  price: number;
  reason?: string;
  imageUrl: string;
}

interface Dosis {
  medicamento: string;
  dosis: string;
  duracion: string;
}

interface ChatHistory {
  id: string;
  timestamp: number;
  sintomas: string;
  userData: UserData;
  respuesta_gemini: string;
  medicamentos: Medication[];
  dosis_recomendada: Dosis[];
  imageData?: string;
}

class ChatDB {
  private dbName = 'FarmaAI_ChatHistory';
  private dbVersion = 1;
  private storeName = 'chats';

  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async saveChat(chatData: Omit<ChatHistory, 'id' | 'timestamp'>): Promise<string> {
    const db = await this.openDB();
    const id = Date.now().toString();
    const timestamp = Date.now();
    
    const fullChatData: ChatHistory = {
      id,
      timestamp,
      ...chatData
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(fullChatData);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(id);
    });
  }

  async getChat(id: string): Promise<ChatHistory | null> {
    const db = await this.openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async getAllChats(): Promise<ChatHistory[]> {
    const db = await this.openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('timestamp');
      const request = index.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const chats = request.result.sort((a, b) => b.timestamp - a.timestamp);
        resolve(chats);
      };
    });
  }

  async deleteChat(id: string): Promise<void> {
    const db = await this.openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clearAllChats(): Promise<void> {
    const db = await this.openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const chatDB = new ChatDB();
export type { ChatHistory };