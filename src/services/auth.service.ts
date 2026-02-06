import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "@/config/firebase";
import type { User, UserRole, AdminRegistrationData, StaffRegistrationData, ClientRegistrationData } from "@/types";

/* ================= REGISTER ================= */

export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<void> {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await sendEmailVerification(credential.user);

  // Wait until auth state is ready
  await new Promise<void>((resolve) => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        unsub();
        resolve();
      }
    });
  });

  await setDoc(doc(db, "users", credential.user.uid), {
    userId: credential.user.uid,
    username,
    email,
    role: "client",
    status: "pending",
    createdAt: serverTimestamp(),
    lastLoginAt: null,
  });

  await signOut(auth);
}

/* ================= REGISTER WITH ROLE ================= */

export async function registerWithRole(
  email: string,
  password: string,
  role: UserRole,
  profileData: AdminRegistrationData | StaffRegistrationData | ClientRegistrationData
): Promise<{ success: boolean; error?: string }> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    await sendEmailVerification(credential.user);

    // Wait until auth state is ready
    await new Promise<void>((resolve) => {
      const unsub = onAuthStateChanged(auth, (u) => {
        if (u) {
          unsub();
          resolve();
        }
      });
    });

    // Create user document
    await setDoc(doc(db, "users", credential.user.uid), {
      userId: credential.user.uid,
      name: profileData.name,
      email,
      role,
      status: profileData.status || "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Create role-specific profile
    if (role === 'admin') {
      const adminData = profileData as AdminRegistrationData;
      await setDoc(doc(db, "admins", credential.user.uid), {
        adminId: credential.user.uid,
        employeeId: `EMP-${Date.now()}`,
        mobile: adminData.mobile,
        department: adminData.department,
        accessLevel: adminData.accessLevel,
        backupEmail: adminData.backupEmail,
      });
    } else if (role === 'staff') {
      const staffData = profileData as StaffRegistrationData;
      await setDoc(doc(db, "staff", credential.user.uid), {
        staffId: credential.user.uid,
        employeeId: `EMP-${Date.now()}`,
        mobile: staffData.mobile,
        department: staffData.department,
        accessLevel: staffData.accessLevel,
        position: staffData.position,
      });
    } else if (role === 'client') {
      const clientData = profileData as ClientRegistrationData;
      await setDoc(doc(db, "clients", credential.user.uid), {
        clientId: credential.user.uid,
        mobile: clientData.mobile,
        businessName: clientData.businessName,
        address: clientData.address,
        city: clientData.city,
        handlingWebsite: clientData.handlingWebsite,
        handlingChatbot: clientData.handlingChatbot,
        handlingAiAgent: clientData.handlingAiAgent,
        handlingAppointments: clientData.handlingAppointments,
        handlingMarketing: clientData.handlingMarketing,
        additionalNotes: clientData.additionalNotes,
        createdAt: serverTimestamp(),
      });
    }

    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/* ================= LOGIN ================= */

export async function loginWithEmail(
  email: string,
  password: string
): Promise<FirebaseUser> {
  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  if (!credential.user.emailVerified) {
    await signOut(auth);
    throw new Error("Please verify your email before logging in.");
  }

  return credential.user;
}

/* ================= EMAIL ================= */

export async function resendVerificationEmail(): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user.");
  if (user.emailVerified) throw new Error("Email already verified.");

  await sendEmailVerification(user);
}

/* ================= SESSION ================= */

const KEY = "lucidence_user";

export function storeUser(user: User) {
  sessionStorage.setItem(KEY, JSON.stringify(user));
}

export function getStoredUser(): User | null {
  const raw = sessionStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearStoredUser() {
  sessionStorage.removeItem(KEY);
}

export function signOutUser() {
  clearStoredUser();
  return signOut(auth);
}

export function subscribeToAuthState(
  cb: (user: FirebaseUser | null) => void
) {
  return onAuthStateChanged(auth, cb);
}
