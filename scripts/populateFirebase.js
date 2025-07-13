import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Your Firebase configuration (same as in your app)
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
const auth = getAuth(app);

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
    bestGroup: "0.47 MOA",
    lastTested: new Date('2024-12-15'),
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-12-15')
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
    bestGroup: "0.68 MOA",
    lastTested: new Date('2024-12-10'),
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-12-10')
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
    bestGroup: "0.34 MOA",
    lastTested: new Date('2024-12-08'),
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2024-12-08')
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
    bestGroup: "0.85 MOA",
    lastTested: new Date('2024-12-05'),
    createdAt: new Date('2024-11-30'),
    updatedAt: new Date('2024-12-05')
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
    bestGroup: "1.2 MOA",
    lastTested: new Date('2024-12-12'),
    createdAt: new Date('2024-09-20'),
    updatedAt: new Date('2024-12-12')
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
    bestGroup: null,
    lastTested: null,
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01')
  }
];

async function populateFirebase() {
  try {
    // You need to sign in with a user account first
    console.log('Please provide your login credentials to add data to the database:');
    console.log('Make sure you have an account created in your Firebase app first.');
    
    // For security, you'll need to replace these with actual credentials
    // or run this interactively with prompts
    const email = process.env.FIREBASE_EMAIL || 'your-email@example.com';
    const password = process.env.FIREBASE_PASSWORD || 'your-password';
    
    if (email === 'your-email@example.com' || password === 'your-password') {
      console.log('Please set FIREBASE_EMAIL and FIREBASE_PASSWORD environment variables');
      console.log('Or modify the script to use your actual credentials');
      return;
    }
    
    // Sign in to Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Signed in as:', user.email);
    
    // Add sample load developments
    console.log('Adding sample load developments...');
    
    for (const load of sampleLoads) {
      const loadData = {
        ...load,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastTested: load.lastTested ? load.lastTested : null
      };
      
      const docRef = await addDoc(collection(db, 'loadDevelopment'), loadData);
      console.log(`Added load development: ${load.name} (ID: ${docRef.id})`);
    }
    
    console.log('Successfully added all sample data!');
    
  } catch (error) {
    console.error('Error adding data:', error);
  }
}

// Run the script
populateFirebase();
