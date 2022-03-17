// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getStorage } from "firebase/storage";
import { collection, where, getDocs, query, limit } from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyBU_4lZXiYyq-yb9hJICATSqHv12gZSTDk",
    authDomain: "nextblog-5bbfd.firebaseapp.com",
    projectId: "nextblog-5bbfd",
    storageBucket: "nextblog-5bbfd.appspot.com",
    messagingSenderId: "674325322102",
    appId: "1:674325322102:web:48893d7ff9333a09474257",
    measurementId: "G-TSENT74EN7"
};

const createFirebaseApp = (config = {}) => {
    try {
        return getApp();
    } catch (e) {
        return initializeApp(config);
    }
};

const firebase = createFirebaseApp(firebaseConfig)

// Initialize Firebase
// export const firebase = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebase);
export const auth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider();

export const storage = getStorage(firebase);
export const STATE_CHANGED = 'state_changed';

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
    // const usersRef = collection(firestore, 'users');
    // const query = usersRef.where('username', '==', username).limit(1);

    const q = query(
        collection(firestore, 'users'),
        where('username', '==', username),
        limit(1)
    )
    const userDoc = (await getDocs(q)).docs[0];
    return userDoc;
}


/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
        createdAt: data?.createdAt.toMillis() || 0,
        updatedAt: data?.updatedAt.toMillis() || 0,
    };
}

