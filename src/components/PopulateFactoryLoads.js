import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const PopulateFactoryLoads = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const factoryLoadData = [
    {
      caliber: ".223 Remington / 5.56 NATO",
      manufacturer: "Hornady",
      product: "Frontier",
      bulletWeight: "55-grain",
      bulletType: "FMJ",
      use: "Target/Range",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".223 Remington / 5.56 NATO",
      manufacturer: "Federal",
      product: "American Eagle",
      bulletWeight: "62-grain",
      bulletType: "FMJ",
      use: "Target/Range",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".223 Remington / 5.56 NATO",
      manufacturer: "Winchester",
      product: "M855",
      bulletWeight: "62-grain",
      bulletType: "Green Tip",
      use: "Target/Range",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".223 Remington / 5.56 NATO",
      manufacturer: "PMC",
      product: "X-TAC",
      bulletWeight: "55-grain",
      bulletType: "FMJ-BT",
      use: "Target/Range",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".223 Remington / 5.56 NATO",
      manufacturer: "Federal",
      product: "Fusion",
      bulletWeight: "62-grain",
      bulletType: "Bonded SP",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".308 Winchester",
      manufacturer: "Hornady",
      product: "Precision Hunter",
      bulletWeight: "178-grain",
      bulletType: "ELD-X",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".308 Winchester",
      manufacturer: "Federal",
      product: "Premium",
      bulletWeight: "168-grain",
      bulletType: "Sierra MatchKing",
      use: "Match/Precision",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".308 Winchester",
      manufacturer: "Nosler",
      product: "Trophy Grade",
      bulletWeight: "165-grain",
      bulletType: "AccuBond",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".308 Winchester",
      manufacturer: "Winchester",
      product: "Super-X",
      bulletWeight: "150-grain",
      bulletType: "Power-Point",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".308 Winchester",
      manufacturer: "Barnes",
      product: "VOR-TX",
      bulletWeight: "150-grain",
      bulletType: "TTSX",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: "6.5 Creedmoor",
      manufacturer: "Hornady",
      product: "Precision Hunter",
      bulletWeight: "143-grain",
      bulletType: "ELD-X",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: "6.5 Creedmoor",
      manufacturer: "Federal",
      product: "Premium",
      bulletWeight: "140-grain",
      bulletType: "Berger Hybrid Hunter",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: "6.5 Creedmoor",
      manufacturer: "Nosler",
      product: "Trophy Grade",
      bulletWeight: "129-grain",
      bulletType: "AccuBond",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: "6.5 Creedmoor",
      manufacturer: "Winchester",
      product: "Deer Season XP",
      bulletWeight: "125-grain",
      bulletType: "Extreme Point",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: "6.5 Creedmoor",
      manufacturer: "Barnes",
      product: "VOR-TX",
      bulletWeight: "120-grain",
      bulletType: "TTSX",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: "7mm Remington Magnum",
      manufacturer: "Hornady",
      product: "Precision Hunter",
      bulletWeight: "162-grain",
      bulletType: "ELD-X",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: "7mm Remington Magnum",
      manufacturer: "Federal",
      product: "Premium",
      bulletWeight: "160-grain",
      bulletType: "Nosler AccuBond",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: "7mm Remington Magnum",
      manufacturer: "Nosler",
      product: "Trophy Grade",
      bulletWeight: "150-grain",
      bulletType: "Partition",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: "7mm Remington Magnum",
      manufacturer: "Remington",
      product: "Core-Lokt",
      bulletWeight: "150-grain",
      bulletType: "PSP",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: "7mm Remington Magnum",
      manufacturer: "Winchester",
      product: "Power Max",
      bulletWeight: "150-grain",
      bulletType: "Bonded",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".300 Winchester Magnum",
      manufacturer: "Hornady",
      product: "Precision Hunter",
      bulletWeight: "200-grain",
      bulletType: "ELD-X",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".300 Winchester Magnum",
      manufacturer: "Federal",
      product: "Premium",
      bulletWeight: "180-grain",
      bulletType: "Nosler AccuBond",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".300 Winchester Magnum",
      manufacturer: "Nosler",
      product: "Trophy Grade",
      bulletWeight: "180-grain",
      bulletType: "Partition",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".300 Winchester Magnum",
      manufacturer: "Winchester",
      product: "Expedition",
      bulletWeight: "190-grain",
      bulletType: "AccuBond LR",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".300 Winchester Magnum",
      manufacturer: "Barnes",
      product: "VOR-TX",
      bulletWeight: "165-grain",
      bulletType: "TTSX",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".243 Winchester",
      manufacturer: "Hornady",
      product: "Superformance",
      bulletWeight: "95-grain",
      bulletType: "SST",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".243 Winchester",
      manufacturer: "Federal",
      product: "Premium",
      bulletWeight: "100-grain",
      bulletType: "Nosler Partition",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".243 Winchester",
      manufacturer: "Winchester",
      product: "Deer Season XP",
      bulletWeight: "95-grain",
      bulletType: "Extreme Point",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".243 Winchester",
      manufacturer: "Nosler",
      product: "Trophy Grade",
      bulletWeight: "90-grain",
      bulletType: "AccuBond",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".243 Winchester",
      manufacturer: "Remington",
      product: "Core-Lokt",
      bulletWeight: "100-grain",
      bulletType: "PSP",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".270 Winchester",
      manufacturer: "Hornady",
      product: "Precision Hunter",
      bulletWeight: "145-grain",
      bulletType: "ELD-X",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".270 Winchester",
      manufacturer: "Federal",
      product: "Premium",
      bulletWeight: "130-grain",
      bulletType: "Berger Hybrid Hunter",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".270 Winchester",
      manufacturer: "Nosler",
      product: "Trophy Grade",
      bulletWeight: "130-grain",
      bulletType: "AccuBond",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".270 Winchester",
      manufacturer: "Winchester",
      product: "Super-X",
      bulletWeight: "130-grain",
      bulletType: "Power-Point",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".270 Winchester",
      manufacturer: "Remington",
      product: "Core-Lokt",
      bulletWeight: "130-grain",
      bulletType: "PSP",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".30-06 Springfield",
      manufacturer: "Hornady",
      product: "Precision Hunter",
      bulletWeight: "178-grain",
      bulletType: "ELD-X",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".30-06 Springfield",
      manufacturer: "Federal",
      product: "Premium",
      bulletWeight: "165-grain",
      bulletType: "Nosler AccuBond",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".30-06 Springfield",
      manufacturer: "Nosler",
      product: "Trophy Grade",
      bulletWeight: "180-grain",
      bulletType: "Partition",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".30-06 Springfield",
      manufacturer: "Winchester",
      product: "Super-X",
      bulletWeight: "150-grain",
      bulletType: "Power-Point",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".30-06 Springfield",
      manufacturer: "Barnes",
      product: "VOR-TX",
      bulletWeight: "150-grain",
      bulletType: "TTSX",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".300 Blackout",
      manufacturer: "Hornady",
      product: "Black",
      bulletWeight: "110-grain",
      bulletType: "V-MAX",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".300 Blackout",
      manufacturer: "Federal",
      product: "American Eagle",
      bulletWeight: "150-grain",
      bulletType: "FMJ",
      use: "Target/Range",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".300 Blackout",
      manufacturer: "Barnes",
      product: "VOR-TX",
      bulletWeight: "110-grain",
      bulletType: "TAC-TX",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".300 Blackout",
      manufacturer: "Sig Sauer",
      product: "Elite",
      bulletWeight: "125-grain",
      bulletType: "OTM",
      use: "Target/Range",
      cartridgeType: "Rifle"
    },
    {
      caliber: ".300 Blackout",
      manufacturer: "Remington",
      product: "Subsonic",
      bulletWeight: "220-grain",
      bulletType: "OTM",
      use: "Subsonic",
      cartridgeType: "Rifle"
    },
    {
      caliber: "6.5 PRC",
      manufacturer: "Hornady",
      product: "Precision Hunter",
      bulletWeight: "143-grain",
      bulletType: "ELD-X",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: "6.5 PRC",
      manufacturer: "Federal",
      product: "Premium",
      bulletWeight: "130-grain",
      bulletType: "Berger Hybrid Hunter",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: "6.5 PRC",
      manufacturer: "Nosler",
      product: "Trophy Grade",
      bulletWeight: "129-grain",
      bulletType: "AccuBond",
      use: "Hunting",
      cartridgeType: "Rifle"
    },
    {
      caliber: "6.5 PRC",
      manufacturer: "Browning",
      product: "Long Range Pro",
      bulletWeight: "135-grain",
      bulletType: "Sierra MatchKing",
      use: "Match/Precision",
      cartridgeType: "Rifle"
    },
    {
      caliber: "6.5 PRC",
      manufacturer: "Hornady",
      product: "Outfitter",
      bulletWeight: "130-grain",
      bulletType: "CX",
      use: "Hunting",
      cartridgeType: "Rifle"
    }
  ];

  const addFactoryLoads = async () => {
    setIsLoading(true);
    setMessage('Adding factory load data...');

    try {
      for (const load of factoryLoadData) {
        const loadData = {
          ...load,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'factoryLoad'), loadData);
        console.log(`Added: ${load.manufacturer} ${load.product} - ${load.caliber} (ID: ${docRef.id})`);
      }

      setMessage(`Successfully added ${factoryLoadData.length} factory loads to the database!`);
    } catch (error) {
      console.error('Error adding factory loads:', error);
      setMessage('Error adding factory loads. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f8ff', 
      borderRadius: '8px', 
      margin: '20px',
      textAlign: 'center'
    }}>
      <h2>Populate Factory Load Data</h2>
      <p>This will add {factoryLoadData.length} factory ammunition load records to the database.</p>
      
      <button 
        onClick={addFactoryLoads}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {isLoading ? 'Adding Factory Loads...' : 'Add Factory Load Data'}
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
        <p><strong>Factory loads include:</strong></p>
        <ul style={{ textAlign: 'left', display: 'inline-block', columnCount: 2 }}>
          <li>.223 Remington / 5.56 NATO (5 loads)</li>
          <li>.308 Winchester (5 loads)</li>
          <li>6.5 Creedmoor (5 loads)</li>
          <li>7mm Remington Magnum (5 loads)</li>
          <li>.300 Winchester Magnum (5 loads)</li>
          <li>.243 Winchester (5 loads)</li>
          <li>.270 Winchester (5 loads)</li>
          <li>.30-06 Springfield (5 loads)</li>
          <li>.300 Blackout (5 loads)</li>
          <li>6.5 PRC (5 loads)</li>
        </ul>
      </div>
    </div>
  );
};

export default PopulateFactoryLoads;
