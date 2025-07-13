// Browser Console Script to Add Sample Data
// Copy and paste this into your browser console while logged into your app

// Sample load development data
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
  }
];

// Function to add sample data (run this in browser console)
async function addSampleData() {
  // Import Firebase functions (they should be available in your app)
  const { collection, addDoc, serverTimestamp } = window.firebase.firestore || 
    (await import('firebase/firestore'));
  
  // Get current user (should be available in your app context)
  const currentUser = window.firebase.auth().currentUser;
  
  if (!currentUser) {
    console.error('No user logged in. Please log in first.');
    return;
  }
  
  console.log('Adding sample data for user:', currentUser.email);
  
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
      
      const docRef = await addDoc(collection(window.firebase.firestore(), 'loadDevelopment'), loadData);
      console.log(`✅ Added: ${load.name} (ID: ${docRef.id})`);
    }
    
    console.log('🎉 Successfully added all sample data!');
    console.log('Refresh your dashboard to see the new data.');
    
  } catch (error) {
    console.error('Error adding data:', error);
  }
}

// Instructions
console.log('📋 Instructions:');
console.log('1. Make sure you are logged into your BulletBaseAI app');
console.log('2. Run: addSampleData()');
console.log('3. Check your dashboard to see the new load developments');
