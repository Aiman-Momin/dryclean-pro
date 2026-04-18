/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Auth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';

export class AuthService {
  private provider = new GoogleAuthProvider();

  constructor(private auth: Auth) {}

  async login() {
    try {
      const result = await signInWithPopup(this.auth, this.provider);
      return result.user;
    } catch (error: any) {
      console.warn('Popup login failed, falling back to redirect sign-in.', error);
      if (
        error?.code === 'auth/popup-blocked' ||
        error?.code === 'auth/cancelled-popup-request' ||
        error?.code === 'auth/operation-not-supported-in-this-environment'
      ) {
        await signInWithRedirect(this.auth, this.provider);
        return null;
      }
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }
}
