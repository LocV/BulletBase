import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5TPBX1bgr-VyE_rSILePnO9IEd9tiBpo",
  authDomain: "bulletbaseai.firebaseapp.com",
  projectId: "bulletbaseai",
  storageBucket: "bulletbaseai.firebasestorage.app",
  messagingSenderId: "169372050748",
  appId: "1:169372050748:web:fb9b5cb0664b5243fc2a39",
  measurementId: "G-WMWWYM1BHB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Factory load data
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

async function addFactoryLoads() {
  try {
    console.log('Adding factory load data to Firebase...');
    
    for (const load of factoryLoadData) {
      const loadData = {
        ...load,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'factoryLoad'), loadData);
      console.log(`✅ Added: ${load.manufacturer} ${load.product} - ${load.caliber} (ID: ${docRef.id})`);
    }
    
    console.log(`🎉 Successfully added ${factoryLoadData.length} factory loads!`);
    
  } catch (error) {
    console.error('Error adding factory loads:', error);
  }
}

// Run the script
addFactoryLoads();
