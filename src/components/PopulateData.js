import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

const PopulateData = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sampleLoads = [
    {
      name: ".308 Winchester - Match Load",
      cartridge: ".308 Winchester",
      bullet: {
        weight: "175",
        type: "Sierra MatchKing BTHP",
        manufacturer: "Sierra"
      },
      powder: {
        type: "Varget",
        weight: "43.5"
      },
      primer: "Federal 210M",
      brass: "Lapua",
      notes: "Excellent accuracy load for long-range precision shooting. Consistent velocity and tight groups.",
      goal: "precision",
      status: "Complete",
      sessions: 3,
      bestGroup: "0.47 MOA"
    },
    {
      name: "6.5 Creedmoor - Hunting Load",
      cartridge: "6.5 Creedmoor",
      bullet: {
        weight: "140",
        type: "Hornady ELD-X",
        manufacturer: "Hornady"
      },
      powder: {
        type: "H4350",
        weight: "41.0"
      },
      primer: "CCI 200",
      brass: "Hornady",
      notes: "Balanced load for hunting applications. Good expansion and penetration.",
      goal: "hunting",
      status: "In Progress",
      sessions: 2,
      bestGroup: "0.68 MOA"
    },
    {
      name: ".223 Remington - Varmint Load",
      cartridge: ".223 Remington",
      bullet: {
        weight: "55",
        type: "Hornady V-MAX",
        manufacturer: "Hornady"
      },
      powder: {
        type: "CFE 223",
        weight: "25.5"
      },
      primer: "CCI 400",
      brass: "Winchester",
      notes: "High-velocity varmint load. Excellent expansion on small game.",
      goal: "varmint",
      status: "Complete",
      sessions: 4,
      bestGroup: "0.34 MOA"
    },
    {
      name: ".300 Winchester Magnum - Long Range",
      cartridge: ".300 Winchester Magnum",
      bullet: {
        weight: "190",
        type: "Berger VLD Hunting",
        manufacturer: "Berger"
      },
      powder: {
        type: "H1000",
        weight: "72.0"
      },
      primer: "Federal 215M",
      brass: "Norma",
      notes: "Long-range hunting load. Excellent ballistic coefficient and energy retention.",
      goal: "hunting",
      status: "Testing",
      sessions: 1,
      bestGroup: "0.85 MOA"
    },
    {
      name: "9mm Luger - Competition Load",
      cartridge: "9mm Luger",
      bullet: {
        weight: "124",
        type: "Hornady HAP",
        manufacturer: "Hornady"
      },
      powder: {
        type: "Titegroup",
        weight: "4.2"
      },
      primer: "CCI 500",
      brass: "Starline",
      notes: "USPSA Production division load. Consistent accuracy and reliable cycling.",
      goal: "competition",
      status: "Complete",
      sessions: 5,
      bestGroup: "1.2 MOA"
    },
    {
      name: ".45 ACP - Target Load",
      cartridge: ".45 ACP",
      bullet: {
        weight: "230",
        type: "Hornady XTP",
        manufacturer: "Hornady"
      },
      powder: {
        type: "Unique",
        weight: "6.8"
      },
      primer: "CCI 300",
      brass: "Winchester",
      notes: "Classic target load. Mild recoil with good accuracy.",
      goal: "precision",
      status: "Planning",
      sessions: 0,
      bestGroup: null
    }
  ];

  const addSampleData = async () => {
    if (!currentUser) {
      setMessage('Please log in first.');
      return;
    }

    setIsLoading(true);
    setMessage('Adding sample data...');

    try {
      for (const load of sampleLoads) {
        const loadData = {
          ...load,
          userId: currentUser.uid,
          status: load.status || 'Planning',
          sessions: load.sessions || 0,
          bestGroup: load.bestGroup || null,
          createdAt: serverTimestamp(),
          lastTested: load.lastTested || null,
          updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'loadDevelopment'), loadData);
        console.log(`Added: ${load.name} (ID: ${docRef.id})`);
      }

      setMessage(`Successfully added ${sampleLoads.length} sample load developments!`);
    } catch (error) {
      console.error('Error adding data:', error);
      setMessage('Error adding data. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5', 
      borderRadius: '8px', 
      margin: '20px',
      textAlign: 'center'
    }}>
      <h2>Populate Sample Data</h2>
      <p>This will add {sampleLoads.length} sample load developments to your database.</p>
      
      <button 
        onClick={addSampleData}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {isLoading ? 'Adding Data...' : 'Add Sample Data'}
      </button>
      
      {message && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px',
          backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e8',
          color: message.includes('Error') ? '#c62828' : '#2e7d32',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Sample data includes:</strong></p>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>.308 Winchester - Match Load</li>
          <li>6.5 Creedmoor - Hunting Load</li>
          <li>.223 Remington - Varmint Load</li>
          <li>.300 Winchester Magnum - Long Range</li>
          <li>9mm Luger - Competition Load</li>
          <li>.45 ACP - Target Load</li>
        </ul>
      </div>
    </div>
  );
};

export default PopulateData;
